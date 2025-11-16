import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  Sse,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { ChatService } from './chat.service';
import { SendMessageDto, CreateConversationDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface MessageEvent {
  data: string;
}

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Send a message with streaming response
   * Uses Server-Sent Events (SSE) for real-time streaming
   */
  @Sse('message/stream')
  async streamMessage(@Body() dto: SendMessageDto): Promise<Observable<MessageEvent>> {
    return new Observable((observer) => {
      (async () => {
        try {
          for await (const event of this.chatService.sendMessage(dto)) {
            observer.next({
              data: JSON.stringify(event),
            });
          }
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      })();
    });
  }

  /**
   * Send a message (non-streaming, returns full response)
   */
  @Post('message')
  @HttpCode(HttpStatus.OK)
  async sendMessage(@Body() dto: SendMessageDto) {
    const events: any[] = [];

    for await (const event of this.chatService.sendMessage(dto)) {
      events.push(event);
    }

    // Extract the relevant data from events
    const conversationId = events.find(e => e.type === 'conversation_id')?.data;
    const messageId = events.find(e => e.type === 'message_id')?.data;
    const content = events
      .filter(e => e.type === 'content')
      .map(e => e.data)
      .join('');

    return {
      conversationId,
      messageId,
      content,
      role: 'assistant',
    };
  }

  /**
   * Get all conversations
   */
  @Get('conversations')
  async getConversations(
    @Query('userId') userId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getConversations(userId, limit ? Number(limit) : 20);
  }

  /**
   * Create a new conversation
   */
  @Post('conversations')
  async createConversation(@Body() dto: CreateConversationDto) {
    return this.chatService.createConversation(dto);
  }

  /**
   * Get a specific conversation with messages
   */
  @Get('conversations/:id')
  async getConversation(@Param('id') id: string) {
    return this.chatService.getConversation(id);
  }

  /**
   * Delete a conversation
   */
  @Delete('conversations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteConversation(@Param('id') id: string) {
    await this.chatService.deleteConversation(id);
  }

  /**
   * Get messages for a conversation
   */
  @Get('conversations/:id/messages')
  async getMessages(
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getMessages(id, cursor, limit ? Number(limit) : 50);
  }
}

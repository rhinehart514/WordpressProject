import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConversationRepository, MessageRepository } from '../../repositories';
import { OpenAIService, ChatMessage } from '../openai';
import { SendMessageDto, CreateConversationDto } from './dto';
import { Conversation, Message, MessageRole, PrismaClient } from '@prisma/client';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly conversationRepo: ConversationRepository,
    private readonly messageRepo: MessageRepository,
    private readonly openaiService: OpenAIService,
    private readonly prisma: PrismaClient,
  ) {}

  /**
   * Send a message and get a streaming response
   */
  async *sendMessage(dto: SendMessageDto): AsyncIterable<{
    type: 'conversation_id' | 'message_id' | 'content' | 'done';
    data: any;
  }> {
    try {
      // Step 1: Get or create conversation
      let conversation: Conversation;

      if (dto.conversationId) {
        const existing = await this.conversationRepo.findById(dto.conversationId);
        if (!existing) {
          throw new NotFoundException(`Conversation ${dto.conversationId} not found`);
        }
        conversation = existing;
      } else {
        // Create new conversation
        conversation = await this.conversationRepo.create({
          userId: dto.userId,
          metadata: dto.metadata,
        });

        // Yield conversation ID immediately
        yield {
          type: 'conversation_id',
          data: conversation.id,
        };
      }

      // Step 2: Save user message
      const userMessage = await this.messageRepo.create({
        conversationId: conversation.id,
        role: 'USER' as MessageRole,
        content: dto.content,
        metadata: dto.metadata,
      });

      // Step 3: Get conversation history
      const history = await this.messageRepo.findByConversationId(conversation.id);

      // Format for OpenAI
      const chatMessages: ChatMessage[] = history.map((msg) => ({
        role: msg.role.toLowerCase() as 'user' | 'assistant' | 'system',
        content: msg.content,
      }));

      // Step 4: Create placeholder for assistant message
      const assistantMessage = await this.messageRepo.create({
        conversationId: conversation.id,
        role: 'ASSISTANT' as MessageRole,
        content: '', // Will be updated
      });

      yield {
        type: 'message_id',
        data: assistantMessage.id,
      };

      // Step 5: Stream response from OpenAI
      let fullResponse = '';

      for await (const chunk of this.openaiService.streamChatCompletion(chatMessages)) {
        fullResponse += chunk;

        yield {
          type: 'content',
          data: chunk,
        };
      }

      // Step 6: Update assistant message with full content
      await this.prisma.message.update({
        where: { id: assistantMessage.id },
        data: { content: fullResponse },
      });

      // Step 7: Generate title if this is the first exchange
      if (history.length === 1) {
        const title = await this.openaiService.generateConversationTitle(dto.content);
        await this.conversationRepo.update(conversation.id, { title });
      }

      yield {
        type: 'done',
        data: {
          conversationId: conversation.id,
          messageId: assistantMessage.id,
        },
      };

    } catch (error) {
      this.logger.error('Error in sendMessage', error);
      throw error;
    }
  }

  /**
   * Get conversation by ID with messages
   */
  async getConversation(id: string) {
    const conversation = await this.conversationRepo.findById(id);
    if (!conversation) {
      throw new NotFoundException(`Conversation ${id} not found`);
    }
    return conversation;
  }

  /**
   * Get all conversations for a user
   */
  async getConversations(userId?: string, limit: number = 20) {
    if (userId) {
      return this.conversationRepo.findByUserId(userId, limit);
    }
    return this.conversationRepo.findAll(limit);
  }

  /**
   * Create a new conversation
   */
  async createConversation(dto: CreateConversationDto) {
    return this.conversationRepo.create(dto);
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(id: string) {
    const conversation = await this.conversationRepo.findById(id);
    if (!conversation) {
      throw new NotFoundException(`Conversation ${id} not found`);
    }
    return this.conversationRepo.delete(id);
  }

  /**
   * Get messages for a conversation with pagination
   */
  async getMessages(conversationId: string, cursor?: string, limit: number = 50) {
    return this.messageRepo.findWithPagination(conversationId, cursor, limit);
  }
}

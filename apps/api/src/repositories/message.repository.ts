import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient, Message, MessageRole } from '@prisma/client';

export interface CreateMessageDto {
  conversationId: string;
  role: MessageRole;
  content: string;
  metadata?: any;
}

@Injectable()
export class MessageRepository {
  private readonly logger = new Logger(MessageRepository.name);

  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Create a new message
   */
  async create(data: CreateMessageDto): Promise<Message> {
    return this.prisma.message.create({
      data: {
        conversationId: data.conversationId,
        role: data.role,
        content: data.content,
        metadata: data.metadata,
      },
    });
  }

  /**
   * Find message by ID
   */
  async findById(id: string): Promise<Message | null> {
    return this.prisma.message.findUnique({
      where: { id },
    });
  }

  /**
   * Find all messages for a conversation
   */
  async findByConversationId(
    conversationId: string,
    limit?: number,
  ): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: {
        createdAt: 'asc',
      },
      ...(limit && { take: limit }),
    });
  }

  /**
   * Find messages with pagination
   */
  async findWithPagination(
    conversationId: string,
    cursor?: string,
    limit: number = 50,
  ): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1, // Skip the cursor
      }),
    });
  }

  /**
   * Get latest message in a conversation
   */
  async getLatest(conversationId: string): Promise<Message | null> {
    return this.prisma.message.findFirst({
      where: { conversationId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Count messages in a conversation
   */
  async countByConversationId(conversationId: string): Promise<number> {
    return this.prisma.message.count({
      where: { conversationId },
    });
  }

  /**
   * Delete message
   */
  async delete(id: string): Promise<Message> {
    return this.prisma.message.delete({
      where: { id },
    });
  }

  /**
   * Delete all messages in a conversation
   */
  async deleteByConversationId(conversationId: string): Promise<number> {
    const result = await this.prisma.message.deleteMany({
      where: { conversationId },
    });
    return result.count;
  }

  /**
   * Get first user message in conversation (useful for title generation)
   */
  async getFirstUserMessage(conversationId: string): Promise<Message | null> {
    return this.prisma.message.findFirst({
      where: {
        conversationId,
        role: 'USER',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}

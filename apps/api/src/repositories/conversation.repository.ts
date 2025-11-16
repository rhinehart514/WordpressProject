import { Injectable, Logger } from '@nestjs/common';
import { Conversation, Message, MessageRole } from '@prisma/client';
import { PrismaService } from '../prisma';

export interface CreateConversationDto {
  title?: string;
  userId?: string;
  metadata?: any;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

@Injectable()
export class ConversationRepository {
  private readonly logger = new Logger(ConversationRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new conversation
   */
  async create(data: CreateConversationDto): Promise<Conversation> {
    return this.prisma.conversation.create({
      data: {
        title: data.title,
        userId: data.userId,
        metadata: data.metadata,
      },
    });
  }

  /**
   * Find conversation by ID with messages
   */
  async findById(id: string): Promise<ConversationWithMessages | null> {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }

  /**
   * Find all conversations for a user
   */
  async findByUserId(
    userId: string,
    limit: number = 20,
  ): Promise<Conversation[]> {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Find all conversations (for guest users)
   */
  async findAll(limit: number = 20): Promise<Conversation[]> {
    return this.prisma.conversation.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Update conversation
   */
  async update(
    id: string,
    data: Partial<CreateConversationDto>,
  ): Promise<Conversation> {
    return this.prisma.conversation.update({
      where: { id },
      data: {
        title: data.title,
        metadata: data.metadata,
      },
    });
  }

  /**
   * Delete conversation
   */
  async delete(id: string): Promise<Conversation> {
    return this.prisma.conversation.delete({
      where: { id },
    });
  }

  /**
   * Count conversations for a user
   */
  async countByUserId(userId: string): Promise<number> {
    return this.prisma.conversation.count({
      where: { userId },
    });
  }
}

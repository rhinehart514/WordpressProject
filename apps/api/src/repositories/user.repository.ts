import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma';

export interface CreateUserDto {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: string; // 'restaurant_owner' | 'agency_admin' | 'agency_agent'
}

export interface UpdateUserDto {
  email?: string;
  passwordHash?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
}

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new user
   */
  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      },
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find user by ID with conversations
   */
  async findByIdWithConversations(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        conversations: {
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
    });
  }

  /**
   * Find all users
   */
  async findAll(limit: number = 100): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Find users by role
   */
  async findByRole(role: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { role },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update user
   */
  async update(id: string, data: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete user (soft delete by setting isActive = false)
   */
  async deactivate(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Hard delete user
   */
  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Count users by role
   */
  async countByRole(role: string): Promise<number> {
    return this.prisma.user.count({
      where: { role },
    });
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }
}

import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export interface CreateUserOptions {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export class UserFactory {
  private static counter = 0;

  /**
   * Create a test user
   */
  static async create(
    prisma: PrismaClient,
    options: CreateUserOptions = {},
  ): Promise<User> {
    this.counter++;

    const hashedPassword = await bcrypt.hash(
      options.password || 'TestPassword123!',
      10,
    );

    return prisma.user.create({
      data: {
        email: options.email || `test-user-${this.counter}@example.com`,
        password: hashedPassword,
        firstName: options.firstName || `TestFirst${this.counter}`,
        lastName: options.lastName || `TestLast${this.counter}`,
        role: options.role || 'user',
      },
    });
  }

  /**
   * Create multiple test users
   */
  static async createMany(
    prisma: PrismaClient,
    count: number,
    options: CreateUserOptions = {},
  ): Promise<User[]> {
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
      users.push(await this.create(prisma, options));
    }
    return users;
  }

  /**
   * Create an admin user
   */
  static async createAdmin(
    prisma: PrismaClient,
    options: CreateUserOptions = {},
  ): Promise<User> {
    return this.create(prisma, { ...options, role: 'admin' });
  }

  /**
   * Create an agency user
   */
  static async createAgency(
    prisma: PrismaClient,
    options: CreateUserOptions = {},
  ): Promise<User> {
    return this.create(prisma, { ...options, role: 'agency' });
  }

  /**
   * Reset counter (useful between test suites)
   */
  static resetCounter(): void {
    this.counter = 0;
  }
}

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

export class DatabaseHelper {
  private static prisma: PrismaClient;

  /**
   * Initialize test database connection
   */
  static async connect(): Promise<PrismaClient> {
    if (!this.prisma) {
      this.prisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      });
      await this.prisma.$connect();
    }
    return this.prisma;
  }

  /**
   * Run database migrations for test database
   */
  static async migrate(): Promise<void> {
    try {
      execSync('npx prisma migrate deploy', {
        env: {
          ...process.env,
          DATABASE_URL: process.env.DATABASE_URL,
        },
        stdio: 'pipe',
      });
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  /**
   * Reset database to clean state (WARNING: Deletes all data)
   */
  static async reset(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Database reset is only allowed in test environment');
    }

    try {
      execSync('npx prisma migrate reset --force --skip-seed', {
        env: {
          ...process.env,
          DATABASE_URL: process.env.DATABASE_URL,
        },
        stdio: 'pipe',
      });
    } catch (error) {
      console.error('Database reset failed:', error);
      throw error;
    }
  }

  /**
   * Clear all tables (faster than full reset)
   */
  static async clearAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Database clear is only allowed in test environment');
    }

    const prisma = await this.connect();

    // Delete in correct order to respect foreign key constraints
    await prisma.$transaction([
      prisma.message.deleteMany(),
      prisma.conversation.deleteMany(),
      prisma.deploymentJob.deleteMany(),
      prisma.siteRebuild.deleteMany(),
      prisma.pageTemplate.deleteMany(),
      prisma.siteAnalysis.deleteMany(),
      prisma.bulkOperation.deleteMany(),
      prisma.agencyClient.deleteMany(),
      prisma.healthCheck.deleteMany(),
      prisma.postingSchedule.deleteMany(),
      prisma.wordPressSite.deleteMany(),
      prisma.gallery.deleteMany(),
      prisma.operatingHours.deleteMany(),
      prisma.location.deleteMany(),
      prisma.menuItem.deleteMany(),
      prisma.restaurant.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  }

  /**
   * Disconnect from database
   */
  static async disconnect(): Promise<void> {
    if (this.prisma) {
      await this.prisma.$disconnect();
    }
  }

  /**
   * Get Prisma client instance
   */
  static getPrisma(): PrismaClient {
    if (!this.prisma) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.prisma;
  }
}

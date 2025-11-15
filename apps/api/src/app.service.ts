import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth(): Promise<{
    status: string;
    message: string;
    timestamp: string;
    services: {
      database: string;
      ai: string;
    };
  }> {
    const timestamp = new Date().toISOString();

    // Check database connectivity
    let dbStatus = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      dbStatus = 'error';
    }

    // Check AI provider configuration
    const aiStatus = process.env.OPENAI_API_KEY ? 'configured' : 'not configured';

    return {
      status: dbStatus === 'ok' ? 'healthy' : 'degraded',
      message: 'AI Website Rebuilder API is running',
      timestamp,
      services: {
        database: dbStatus,
        ai: aiStatus,
      },
    };
  }

  getVersion(): {
    version: string;
    environment: string;
    nodeVersion: string;
    uptime: number;
  } {
    return {
      version: '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      uptime: process.uptime(),
    };
  }
}

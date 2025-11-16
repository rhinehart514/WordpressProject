import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../prisma';

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  services: {
    database: {
      status: 'up' | 'down';
      responseTime?: number;
    };
    redis?: {
      status: 'up' | 'down';
      responseTime?: number;
    };
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'System is healthy',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'System is unhealthy',
  })
  async healthCheck(): Promise<HealthCheckResponse> {
    const startTime = Date.now();

    // Check database connection
    let dbStatus: 'up' | 'down' = 'down';
    let dbResponseTime: number | undefined;

    try {
      const dbStart = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      dbResponseTime = Date.now() - dbStart;
      dbStatus = 'up';
    } catch (error) {
      dbStatus = 'down';
    }

    // Get memory usage
    const memUsage = process.memoryUsage();
    const totalMemory = memUsage.heapTotal;
    const usedMemory = memUsage.heapUsed;
    const memoryPercentage = Math.round((usedMemory / totalMemory) * 100);

    // Determine overall health status
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (dbStatus === 'down') {
      status = 'unhealthy';
    } else if (memoryPercentage > 90) {
      status = 'degraded';
    }

    const response: HealthCheckResponse = {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '0.1.0',
      services: {
        database: {
          status: dbStatus,
          responseTime: dbResponseTime,
        },
      },
      memory: {
        used: Math.round(usedMemory / 1024 / 1024), // MB
        total: Math.round(totalMemory / 1024 / 1024), // MB
        percentage: memoryPercentage,
      },
    };

    return response;
  }

  @Get('liveness')
  @ApiOperation({ summary: 'Kubernetes liveness probe' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Application is alive',
  })
  liveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Kubernetes readiness probe' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Application is ready to accept traffic',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Application is not ready',
  })
  async readiness() {
    // Check if database is accessible
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new BadRequestException('Database not accessible');
    }
  }
}

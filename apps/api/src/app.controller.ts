import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({
    status: 200,
    description: 'API health status',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        message: { type: 'string' },
        timestamp: { type: 'string' },
        services: {
          type: 'object',
          properties: {
            database: { type: 'string', example: 'ok' },
            ai: { type: 'string', example: 'configured' },
          },
        },
      },
    },
  })
  async getHealth() {
    return this.appService.getHealth();
  }

  @Get('version')
  @ApiOperation({ summary: 'Get API version' })
  @ApiResponse({ status: 200, description: 'API version info' })
  getVersion(): { version: string; environment: string } {
    return this.appService.getVersion();
  }
}

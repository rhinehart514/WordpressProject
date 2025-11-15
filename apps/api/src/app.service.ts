import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { status: string; message: string } {
    return {
      status: 'ok',
      message: 'AI Website Rebuilder API is running',
    };
  }

  getVersion(): { version: string; environment: string } {
    return {
      version: '0.1.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}

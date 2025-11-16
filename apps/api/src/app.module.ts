import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { ChatModule } from './modules/chat/chat.module';
import { OpenAIModule } from './modules/openai/openai.module';
import { ScraperModule } from './modules/scraper/scraper.module';
import { PreviewModule } from './modules/preview/preview.module';
import { WordPressModule } from './modules/wordpress';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { MenuModule } from './modules/menu/menu.module';
import { UserModule } from './modules/user/user.module';
import { WordPressSiteModule } from './modules/wordpress-site/wordpress-site.module';
import { DeploymentModule } from './modules/deployment/deployment.module';
import { TemplateModule } from './modules/template/template.module';
import { RebuildModule } from './modules/rebuild/rebuild.module';
import { AgencyModule } from './modules/agency/agency.module';
import { BulkOperationModule } from './modules/bulk-operation/bulk-operation.module';
import { HealthModule } from './modules/health';
import { MediaModule } from './modules/media';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
      validationSchema: Joi.object({
        // Database
        DATABASE_URL: Joi.string().required(),

        // Redis
        REDIS_URL: Joi.string().default('redis://localhost:6379'),

        // API Configuration
        API_PORT: Joi.number().default(3001),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),

        // Authentication
        JWT_SECRET: Joi.string().min(32).required(),
        JWT_EXPIRATION: Joi.string().default('7d'),

        // AI/OpenAI Configuration
        OPENAI_API_KEY: Joi.string().required(),
        AI_BASE_URL: Joi.string().uri().optional(),
        OPENAI_MODEL: Joi.string().default('gpt-3.5-turbo'),

        // WordPress
        WORDPRESS_DEFAULT_URL: Joi.string().uri().optional(),
        WORDPRESS_API_KEY: Joi.string().optional(),

        // CORS
        ALLOWED_ORIGINS: Joi.string().default('http://localhost:3000'),

        // Next.js (for reference)
        NEXT_PUBLIC_API_URL: Joi.string().uri().optional(),
        NEXTAUTH_SECRET: Joi.string().optional(),
        NEXTAUTH_URL: Joi.string().uri().optional(),

        // Logging
        LOG_LEVEL: Joi.string()
          .valid('error', 'warn', 'info', 'debug')
          .default('info'),
      }),
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 10, // 10 requests per second
      },
      {
        name: 'medium',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
      {
        name: 'long',
        ttl: 3600000, // 1 hour
        limit: 1000, // 1000 requests per hour
      },
    ]),
    PrismaModule,
    WordPressModule,
    ChatModule,
    OpenAIModule,
    ScraperModule,
    PreviewModule,
    AuthModule,
    RestaurantModule,
    MenuModule,
    UserModule,
    WordPressSiteModule,
    DeploymentModule,
    TemplateModule,
    RebuildModule,
    AgencyModule,
    BulkOperationModule,
    HealthModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

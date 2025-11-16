import { Module, CacheModule as NestCacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get('REDIS_URL') || 'redis://localhost:6379';
        const url = new URL(redisUrl);

        return {
          store: redisStore,
          host: url.hostname,
          port: parseInt(url.port || '6379'),
          password: url.password || undefined,
          ttl: 300, // Default TTL: 5 minutes
          max: 1000, // Maximum number of items in cache
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}

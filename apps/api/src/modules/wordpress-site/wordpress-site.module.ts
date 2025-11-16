import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma';
import { WordPressModule } from '../wordpress';
import { WordPressSiteController } from './wordpress-site.controller';
import { WordPressSiteRepository } from '../../repositories';

@Module({
  imports: [ConfigModule, PrismaModule, WordPressModule],
  controllers: [WordPressSiteController],
  providers: [WordPressSiteRepository],
  exports: [WordPressSiteRepository],
})
export class WordPressSiteModule {}

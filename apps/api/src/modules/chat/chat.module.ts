import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { OpenAIModule } from '../openai';
import { ScraperModule } from '../scraper/scraper.module';
import {
  ConversationRepository,
  MessageRepository,
  SiteAnalysisRepository,
} from '../../repositories';
import {
  AnalyzeSiteUseCase,
  GenerateRebuildUseCase,
  ChatWithAIUseCase,
} from '../../use-cases';

@Module({
  imports: [ConfigModule, OpenAIModule, ScraperModule],
  controllers: [ChatController],
  providers: [
    ChatService,
    ConversationRepository,
    MessageRepository,
    SiteAnalysisRepository,
    AnalyzeSiteUseCase,
    GenerateRebuildUseCase,
    ChatWithAIUseCase,
  ],
  exports: [ChatService],
})
export class ChatModule {}

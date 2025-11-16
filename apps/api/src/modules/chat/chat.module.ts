import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { OpenAIModule } from '../openai';
import { ScraperModule } from '../scraper/scraper.module';
import { WordPressModule } from '../wordpress';
import {
  ConversationRepository,
  MessageRepository,
  SiteAnalysisRepository,
} from '../../repositories';
import {
  AnalyzeSiteUseCase,
  GenerateRebuildUseCase,
  ChatWithAIUseCase,
  DeployToWordPressUseCase,
} from '../../use-cases';

@Module({
  imports: [ConfigModule, OpenAIModule, ScraperModule, WordPressModule],
  controllers: [ChatController],
  providers: [
    ChatService,
    ConversationRepository,
    MessageRepository,
    SiteAnalysisRepository,
    AnalyzeSiteUseCase,
    GenerateRebuildUseCase,
    ChatWithAIUseCase,
    DeployToWordPressUseCase,
  ],
  exports: [ChatService],
})
export class ChatModule {}

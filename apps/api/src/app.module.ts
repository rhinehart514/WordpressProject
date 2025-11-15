import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { ChatModule } from './modules/chat/chat.module';
import { OpenAIModule } from './modules/openai/openai.module';
import { ScraperModule } from './modules/scraper/scraper.module';
import { PreviewModule } from './modules/preview/preview.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    PrismaModule,
    ChatModule,
    OpenAIModule,
    ScraperModule,
    PreviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

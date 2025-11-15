import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ContentClassifierService } from './content-classifier.service';
import { ScraperController } from './scraper.controller';

@Module({
  controllers: [ScraperController],
  providers: [ScraperService, ContentClassifierService],
  exports: [ScraperService, ContentClassifierService],
})
export class ScraperModule {}

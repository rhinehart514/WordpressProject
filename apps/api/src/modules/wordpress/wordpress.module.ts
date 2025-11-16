import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WordPressService } from './wordpress.service';

@Module({
  imports: [ConfigModule],
  providers: [WordPressService],
  exports: [WordPressService],
})
export class WordPressModule {}

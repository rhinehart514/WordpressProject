import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PreviewService } from './preview.service';
import { PreviewController } from './preview.controller';

@Module({
  controllers: [PreviewController],
  providers: [
    PreviewService,
    {
      provide: PrismaClient,
      useValue: new PrismaClient(),
    },
  ],
  exports: [PreviewService],
})
export class PreviewModule {}

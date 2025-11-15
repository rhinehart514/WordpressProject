import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma';
import { TemplateController } from './template.controller';
import { PageTemplateRepository } from '../../repositories';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [TemplateController],
  providers: [PageTemplateRepository],
  exports: [PageTemplateRepository],
})
export class TemplateModule {}

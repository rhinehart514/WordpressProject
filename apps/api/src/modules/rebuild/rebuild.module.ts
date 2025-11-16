import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma';
import { RebuildController } from './rebuild.controller';
import { SiteRebuildRepository } from '../../repositories';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [RebuildController],
  providers: [SiteRebuildRepository],
  exports: [SiteRebuildRepository],
})
export class RebuildModule {}

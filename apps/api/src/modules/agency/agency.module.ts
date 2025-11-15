import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma';
import { AgencyController } from './agency.controller';
import { AgencyClientRepository } from '../../repositories';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [AgencyController],
  providers: [AgencyClientRepository],
  exports: [AgencyClientRepository],
})
export class AgencyModule {}

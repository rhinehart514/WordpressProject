import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma';
import { BulkOperationController } from './bulk-operation.controller';
import { BulkOperationRepository } from '../../repositories';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [BulkOperationController],
  providers: [BulkOperationRepository],
  exports: [BulkOperationRepository],
})
export class BulkOperationModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma';
import { DeploymentController } from './deployment.controller';
import { DeploymentJobRepository } from '../../repositories';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [DeploymentController],
  providers: [DeploymentJobRepository],
  exports: [DeploymentJobRepository],
})
export class DeploymentModule {}

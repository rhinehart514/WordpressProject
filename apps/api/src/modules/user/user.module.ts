import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma';
import { UserController } from './user.controller';
import { UserRepository } from '../../repositories';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [UserController],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserModule {}

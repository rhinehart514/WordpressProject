import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma';
import { AuthController } from './auth.controller';
import { UserRepository } from '../../repositories';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [AuthController],
  providers: [
    UserRepository,
    // TODO: Add AuthService when implemented
    // TODO: Add JwtModule
    // TODO: Add JwtStrategy
  ],
  exports: [],
})
export class AuthModule {}

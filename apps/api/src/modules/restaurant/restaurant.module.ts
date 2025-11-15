import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma';
import { RestaurantController } from './restaurant.controller';
import { RestaurantRepository } from '../../repositories';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [RestaurantController],
  providers: [RestaurantRepository],
  exports: [RestaurantRepository],
})
export class RestaurantModule {}

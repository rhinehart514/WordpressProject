import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma';
import { MenuItemController } from './menu-item.controller';
import { MenuItemRepository } from '../../repositories';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [MenuItemController],
  providers: [MenuItemRepository],
  exports: [MenuItemRepository],
})
export class MenuModule {}

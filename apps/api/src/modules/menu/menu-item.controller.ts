import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MenuItemRepository } from '../../repositories';
import { PrismaService } from '../../prisma';
import { CreateMenuItemDto, UpdateMenuItemDto } from './menu-item.dto';

@ApiTags('Menu Items')
@Controller('menu-items')
@ApiBearerAuth()
export class MenuItemController {
  private readonly menuItemRepository: MenuItemRepository;

  constructor(private readonly prisma: PrismaService) {
    this.menuItemRepository = new MenuItemRepository(prisma);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({
    status: 201,
    description: 'Menu item created successfully',
  })
  async create(@Body() createDto: CreateMenuItemDto) {
    return this.menuItemRepository.create(createDto);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create multiple menu items at once' })
  @ApiResponse({
    status: 201,
    description: 'Menu items created successfully',
  })
  async bulkCreate(@Body() items: CreateMenuItemDto[]) {
    const count = await this.menuItemRepository.bulkCreate(items);
    return { created: count };
  }

  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: 'Get all menu items for a restaurant' })
  @ApiResponse({
    status: 200,
    description: 'Menu items list',
  })
  async findByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.menuItemRepository.findByRestaurantId(restaurantId);
  }

  @Get('restaurant/:restaurantId/available')
  @ApiOperation({ summary: 'Get available menu items for a restaurant' })
  @ApiResponse({
    status: 200,
    description: 'Available menu items',
  })
  async findAvailable(@Param('restaurantId') restaurantId: string) {
    return this.menuItemRepository.findAvailable(restaurantId);
  }

  @Get('restaurant/:restaurantId/category/:category')
  @ApiOperation({ summary: 'Get menu items by category' })
  @ApiResponse({
    status: 200,
    description: 'Menu items in category',
  })
  async findByCategory(
    @Param('restaurantId') restaurantId: string,
    @Param('category') category: string,
  ) {
    return this.menuItemRepository.findByCategory(restaurantId, category);
  }

  @Get('restaurant/:restaurantId/categories')
  @ApiOperation({ summary: 'Get all categories for a restaurant' })
  @ApiResponse({
    status: 200,
    description: 'List of categories',
  })
  async getCategories(@Param('restaurantId') restaurantId: string) {
    const categories = await this.menuItemRepository.getCategories(restaurantId);
    return { categories };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu item by ID' })
  @ApiResponse({
    status: 200,
    description: 'Menu item found',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu item not found',
  })
  async findOne(@Param('id') id: string) {
    const item = await this.menuItemRepository.findById(id);
    if (!item) {
      throw new Error('Menu item not found');
    }
    return item;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update menu item' })
  @ApiResponse({
    status: 200,
    description: 'Menu item updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMenuItemDto,
  ) {
    return this.menuItemRepository.update(id, updateDto);
  }

  @Put(':id/toggle-availability')
  @ApiOperation({ summary: 'Toggle menu item availability' })
  @ApiResponse({
    status: 200,
    description: 'Availability toggled',
  })
  async toggleAvailability(@Param('id') id: string) {
    return this.menuItemRepository.toggleAvailability(id);
  }

  @Put(':id/sort-order')
  @ApiOperation({ summary: 'Update menu item sort order' })
  @ApiResponse({
    status: 200,
    description: 'Sort order updated',
  })
  async updateSortOrder(
    @Param('id') id: string,
    @Body() body: { sortOrder: number },
  ) {
    return this.menuItemRepository.updateSortOrder(id, body.sortOrder);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete menu item' })
  @ApiResponse({
    status: 204,
    description: 'Menu item deleted successfully',
  })
  async delete(@Param('id') id: string) {
    await this.menuItemRepository.delete(id);
  }

  @Get('restaurant/:restaurantId/stats/by-category')
  @ApiOperation({ summary: 'Get menu item count by category' })
  @ApiResponse({
    status: 200,
    description: 'Category statistics',
  })
  async getStatsByCategory(
    @Param('restaurantId') restaurantId: string,
    @Query('category') category: string,
  ) {
    const count = await this.menuItemRepository.countByCategory(
      restaurantId,
      category,
    );
    return { category, count };
  }
}

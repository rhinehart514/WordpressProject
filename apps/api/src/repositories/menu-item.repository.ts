import { Injectable, Logger } from '@nestjs/common';
import { MenuItem } from '@prisma/client';
import { PrismaService } from '../prisma';

export interface CreateMenuItemDto {
  restaurantId: string;
  name: string;
  description?: string;
  priceCents: number;
  imageUrl?: string;
  category: string;
  allergens?: string[];
  isAvailable?: boolean;
  sortOrder?: number;
}

export interface UpdateMenuItemDto {
  name?: string;
  description?: string;
  priceCents?: number;
  imageUrl?: string;
  category?: string;
  allergens?: string[];
  isAvailable?: boolean;
  sortOrder?: number;
}

@Injectable()
export class MenuItemRepository {
  private readonly logger = new Logger(MenuItemRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new menu item
   */
  async create(data: CreateMenuItemDto): Promise<MenuItem> {
    return this.prisma.menuItem.create({
      data: {
        restaurantId: data.restaurantId,
        name: data.name,
        description: data.description,
        priceCents: data.priceCents,
        imageUrl: data.imageUrl,
        category: data.category,
        allergens: data.allergens || [],
        isAvailable: data.isAvailable ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  /**
   * Find menu item by ID
   */
  async findById(id: string): Promise<MenuItem | null> {
    return this.prisma.menuItem.findUnique({
      where: { id },
    });
  }

  /**
   * Find all menu items for a restaurant
   */
  async findByRestaurantId(restaurantId: string): Promise<MenuItem[]> {
    return this.prisma.menuItem.findMany({
      where: { restaurantId },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Find menu items by category
   */
  async findByCategory(
    restaurantId: string,
    category: string,
  ): Promise<MenuItem[]> {
    return this.prisma.menuItem.findMany({
      where: {
        restaurantId,
        category,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Find available menu items
   */
  async findAvailable(restaurantId: string): Promise<MenuItem[]> {
    return this.prisma.menuItem.findMany({
      where: {
        restaurantId,
        isAvailable: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Update menu item
   */
  async update(id: string, data: UpdateMenuItemDto): Promise<MenuItem> {
    return this.prisma.menuItem.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete menu item
   */
  async delete(id: string): Promise<MenuItem> {
    return this.prisma.menuItem.delete({
      where: { id },
    });
  }

  /**
   * Bulk create menu items
   */
  async bulkCreate(items: CreateMenuItemDto[]): Promise<number> {
    const result = await this.prisma.menuItem.createMany({
      data: items,
    });
    return result.count;
  }

  /**
   * Toggle availability
   */
  async toggleAvailability(id: string): Promise<MenuItem> {
    const item = await this.findById(id);
    if (!item) throw new Error('Menu item not found');

    return this.prisma.menuItem.update({
      where: { id },
      data: { isAvailable: !item.isAvailable },
    });
  }

  /**
   * Update sort order
   */
  async updateSortOrder(id: string, sortOrder: number): Promise<MenuItem> {
    return this.prisma.menuItem.update({
      where: { id },
      data: { sortOrder },
    });
  }

  /**
   * Count menu items by category
   */
  async countByCategory(
    restaurantId: string,
    category: string,
  ): Promise<number> {
    return this.prisma.menuItem.count({
      where: {
        restaurantId,
        category,
      },
    });
  }

  /**
   * Get all categories for a restaurant
   */
  async getCategories(restaurantId: string): Promise<string[]> {
    const items = await this.prisma.menuItem.findMany({
      where: { restaurantId },
      select: { category: true },
      distinct: ['category'],
    });
    return items.map((item) => item.category);
  }
}

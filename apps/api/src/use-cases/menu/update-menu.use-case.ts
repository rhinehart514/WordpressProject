import { Injectable, Logger } from '@nestjs/common';
import { MenuItemRepository } from '../../repositories';
import { ResourceNotFoundException } from '../../common/exceptions';

export interface UpdateMenuItemInput {
  menuItemId: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  available?: boolean;
  allergens?: string[];
  dietaryInfo?: string[];
}

@Injectable()
export class UpdateMenuUseCase {
  private readonly logger = new Logger(UpdateMenuUseCase.name);

  constructor(private readonly menuItemRepository: MenuItemRepository) {}

  async execute(input: UpdateMenuItemInput) {
    this.logger.log(\`Updating menu item: \${input.menuItemId}\`);

    const menuItem = await this.menuItemRepository.findById(input.menuItemId);

    if (!menuItem) {
      throw new ResourceNotFoundException('Menu item', input.menuItemId);
    }

    const updated = await this.menuItemRepository.update(input.menuItemId, {
      name: input.name,
      description: input.description,
      price: input.price,
      category: input.category,
      imageUrl: input.imageUrl,
      available: input.available,
      allergens: input.allergens,
      dietaryInfo: input.dietaryInfo,
    });

    this.logger.log(\`Menu item updated: \${input.menuItemId}\`);

    return updated;
  }
}

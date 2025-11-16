import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { WordPressSiteRepository } from '../../repositories';
import { WordPressService } from '../../modules/wordpress/wordpress.service';

export interface ConnectWordPressSiteInput {
  userId: string;
  restaurantId?: string;
  url: string;
  adminUsername: string;
  applicationPassword: string;
  siteName?: string;
}

@Injectable()
export class ConnectWordPressSiteUseCase {
  private readonly logger = new Logger(ConnectWordPressSiteUseCase.name);

  constructor(
    private readonly wordPressSiteRepository: WordPressSiteRepository,
    private readonly wordPressService: WordPressService,
  ) {}

  async execute(input: ConnectWordPressSiteInput) {
    this.logger.log(`Connecting WordPress site: ${input.url}`);

    // Test connection first
    let connectionTest;
    try {
      connectionTest = await this.wordPressService.testConnection({
        url: input.url,
        username: input.adminUsername,
        applicationPassword: input.applicationPassword,
      });
    } catch (error) {
      this.logger.error(`WordPress connection test failed: ${error.message}`);
      throw new BadRequestException(
        `Failed to connect to WordPress site: ${error.message}`,
      );
    }

    if (!connectionTest.success) {
      throw new BadRequestException(
        `WordPress connection test failed: ${connectionTest.message}`,
      );
    }

    // Store WordPress site credentials
    const wpSite = await this.wordPressSiteRepository.create({
      userId: input.userId,
      restaurantId: input.restaurantId,
      url: input.url,
      siteName: input.siteName || connectionTest.siteName,
      adminUsername: input.adminUsername,
      applicationPassword: input.applicationPassword,
      status: 'connected',
      lastHealthCheck: new Date(),
    });

    this.logger.log(`WordPress site connected with ID: ${wpSite.id}`);

    return {
      ...wpSite,
      connectionTest,
    };
  }
}

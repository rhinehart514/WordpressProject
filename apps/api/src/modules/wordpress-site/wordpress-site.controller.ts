import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WordPressSiteRepository } from '../../repositories';
import { WordPressService } from '../wordpress/wordpress.service';
import { PrismaService } from '../../prisma';
import {
  CreateWordPressSiteDto,
  UpdateWordPressSiteDto,
  TestConnectionDto,
} from './wordpress-site.dto';
import { ResourceNotFoundException } from '../../common/exceptions';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('WordPress Sites')
@Controller('wordpress-sites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WordPressSiteController {
  private readonly wordPressSiteRepository: WordPressSiteRepository;

  constructor(
    private readonly prisma: PrismaService,
    private readonly wordpressService: WordPressService,
  ) {
    this.wordPressSiteRepository = new WordPressSiteRepository(prisma);
  }

  @Post('test-connection')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Test WordPress site connection' })
  @ApiResponse({
    status: 200,
    description: 'Connection test result',
  })
  @ApiResponse({
    status: 400,
    description: 'Connection failed',
  })
  async testConnection(@Body() testDto: TestConnectionDto) {
    const result = await this.wordpressService.testConnection({
      baseUrl: testDto.baseUrl,
      username: testDto.username,
      applicationPassword: testDto.applicationPassword,
    });

    return {
      success: result.success,
      version: result.version,
      error: result.error,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Connect a new WordPress site' })
  @ApiResponse({
    status: 201,
    description: 'WordPress site connected successfully',
  })
  async create(@Body() createDto: CreateWordPressSiteDto) {
    // TODO: Encrypt the application password before storing
    // For now, we'll store it as-is (NOT SECURE - needs encryption)
    const apiKeyEncrypted = createDto.applicationPassword; // TODO: Encrypt this

    return this.wordPressSiteRepository.create({
      restaurantId: createDto.restaurantId,
      baseUrl: createDto.baseUrl,
      apiKeyEncrypted,
      siteMetadata: {
        username: createDto.username,
        connectedAt: new Date().toISOString(),
      },
      healthStatus: 'healthy',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all WordPress sites' })
  @ApiResponse({
    status: 200,
    description: 'List of WordPress sites',
  })
  async findAll() {
    return this.wordPressSiteRepository.findAll();
  }

  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: 'Get WordPress sites for a restaurant' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant WordPress sites',
  })
  async findByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.wordPressSiteRepository.findByRestaurantId(restaurantId);
  }

  @Get('unhealthy')
  @ApiOperation({ summary: 'Get sites with health issues' })
  @ApiResponse({
    status: 200,
    description: 'Unhealthy sites',
  })
  async findUnhealthy() {
    return this.wordPressSiteRepository.findUnhealthySites();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get WordPress site by ID' })
  @ApiResponse({
    status: 200,
    description: 'WordPress site found',
  })
  async findOne(@Param('id') id: string) {
    const site = await this.wordPressSiteRepository.findById(id);
    if (!site) {
      throw new ResourceNotFoundException('WordPress site', id);
    }
    return site;
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Get WordPress site with deployments' })
  @ApiResponse({
    status: 200,
    description: 'WordPress site with deployment history',
  })
  async findOneWithDetails(@Param('id') id: string) {
    const site = await this.wordPressSiteRepository.findByIdWithDeployments(id);
    if (!site) {
      throw new ResourceNotFoundException('WordPress site', id);
    }
    return site;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update WordPress site' })
  @ApiResponse({
    status: 200,
    description: 'WordPress site updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateWordPressSiteDto,
  ) {
    return this.wordPressSiteRepository.update(id, updateDto);
  }

  @Post(':id/health-check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Run health check on WordPress site' })
  @ApiResponse({
    status: 200,
    description: 'Health check completed',
  })
  async healthCheck(@Param('id') id: string) {
    const site = await this.wordPressSiteRepository.findById(id);
    if (!site) {
      throw new ResourceNotFoundException('WordPress site', id);
    }

    try {
      // Test connection using stored credentials
      const result = await this.wordpressService.testConnection({
        baseUrl: site.baseUrl,
        username: (site.siteMetadata as any).username,
        applicationPassword: site.apiKeyEncrypted, // TODO: Decrypt this
      });

      const healthStatus = result.success ? 'healthy' : 'error';
      await this.wordPressSiteRepository.updateHealthCheck(id, healthStatus);

      return {
        healthy: result.success,
        status: healthStatus,
        details: result,
      };
    } catch (error) {
      await this.wordPressSiteRepository.updateHealthCheck(id, 'error');
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Disconnect WordPress site' })
  @ApiResponse({
    status: 204,
    description: 'WordPress site disconnected successfully',
  })
  async delete(@Param('id') id: string) {
    await this.wordPressSiteRepository.delete(id);
  }
}

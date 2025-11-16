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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RestaurantRepository } from '../../repositories';
import { PrismaService } from '../../prisma';
import { CreateRestaurantDto, UpdateRestaurantDto } from './restaurant.dto';
import { ResourceNotFoundException } from '../../common/exceptions';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Restaurants')
@Controller('restaurants')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RestaurantController {
  private readonly restaurantRepository: RestaurantRepository;

  constructor(private readonly prisma: PrismaService) {
    this.restaurantRepository = new RestaurantRepository(prisma);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({
    status: 201,
    description: 'Restaurant created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  async create(@Body() createDto: CreateRestaurantDto) {
    return this.restaurantRepository.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all restaurants' })
  @ApiResponse({
    status: 200,
    description: 'List of restaurants',
  })
  async findAll(@Query('limit') limit?: number) {
    return this.restaurantRepository.findAll(limit ? parseInt(limit.toString()) : 50);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all restaurants for a user' })
  @ApiResponse({
    status: 200,
    description: 'User restaurants',
  })
  async findByUserId(@Param('userId') userId: string) {
    return this.restaurantRepository.findByUserId(userId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search restaurants by name' })
  @ApiResponse({
    status: 200,
    description: 'Search results',
  })
  async search(
    @Query('name') name: string,
    @Query('limit') limit?: number,
  ) {
    return this.restaurantRepository.searchByName(
      name,
      limit ? parseInt(limit.toString()) : 20,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by ID' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant found',
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant not found',
  })
  async findOne(@Param('id') id: string) {
    const restaurant = await this.restaurantRepository.findById(id);
    if (!restaurant) {
      throw new ResourceNotFoundException('Restaurant', id);
    }
    return restaurant;
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Get restaurant with all relations' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant with menu, hours, location, etc.',
  })
  async findOneWithRelations(@Param('id') id: string) {
    const restaurant = await this.restaurantRepository.findByIdWithRelations(id);
    if (!restaurant) {
      throw new ResourceNotFoundException('Restaurant', id);
    }
    return restaurant;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update restaurant' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRestaurantDto,
  ) {
    return this.restaurantRepository.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete restaurant' })
  @ApiResponse({
    status: 204,
    description: 'Restaurant deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant not found',
  })
  async delete(@Param('id') id: string) {
    await this.restaurantRepository.delete(id);
  }

  @Get('stats/by-status')
  @ApiOperation({ summary: 'Get restaurant count by status' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant statistics',
  })
  async getStatsByStatus(@Query('status') status: string) {
    const count = await this.restaurantRepository.countByStatus(status);
    return { status, count };
  }
}

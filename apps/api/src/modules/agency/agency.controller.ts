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
import { AgencyClientRepository } from '../../repositories';
import { PrismaService } from '../../prisma';

class CreateAgencyClientDto {
  restaurantId: string;
  serviceTier: string;
  status: string;
  assignedAgentId?: string;
  notes?: string;
}

class UpdateAgencyClientDto {
  serviceTier?: string;
  status?: string;
  assignedAgentId?: string;
  notes?: string;
}

@ApiTags('Agency Clients')
@Controller('agency/clients')
@ApiBearerAuth()
export class AgencyController {
  private readonly agencyClientRepository: AgencyClientRepository;

  constructor(private readonly prisma: PrismaService) {
    this.agencyClientRepository = new AgencyClientRepository(prisma);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new agency client' })
  @ApiResponse({
    status: 201,
    description: 'Client added successfully',
  })
  async create(@Body() createDto: CreateAgencyClientDto) {
    return this.agencyClientRepository.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all agency clients' })
  @ApiResponse({
    status: 200,
    description: 'List of agency clients',
  })
  async findAll(@Query('limit') limit?: number) {
    return this.agencyClientRepository.findAll(
      limit ? parseInt(limit.toString()) : 100,
    );
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active clients count' })
  @ApiResponse({
    status: 200,
    description: 'Active clients count',
  })
  async getActiveCount() {
    const count = await this.agencyClientRepository.countActive();
    return { active_clients: count };
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get clients by status' })
  @ApiResponse({
    status: 200,
    description: 'Clients with specified status',
  })
  async findByStatus(@Param('status') status: string) {
    return this.agencyClientRepository.findByStatus(status);
  }

  @Get('tier/:serviceTier')
  @ApiOperation({ summary: 'Get clients by service tier' })
  @ApiResponse({
    status: 200,
    description: 'Clients in service tier',
  })
  async findByServiceTier(@Param('serviceTier') serviceTier: string) {
    return this.agencyClientRepository.findByServiceTier(serviceTier);
  }

  @Get('agent/:agentId')
  @ApiOperation({ summary: 'Get clients assigned to an agent' })
  @ApiResponse({
    status: 200,
    description: 'Agent clients',
  })
  async findByAgent(@Param('agentId') agentId: string) {
    return this.agencyClientRepository.findByAssignedAgent(agentId);
  }

  @Get('needing-health-check')
  @ApiOperation({ summary: 'Get clients needing health checks' })
  @ApiResponse({
    status: 200,
    description: 'Clients that need health checks',
  })
  async findNeedingHealthCheck() {
    return this.agencyClientRepository.findNeedingHealthCheck();
  }

  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: 'Get client by restaurant ID' })
  @ApiResponse({
    status: 200,
    description: 'Agency client found',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  async findByRestaurant(@Param('restaurantId') restaurantId: string) {
    const client = await this.agencyClientRepository.findByRestaurantId(
      restaurantId,
    );
    if (!client) {
      throw new Error('Agency client not found');
    }
    return client;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiResponse({
    status: 200,
    description: 'Client found',
  })
  @ApiResponse({
    status: 404,
    description: 'Client not found',
  })
  async findOne(@Param('id') id: string) {
    const client = await this.agencyClientRepository.findById(id);
    if (!client) {
      throw new Error('Agency client not found');
    }
    return client;
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Get client with full details' })
  @ApiResponse({
    status: 200,
    description: 'Client with restaurant, health checks, and schedule',
  })
  async findOneWithDetails(@Param('id') id: string) {
    const client = await this.agencyClientRepository.findByIdWithRelations(id);
    if (!client) {
      throw new Error('Agency client not found');
    }
    return client;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update client' })
  @ApiResponse({
    status: 200,
    description: 'Client updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAgencyClientDto,
  ) {
    return this.agencyClientRepository.update(id, updateDto);
  }

  @Put(':id/assign-agent')
  @ApiOperation({ summary: 'Assign agent to client' })
  @ApiResponse({
    status: 200,
    description: 'Agent assigned successfully',
  })
  async assignAgent(
    @Param('id') id: string,
    @Body() body: { agentId: string },
  ) {
    return this.agencyClientRepository.update(id, {
      assignedAgentId: body.agentId,
    });
  }

  @Post(':id/increment-update-count')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Increment monthly update count' })
  @ApiResponse({
    status: 200,
    description: 'Update count incremented',
  })
  async incrementUpdateCount(@Param('id') id: string) {
    return this.agencyClientRepository.incrementUpdateCount(id);
  }

  @Post('reset-monthly-counts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset all monthly update counts (run monthly)' })
  @ApiResponse({
    status: 200,
    description: 'Monthly counts reset',
  })
  async resetMonthlyCounts() {
    const count = await this.agencyClientRepository.resetMonthlyUpdateCounts();
    return { reset_count: count };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove client from agency' })
  @ApiResponse({
    status: 204,
    description: 'Client removed successfully',
  })
  async delete(@Param('id') id: string) {
    await this.agencyClientRepository.delete(id);
  }

  @Get('stats/by-tier')
  @ApiOperation({ summary: 'Get client count by service tier' })
  @ApiResponse({
    status: 200,
    description: 'Client tier statistics',
  })
  async getStatsByTier(@Query('tier') tier: string) {
    const count = await this.agencyClientRepository.countByServiceTier(tier);
    return { service_tier: tier, count };
  }
}

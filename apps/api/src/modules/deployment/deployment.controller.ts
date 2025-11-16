import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DeploymentJobRepository } from '../../repositories';
import { PrismaService } from '../../prisma';
import { CreateDeploymentDto, UpdateDeploymentDto } from './deployment.dto';

@ApiTags('Deployments')
@Controller('deployments')
@ApiBearerAuth()
export class DeploymentController {
  private readonly deploymentRepository: DeploymentJobRepository;

  constructor(private readonly prisma: PrismaService) {
    this.deploymentRepository = new DeploymentJobRepository(prisma);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new deployment job' })
  @ApiResponse({
    status: 201,
    description: 'Deployment job created and queued',
  })
  async create(@Body() createDto: CreateDeploymentDto) {
    // Create deployment job in pending status
    const deployment = await this.deploymentRepository.create({
      rebuildId: createDto.rebuildId,
      wordPressSiteId: createDto.wordPressSiteId,
      status: 'pending',
    });

    // TODO: Queue the deployment job for processing
    // await this.deploymentQueue.add('deploy', { deploymentId: deployment.id });

    return deployment;
  }

  @Get()
  @ApiOperation({ summary: 'Get all deployment jobs' })
  @ApiResponse({
    status: 200,
    description: 'List of deployment jobs',
  })
  async findAll(@Query('limit') limit?: number) {
    return this.deploymentRepository.findAll(
      limit ? parseInt(limit.toString()) : 50,
    );
  }

  @Get('rebuild/:rebuildId')
  @ApiOperation({ summary: 'Get deployments for a rebuild' })
  @ApiResponse({
    status: 200,
    description: 'Rebuild deployments',
  })
  async findByRebuild(@Param('rebuildId') rebuildId: string) {
    return this.deploymentRepository.findByRebuildId(rebuildId);
  }

  @Get('wordpress-site/:siteId')
  @ApiOperation({ summary: 'Get deployments for a WordPress site' })
  @ApiResponse({
    status: 200,
    description: 'WordPress site deployments',
  })
  async findByWordPressSite(@Param('siteId') siteId: string) {
    return this.deploymentRepository.findByWordPressSiteId(siteId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get deployments by status' })
  @ApiResponse({
    status: 200,
    description: 'Deployments with specified status',
  })
  async findByStatus(@Param('status') status: string) {
    return this.deploymentRepository.findByStatus(status);
  }

  @Get('in-progress')
  @ApiOperation({ summary: 'Get all in-progress deployments' })
  @ApiResponse({
    status: 200,
    description: 'In-progress deployments',
  })
  async findInProgress() {
    return this.deploymentRepository.findInProgress();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deployment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Deployment found',
  })
  async findOne(@Param('id') id: string) {
    const deployment = await this.deploymentRepository.findById(id);
    if (!deployment) {
      throw new Error('Deployment not found');
    }
    return deployment;
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Get deployment with full details' })
  @ApiResponse({
    status: 200,
    description: 'Deployment with rebuild and WordPress site info',
  })
  async findOneWithDetails(@Param('id') id: string) {
    const deployment = await this.deploymentRepository.findByIdWithRelations(id);
    if (!deployment) {
      throw new Error('Deployment not found');
    }
    return deployment;
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update deployment status' })
  @ApiResponse({
    status: 200,
    description: 'Status updated successfully',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateDeploymentDto,
  ) {
    return this.deploymentRepository.update(id, updateDto);
  }

  @Post(':id/retry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retry a failed deployment' })
  @ApiResponse({
    status: 200,
    description: 'Deployment retry queued',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot retry non-failed deployment',
  })
  async retry(@Param('id') id: string) {
    const deployment = await this.deploymentRepository.findById(id);
    if (!deployment) {
      throw new Error('Deployment not found');
    }

    if (deployment.status !== 'failed') {
      throw new Error('Can only retry failed deployments');
    }

    // Reset deployment to pending
    const updated = await this.deploymentRepository.update(id, {
      status: 'pending',
      errorLog: [],
    });

    // TODO: Re-queue the deployment job
    // await this.deploymentQueue.add('deploy', { deploymentId: id });

    return updated;
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a pending/in-progress deployment' })
  @ApiResponse({
    status: 200,
    description: 'Deployment cancelled',
  })
  async cancel(@Param('id') id: string) {
    const deployment = await this.deploymentRepository.findById(id);
    if (!deployment) {
      throw new Error('Deployment not found');
    }

    if (!['pending', 'in_progress'].includes(deployment.status)) {
      throw new Error('Can only cancel pending or in-progress deployments');
    }

    // TODO: Remove from job queue if pending
    // TODO: Cancel running job if in-progress

    return this.deploymentRepository.update(id, {
      status: 'failed',
      errorLog: ['Cancelled by user'],
      completedAt: new Date(),
    });
  }

  @Post(':id/mark-completed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark deployment as completed (internal)' })
  @ApiResponse({
    status: 200,
    description: 'Deployment marked as completed',
  })
  async markCompleted(@Param('id') id: string) {
    return this.deploymentRepository.markCompleted(id);
  }

  @Post(':id/mark-failed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark deployment as failed (internal)' })
  @ApiResponse({
    status: 200,
    description: 'Deployment marked as failed',
  })
  async markFailed(@Param('id') id: string, @Body() body: { error: string }) {
    return this.deploymentRepository.markFailed(id, body.error);
  }
}

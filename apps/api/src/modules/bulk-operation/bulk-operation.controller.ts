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
import { BulkOperationRepository } from '../../repositories';
import { PrismaService } from '../../prisma';
import { CreateBulkOperationDto, UpdateProgressDto } from './bulk-operation.dto';

@ApiTags('Bulk Operations')
@Controller('bulk-operations')
@ApiBearerAuth()
export class BulkOperationController {
  private readonly bulkOperationRepository: BulkOperationRepository;

  constructor(private readonly prisma: PrismaService) {
    this.bulkOperationRepository = new BulkOperationRepository(prisma);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new bulk operation' })
  @ApiResponse({
    status: 201,
    description: 'Bulk operation created and queued',
  })
  async create(@Body() createDto: CreateBulkOperationDto) {
    const operation = await this.bulkOperationRepository.create(createDto);

    // TODO: Queue the bulk operation for processing
    // await this.bulkOperationQueue.add('process', { operationId: operation.id });

    return operation;
  }

  @Get()
  @ApiOperation({ summary: 'Get all bulk operations' })
  @ApiResponse({
    status: 200,
    description: 'List of bulk operations',
  })
  async findAll(@Query('limit') limit?: number) {
    return this.bulkOperationRepository.findAll(
      limit ? parseInt(limit.toString()) : 50,
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get bulk operations initiated by a user' })
  @ApiResponse({
    status: 200,
    description: 'User bulk operations',
  })
  async findByInitiator(@Param('userId') userId: string) {
    return this.bulkOperationRepository.findByInitiator(userId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get bulk operations by status' })
  @ApiResponse({
    status: 200,
    description: 'Bulk operations with specified status',
  })
  async findByStatus(@Param('status') status: string) {
    return this.bulkOperationRepository.findByStatus(status);
  }

  @Get('type/:operationType')
  @ApiOperation({ summary: 'Get bulk operations by type' })
  @ApiResponse({
    status: 200,
    description: 'Bulk operations of specified type',
  })
  async findByOperationType(@Param('operationType') operationType: string) {
    return this.bulkOperationRepository.findByOperationType(operationType);
  }

  @Get('in-progress')
  @ApiOperation({ summary: 'Get all in-progress operations' })
  @ApiResponse({
    status: 200,
    description: 'In-progress bulk operations',
  })
  async findInProgress() {
    return this.bulkOperationRepository.findInProgress();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bulk operation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Bulk operation found',
  })
  @ApiResponse({
    status: 404,
    description: 'Bulk operation not found',
  })
  async findOne(@Param('id') id: string) {
    const operation = await this.bulkOperationRepository.findById(id);
    if (!operation) {
      throw new Error('Bulk operation not found');
    }
    return operation;
  }

  @Put(':id/progress')
  @ApiOperation({ summary: 'Update operation progress' })
  @ApiResponse({
    status: 200,
    description: 'Progress updated successfully',
  })
  async updateProgress(
    @Param('id') id: string,
    @Body() progressDto: UpdateProgressDto,
  ) {
    return this.bulkOperationRepository.updateProgress(
      id,
      progressDto.progress,
      progressDto.completedCount,
      progressDto.failedCount,
    );
  }

  @Post(':id/mark-in-progress')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark operation as in progress' })
  @ApiResponse({
    status: 200,
    description: 'Operation marked as in progress',
  })
  async markInProgress(@Param('id') id: string) {
    return this.bulkOperationRepository.markInProgress(id);
  }

  @Post(':id/mark-completed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark operation as completed' })
  @ApiResponse({
    status: 200,
    description: 'Operation marked as completed',
  })
  async markCompleted(@Param('id') id: string) {
    return this.bulkOperationRepository.markCompleted(id);
  }

  @Post(':id/mark-failed')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark operation as failed' })
  @ApiResponse({
    status: 200,
    description: 'Operation marked as failed',
  })
  async markFailed(@Param('id') id: string, @Body() body: { errors: any }) {
    return this.bulkOperationRepository.markFailed(id, body.errors);
  }

  @Post(':id/add-error')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add error to operation log' })
  @ApiResponse({
    status: 200,
    description: 'Error added to log',
  })
  async addError(
    @Param('id') id: string,
    @Body() body: { clientId: string; error: string },
  ) {
    return this.bulkOperationRepository.addError(id, {
      clientId: body.clientId,
      error: body.error,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete bulk operation' })
  @ApiResponse({
    status: 204,
    description: 'Bulk operation deleted successfully',
  })
  async delete(@Param('id') id: string) {
    await this.bulkOperationRepository.delete(id);
  }

  @Get('stats/by-status')
  @ApiOperation({ summary: 'Get operation count by status' })
  @ApiResponse({
    status: 200,
    description: 'Operation statistics',
  })
  async getStatsByStatus(@Query('status') status: string) {
    const count = await this.bulkOperationRepository.countByStatus(status);
    return { status, count };
  }
}

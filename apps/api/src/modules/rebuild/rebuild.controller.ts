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
import { SiteRebuildRepository } from '../../repositories';
import { PrismaService } from '../../prisma';
import { CreateRebuildDto, UpdateRebuildDto } from './rebuild.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Site Rebuilds')
@Controller('rebuilds')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RebuildController {
  private readonly rebuildRepository: SiteRebuildRepository;

  constructor(private readonly prisma: PrismaService) {
    this.rebuildRepository = new SiteRebuildRepository(prisma);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new site rebuild' })
  @ApiResponse({
    status: 201,
    description: 'Rebuild created and queued for processing',
  })
  async create(@Body() createDto: CreateRebuildDto) {
    const rebuild = await this.rebuildRepository.create({
      siteAnalysisId: createDto.siteAnalysisId,
      templateId: createDto.templateId,
      status: 'pending',
    });

    // TODO: Queue the rebuild job for processing
    // await this.rebuildQueue.add('generate', { rebuildId: rebuild.id });

    return rebuild;
  }

  @Get()
  @ApiOperation({ summary: 'Get all rebuilds' })
  @ApiResponse({
    status: 200,
    description: 'List of rebuilds',
  })
  async findAll(@Query('limit') limit?: number) {
    return this.rebuildRepository.findAll(
      limit ? parseInt(limit.toString()) : 50,
    );
  }

  @Get('analysis/:siteAnalysisId')
  @ApiOperation({ summary: 'Get rebuilds for a site analysis' })
  @ApiResponse({
    status: 200,
    description: 'Site analysis rebuilds',
  })
  async findBySiteAnalysis(@Param('siteAnalysisId') siteAnalysisId: string) {
    return this.rebuildRepository.findBySiteAnalysisId(siteAnalysisId);
  }

  @Get('analysis/:siteAnalysisId/latest')
  @ApiOperation({ summary: 'Get latest rebuild for a site analysis' })
  @ApiResponse({
    status: 200,
    description: 'Latest rebuild',
  })
  @ApiResponse({
    status: 404,
    description: 'No rebuilds found',
  })
  async findLatestBySiteAnalysis(
    @Param('siteAnalysisId') siteAnalysisId: string,
  ) {
    const rebuild = await this.rebuildRepository.findLatestBySiteAnalysisId(
      siteAnalysisId,
    );
    if (!rebuild) {
      throw new Error('No rebuilds found for this site analysis');
    }
    return rebuild;
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get rebuilds by status' })
  @ApiResponse({
    status: 200,
    description: 'Rebuilds with specified status',
  })
  async findByStatus(@Param('status') status: string) {
    return this.rebuildRepository.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rebuild by ID' })
  @ApiResponse({
    status: 200,
    description: 'Rebuild found',
  })
  @ApiResponse({
    status: 404,
    description: 'Rebuild not found',
  })
  async findOne(@Param('id') id: string) {
    const rebuild = await this.rebuildRepository.findById(id);
    if (!rebuild) {
      throw new Error('Rebuild not found');
    }
    return rebuild;
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Get rebuild with full details' })
  @ApiResponse({
    status: 200,
    description: 'Rebuild with pages, template, and deployments',
  })
  async findOneWithDetails(@Param('id') id: string) {
    const rebuild = await this.rebuildRepository.findByIdWithRelations(id);
    if (!rebuild) {
      throw new Error('Rebuild not found');
    }
    return rebuild;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update rebuild' })
  @ApiResponse({
    status: 200,
    description: 'Rebuild updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRebuildDto,
  ) {
    return this.rebuildRepository.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete rebuild' })
  @ApiResponse({
    status: 204,
    description: 'Rebuild deleted successfully',
  })
  async delete(@Param('id') id: string) {
    await this.rebuildRepository.delete(id);
  }

  @Get('stats/by-status')
  @ApiOperation({ summary: 'Get rebuild count by status' })
  @ApiResponse({
    status: 200,
    description: 'Rebuild statistics',
  })
  async getStatsByStatus(@Query('status') status: string) {
    const count = await this.rebuildRepository.countByStatus(status);
    return { status, count };
  }

  @Post(':id/regenerate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Regenerate a rebuild' })
  @ApiResponse({
    status: 200,
    description: 'Rebuild regeneration queued',
  })
  async regenerate(@Param('id') id: string) {
    const rebuild = await this.rebuildRepository.findById(id);
    if (!rebuild) {
      throw new Error('Rebuild not found');
    }

    // Reset rebuild to pending
    const updated = await this.rebuildRepository.update(id, {
      status: 'pending',
      errorMessage: undefined,
    });

    // TODO: Re-queue the rebuild job
    // await this.rebuildQueue.add('generate', { rebuildId: id });

    return updated;
  }
}

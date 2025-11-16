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
import { PageTemplateRepository } from '../../repositories';
import { PrismaService } from '../../prisma';
import { CreateTemplateDto, UpdateTemplateDto } from './template.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Page Templates')
@Controller('templates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TemplateController {
  private readonly templateRepository: PageTemplateRepository;

  constructor(private readonly prisma: PrismaService) {
    this.templateRepository = new PageTemplateRepository(prisma);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new page template' })
  @ApiResponse({
    status: 201,
    description: 'Template created successfully',
  })
  async create(@Body() createDto: CreateTemplateDto) {
    return this.templateRepository.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all templates' })
  @ApiResponse({
    status: 200,
    description: 'List of templates',
  })
  async findAll(@Query('limit') limit?: number) {
    return this.templateRepository.findAll(
      limit ? parseInt(limit.toString()) : 100,
    );
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active templates' })
  @ApiResponse({
    status: 200,
    description: 'List of active templates',
  })
  async findAllActive() {
    return this.templateRepository.findAllActive();
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get templates by type' })
  @ApiResponse({
    status: 200,
    description: 'Templates of specified type',
  })
  async findByType(@Param('type') type: string) {
    return this.templateRepository.findByType(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID' })
  @ApiResponse({
    status: 200,
    description: 'Template found',
  })
  @ApiResponse({
    status: 404,
    description: 'Template not found',
  })
  async findOne(@Param('id') id: string) {
    const template = await this.templateRepository.findById(id);
    if (!template) {
      throw new Error('Template not found');
    }
    return template;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update template' })
  @ApiResponse({
    status: 200,
    description: 'Template updated successfully',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTemplateDto,
  ) {
    return this.templateRepository.update(id, updateDto);
  }

  @Put(':id/activate')
  @ApiOperation({ summary: 'Activate template' })
  @ApiResponse({
    status: 200,
    description: 'Template activated successfully',
  })
  async activate(@Param('id') id: string) {
    return this.templateRepository.activate(id);
  }

  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate template' })
  @ApiResponse({
    status: 200,
    description: 'Template deactivated successfully',
  })
  async deactivate(@Param('id') id: string) {
    return this.templateRepository.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete template' })
  @ApiResponse({
    status: 204,
    description: 'Template deleted successfully',
  })
  async delete(@Param('id') id: string) {
    await this.templateRepository.delete(id);
  }

  @Get('stats/by-type')
  @ApiOperation({ summary: 'Get template count by type' })
  @ApiResponse({
    status: 200,
    description: 'Template statistics',
  })
  async getStatsByType(@Query('type') type: string) {
    const count = await this.templateRepository.countByType(type);
    return { type, count };
  }
}

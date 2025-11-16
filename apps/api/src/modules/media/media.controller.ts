import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  HttpStatus,
  HttpCode,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { ResourceNotFoundException } from '../../common/exceptions';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Multer configuration
const UPLOAD_DIR = './uploads';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = /jpeg|jpg|png|gif|webp/;
const ALLOWED_FILE_TYPES = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;

// Ensure upload directory exists
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    // Check file extension and mimetype
    if (
      ALLOWED_FILE_TYPES.test(ext) &&
      (mimetype.startsWith('image/') ||
        mimetype === 'application/pdf' ||
        mimetype.includes('document'))
    ) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.source}`,
        ),
        false,
      );
    }
  },
};

interface UploadResponse {
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  url: string;
}

@ApiTags('Media')
@Controller('media')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MediaController {
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file or file type not allowed',
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponse> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return {
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      url: `/media/files/${file.filename}`,
    };
  }

  @Post('upload/multiple')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  @ApiOperation({ summary: 'Upload multiple files (max 10)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid files or file types not allowed',
  })
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UploadResponse[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    return files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      url: `/media/files/${file.filename}`,
    }));
  }

  @Post('upload/image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('image', {
      ...multerConfig,
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        const mimetype = file.mimetype;

        if (ALLOWED_IMAGE_TYPES.test(ext) && mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `Invalid image type. Allowed types: ${ALLOWED_IMAGE_TYPES.source}`,
            ),
            false,
          );
        }
      },
    }),
  )
  @ApiOperation({ summary: 'Upload an image file only' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
  })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadResponse> {
    if (!file) {
      throw new BadRequestException('No image provided');
    }

    return {
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      url: `/media/files/${file.filename}`,
    };
  }

  @Get('files/:filename')
  @ApiOperation({ summary: 'Get file information' })
  @ApiResponse({
    status: 200,
    description: 'File information retrieved',
  })
  @ApiResponse({
    status: 404,
    description: 'File not found',
  })
  async getFile(@Param('filename') filename: string) {
    const filePath = join(UPLOAD_DIR, filename);

    if (!existsSync(filePath)) {
      throw new ResourceNotFoundException('File', filename);
    }

    // In a real application, you would:
    // 1. Stream the file using StreamableFile
    // 2. Set proper content-type headers
    // 3. Implement access control
    // For now, return file info

    return {
      filename,
      url: `/media/files/${filename}`,
      path: filePath,
    };
  }

  @Delete('files/:filename')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a file' })
  @ApiResponse({
    status: 204,
    description: 'File deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'File not found',
  })
  async deleteFile(@Param('filename') filename: string): Promise<void> {
    const filePath = join(UPLOAD_DIR, filename);

    if (!existsSync(filePath)) {
      throw new ResourceNotFoundException('File', filename);
    }

    try {
      unlinkSync(filePath);
    } catch (error) {
      throw new BadRequestException('Failed to delete file');
    }
  }
}

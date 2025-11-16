import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // Enable shutdown hooks
    app.enableShutdownHooks();

    // Security headers
    app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      next();
    });

    // Enable CORS with proper configuration
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
    ];
    app.enableCors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          logger.warn(`Blocked request from origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      maxAge: 3600,
    });

    // Global exception filter for consistent error handling
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Global validation pipe with detailed errors
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        errorHttpStatusCode: 422,
      }),
    );

    // Swagger API documentation
    const config = new DocumentBuilder()
      .setTitle('AI Website Rebuilder API')
      .setDescription(
        'AI-powered restaurant website rebuilding and automation platform. ' +
          'Analyze existing sites, generate Bricks builder pages, and deploy to WordPress.',
      )
      .setVersion('0.1.0')
      .addTag('chat', 'Conversational AI interface')
      .addTag('analysis', 'Website analysis and scraping')
      .addTag('rebuild', 'Page generation and rebuilding')
      .addTag('preview', 'Preview generated pages')
      .addTag('deployment', 'WordPress deployment')
      .addBearerAuth()
      .addServer('http://localhost:3001', 'Local development')
      .addServer('https://api.example.com', 'Production')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });

    const port = process.env.API_PORT || 3001;
    const environment = process.env.NODE_ENV || 'development';

    await app.listen(port);

    logger.log(`🚀 Application started successfully`);
    logger.log(`📍 Environment: ${environment}`);
    logger.log(`🌐 API running on http://localhost:${port}`);
    logger.log(`📚 API Docs available at http://localhost:${port}/api/docs`);
    logger.log(`🔒 Rate limiting: Enabled (10 req/s, 100 req/min, 1000 req/hr)`);
    logger.log(`🔑 Authentication: JWT with ${process.env.JWT_EXPIRATION || '7d'} expiration`);
  } catch (error) {
    logger.error('Failed to start application', error);
    process.exit(1);
  }
}

bootstrap();

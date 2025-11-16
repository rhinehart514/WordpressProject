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
        '## AI-Powered Restaurant Website Rebuilding Platform\n\n' +
          'Automate the entire process of rebuilding restaurant websites using AI.\n\n' +
          '### Key Features\n' +
          '- 🤖 AI-powered content analysis and extraction\n' +
          '- 🎨 Automated Bricks builder page generation\n' +
          '- 🚀 One-click WordPress deployment\n' +
          '- 💬 Interactive chat interface for customization\n' +
          '- 📱 Responsive template selection\n' +
          '- 🔄 Real-time preview before deployment\n\n' +
          '### Getting Started\n' +
          '1. Authenticate with POST /v1/auth/login\n' +
          '2. Start a conversation with POST /v1/chat/conversations\n' +
          '3. Send messages to analyze your site\n' +
          '4. Review and deploy generated pages\n\n' +
          '### API Versioning\n' +
          'All endpoints are prefixed with `/v1`',
      )
      .setVersion('1.0.0')
      .setContact(
        'Support',
        'https://github.com/yourusername/ai-website-rebuilder',
        'support@example.com',
      )
      .setLicense('MIT', 'https://opensource.org/licenses/MIT')
      .addTag('Auth', 'Authentication and authorization endpoints')
      .addTag('Chat', 'Conversational AI interface for site analysis')
      .addTag('Restaurants', 'Restaurant management endpoints')
      .addTag('Menu', 'Restaurant menu management')
      .addTag('Users', 'User profile and settings management')
      .addTag('WordPress Sites', 'WordPress site connection and management')
      .addTag('Deployments', 'Deployment job tracking and management')
      .addTag('Templates', 'Page template selection and customization')
      .addTag('Rebuilds', 'Site rebuild operations and status')
      .addTag('Preview', 'Preview generated pages before deployment')
      .addTag('Media', 'File upload and media management')
      .addTag('Health', 'System health checks and monitoring')
      .addTag('Agency', 'Multi-client agency management')
      .addTag('Bulk Operations', 'Batch operations for multiple sites')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
        'JWT-auth',
      )
      .addServer('http://localhost:3001', 'Local Development')
      .addServer('https://api-staging.example.com', 'Staging')
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

    // Set global API version prefix
    app.setGlobalPrefix('v1', {
      exclude: ['health', 'health/liveness', 'health/readiness'], // Health checks don't need versioning
    });

    const port = process.env.API_PORT || 3001;
    const environment = process.env.NODE_ENV || 'development';

    await app.listen(port);

    logger.log(`🚀 Application started successfully`);
    logger.log(`📍 Environment: ${environment}`);
    logger.log(`🌐 API running on http://localhost:${port}`);
    logger.log(`📚 API Docs available at http://localhost:${port}/api/docs`);
    logger.log(`🔖 API Version: v1 (prefix: /v1)`);
    logger.log(`🔒 Rate limiting: Enabled (10 req/s, 100 req/min, 1000 req/hr)`);
    logger.log(`🔑 Authentication: JWT with ${process.env.JWT_EXPIRATION || '7d'} expiration`);
  } catch (error) {
    logger.error('Failed to start application', error);
    process.exit(1);
  }
}

bootstrap();

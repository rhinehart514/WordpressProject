import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../../prisma';
import { RestaurantController } from './restaurant.controller';
import { RestaurantRepository } from '../../repositories';
import { DatabaseHelper } from '../../../test/helpers/database.helper';
import { RestaurantFactory } from '../../../test/factories/restaurant.factory';

describe('RestaurantController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let repository: RestaurantRepository;

  beforeAll(async () => {
    // Connect to test database
    await DatabaseHelper.connect();
    prisma = DatabaseHelper.getPrisma() as unknown as PrismaService;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        {
          provide: PrismaService,
          useValue: prisma,
        },
        RestaurantRepository,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply global validation pipe (same as main.ts)
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

    await app.init();

    repository = moduleFixture.get<RestaurantRepository>(RestaurantRepository);
  });

  beforeEach(async () => {
    // Clear database before each test
    await DatabaseHelper.clearAll();
    RestaurantFactory.resetCounter();
  });

  afterAll(async () => {
    await app.close();
    await DatabaseHelper.disconnect();
  });

  describe('POST /restaurants', () => {
    it('should create a new restaurant', () => {
      const createDto = {
        name: 'New Restaurant',
        originalUrl: 'https://new-restaurant.com',
        description: 'A new test restaurant',
        cuisineType: 'Italian',
      };

      return request(app.getHttpServer())
        .post('/restaurants')
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.name).toBe(createDto.name);
          expect(res.body.originalUrl).toBe(createDto.originalUrl);
          expect(res.body.description).toBe(createDto.description);
        });
    });

    it('should fail validation with invalid URL', () => {
      const createDto = {
        name: 'New Restaurant',
        originalUrl: 'not-a-valid-url',
        description: 'A new test restaurant',
      };

      return request(app.getHttpServer())
        .post('/restaurants')
        .send(createDto)
        .expect(422)
        .expect((res) => {
          expect(res.body.message).toContain('valid URL');
        });
    });

    it('should fail validation when name is missing', () => {
      const createDto = {
        originalUrl: 'https://restaurant.com',
      };

      return request(app.getHttpServer())
        .post('/restaurants')
        .send(createDto)
        .expect(422)
        .expect((res) => {
          expect(res.body.message).toContain('required');
        });
    });

    it('should reject extra fields not in DTO', () => {
      const createDto = {
        name: 'New Restaurant',
        originalUrl: 'https://restaurant.com',
        extraField: 'should be rejected',
      };

      return request(app.getHttpServer())
        .post('/restaurants')
        .send(createDto)
        .expect(422);
    });
  });

  describe('GET /restaurants', () => {
    it('should return all restaurants', async () => {
      await RestaurantFactory.createMany(prisma, 3);

      return request(app.getHttpServer())
        .get('/restaurants')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(3);
          expect(res.body[0].name).toBeDefined();
        });
    });

    it('should return empty array when no restaurants', () => {
      return request(app.getHttpServer())
        .get('/restaurants')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(0);
        });
    });
  });

  describe('GET /restaurants/:id', () => {
    it('should return a restaurant by id', async () => {
      const restaurant = await RestaurantFactory.create(prisma);

      return request(app.getHttpServer())
        .get(`/restaurants/${restaurant.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(restaurant.id);
          expect(res.body.name).toBe(restaurant.name);
        });
    });

    it('should return 500 when restaurant not found', () => {
      return request(app.getHttpServer())
        .get('/restaurants/non-existent-id')
        .expect(500);
    });
  });

  describe('GET /restaurants/:id/details', () => {
    it('should return restaurant with relations', async () => {
      const restaurant = await RestaurantFactory.createWithMenu(prisma, 3);

      return request(app.getHttpServer())
        .get(`/restaurants/${restaurant.id}/details`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(restaurant.id);
          expect(res.body.menuItems).toBeDefined();
          expect(res.body.menuItems.length).toBe(3);
        });
    });
  });

  describe('PUT /restaurants/:id', () => {
    it('should update a restaurant', async () => {
      const restaurant = await RestaurantFactory.create(prisma);

      const updateDto = {
        name: 'Updated Name',
        description: 'Updated description',
      };

      return request(app.getHttpServer())
        .put(`/restaurants/${restaurant.id}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateDto.name);
          expect(res.body.description).toBe(updateDto.description);
        });
    });
  });

  describe('DELETE /restaurants/:id', () => {
    it('should delete a restaurant', async () => {
      const restaurant = await RestaurantFactory.create(prisma);

      await request(app.getHttpServer())
        .delete(`/restaurants/${restaurant.id}`)
        .expect(204);

      // Verify deletion
      const deleted = await repository.findById(restaurant.id);
      expect(deleted).toBeNull();
    });
  });

  describe('GET /restaurants/search', () => {
    it('should search restaurants by name', async () => {
      await RestaurantFactory.create(prisma, {
        name: 'Italian Kitchen',
      });
      await RestaurantFactory.create(prisma, {
        name: 'French Bistro',
      });

      return request(app.getHttpServer())
        .get('/restaurants/search')
        .query({ q: 'Italian' })
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].name).toContain('Italian');
        });
    });
  });
});

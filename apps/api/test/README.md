# API Testing Guide

This directory contains the testing infrastructure for the WordPress Website Rebuilder API.

## Test Structure

```
test/
├── setup.ts                 # Global test setup and teardown
├── helpers/
│   └── database.helper.ts   # Database operations for tests
└── factories/
    ├── user.factory.ts      # User test data factory
    └── restaurant.factory.ts # Restaurant test data factory
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:cov
```

## Test Database Setup

### 1. Create Test Database

```bash
# Create test database (if not exists)
createdb wordpress_rebuilder_test

# Or using psql
psql -U postgres -c "CREATE DATABASE wordpress_rebuilder_test;"
```

### 2. Run Migrations

```bash
# Set test database URL
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wordpress_rebuilder_test?schema=public"

# Run migrations
npx prisma migrate deploy
```

### 3. Run Tests

```bash
npm test
```

## Writing Tests

### Unit Test Example

Create a file like `user.repository.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma';
import { UserRepository } from './user.repository';
import { DatabaseHelper } from '../../test/helpers/database.helper';
import { UserFactory } from '../../test/factories/user.factory';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    await DatabaseHelper.connect();
    prisma = DatabaseHelper.getPrisma() as unknown as PrismaService;
  });

  beforeEach(async () => {
    await DatabaseHelper.clearAll();
    UserFactory.resetCounter();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  afterAll(async () => {
    await DatabaseHelper.disconnect();
  });

  it('should create a user', async () => {
    const user = await UserFactory.create(prisma, {
      email: 'test@example.com',
    });

    expect(user.email).toBe('test@example.com');
  });
});
```

### Integration Test Example

Create a file like `restaurant.controller.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../../prisma';
import { RestaurantController } from './restaurant.controller';
import { DatabaseHelper } from '../../../test/helpers/database.helper';

describe('RestaurantController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    await DatabaseHelper.connect();
    prisma = DatabaseHelper.getPrisma() as unknown as PrismaService;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        { provide: PrismaService, useValue: prisma },
        RestaurantRepository,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  beforeEach(async () => {
    await DatabaseHelper.clearAll();
  });

  afterAll(async () => {
    await app.close();
    await DatabaseHelper.disconnect();
  });

  it('should create a restaurant', () => {
    return request(app.getHttpServer())
      .post('/restaurants')
      .send({ name: 'Test', originalUrl: 'https://test.com' })
      .expect(201);
  });
});
```

## Test Factories

Use factories to create test data:

```typescript
import { UserFactory } from '../../test/factories/user.factory';
import { RestaurantFactory } from '../../test/factories/restaurant.factory';

// Create single user
const user = await UserFactory.create(prisma);

// Create user with specific data
const admin = await UserFactory.createAdmin(prisma, {
  email: 'admin@example.com',
});

// Create multiple users
const users = await UserFactory.createMany(prisma, 5);

// Create restaurant with menu
const restaurant = await RestaurantFactory.createWithMenu(prisma, 10);
```

## Database Helper

Useful database operations for tests:

```typescript
import { DatabaseHelper } from '../../test/helpers/database.helper';

// Connect to test database
await DatabaseHelper.connect();

// Clear all tables
await DatabaseHelper.clearAll();

// Run migrations
await DatabaseHelper.migrate();

// Reset database (WARNING: deletes all data)
await DatabaseHelper.reset();

// Disconnect
await DatabaseHelper.disconnect();
```

## Best Practices

1. **Isolate Tests**: Each test should be independent and not rely on other tests
2. **Clean Database**: Use `DatabaseHelper.clearAll()` in `beforeEach()` to ensure clean state
3. **Use Factories**: Don't create data manually, use factories for consistency
4. **Test Edge Cases**: Test both success and failure scenarios
5. **Meaningful Names**: Use descriptive test names that explain what is being tested
6. **AAA Pattern**: Arrange, Act, Assert - structure tests clearly
7. **Mock External Services**: Use mocks for OpenAI, WordPress API, etc.

## Coverage Goals

- **Repositories**: 80%+ coverage
- **Controllers**: 70%+ coverage
- **Services**: 80%+ coverage
- **Overall**: 50%+ coverage (enforced by Jest config)

## Continuous Integration

Tests run automatically on:
- Every push to main branch
- Every pull request
- Before deployment

Coverage reports are uploaded to the CI/CD platform and must meet threshold to merge.

## Troubleshooting

### Tests timing out
- Increase timeout in `setup.ts`: `jest.setTimeout(60000)`
- Check database connection
- Ensure test database is running

### Database errors
- Verify `DATABASE_URL` in `.env.test` is correct
- Run migrations: `npx prisma migrate deploy`
- Check PostgreSQL is running

### Import errors
- Check `tsconfig.json` paths configuration
- Ensure all dependencies are installed: `npm install`

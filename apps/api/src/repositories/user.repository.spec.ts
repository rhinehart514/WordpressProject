import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma';
import { UserRepository } from './user.repository';
import { DatabaseHelper } from '../../test/helpers/database.helper';
import { UserFactory } from '../../test/factories/user.factory';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    // Connect to test database
    await DatabaseHelper.connect();
    prisma = DatabaseHelper.getPrisma() as unknown as PrismaService;
  });

  beforeEach(async () => {
    // Clear database before each test
    await DatabaseHelper.clearAll();
    UserFactory.resetCounter();

    // Create testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  afterAll(async () => {
    // Disconnect from database
    await DatabaseHelper.disconnect();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const user = await repository.create(userData);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.password).toBe(userData.password);
      expect(user.role).toBe('user'); // Default role
    });

    it('should create user with admin role', async () => {
      const userData = {
        email: 'admin@example.com',
        password: 'hashedPassword123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      };

      const user = await repository.create(userData);

      expect(user.role).toBe('admin');
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const testUser = await UserFactory.create(prisma, {
        email: 'test@example.com',
      });

      const foundUser = await repository.findByEmail('test@example.com');

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(testUser.id);
      expect(foundUser?.email).toBe(testUser.email);
    });

    it('should return null if user not found', async () => {
      const foundUser = await repository.findByEmail('nonexistent@example.com');

      expect(foundUser).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const testUser = await UserFactory.create(prisma);

      const foundUser = await repository.findById(testUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(testUser.id);
      expect(foundUser?.email).toBe(testUser.email);
    });

    it('should return null if user not found', async () => {
      const foundUser = await repository.findById('non-existent-id');

      expect(foundUser).toBeNull();
    });
  });

  describe('emailExists', () => {
    it('should return true if email exists', async () => {
      await UserFactory.create(prisma, { email: 'exists@example.com' });

      const exists = await repository.emailExists('exists@example.com');

      expect(exists).toBe(true);
    });

    it('should return false if email does not exist', async () => {
      const exists = await repository.emailExists('notexists@example.com');

      expect(exists).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      await UserFactory.createMany(prisma, 5);

      const users = await repository.findAll();

      expect(users).toHaveLength(5);
    });

    it('should return empty array if no users', async () => {
      const users = await repository.findAll();

      expect(users).toHaveLength(0);
    });
  });

  describe('findByRole', () => {
    it('should find users by role', async () => {
      await UserFactory.createMany(prisma, 3, { role: 'user' });
      await UserFactory.createMany(prisma, 2, { role: 'admin' });

      const users = await repository.findByRole('user');
      const admins = await repository.findByRole('admin');

      expect(users).toHaveLength(3);
      expect(admins).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const testUser = await UserFactory.create(prisma);

      const updated = await repository.update(testUser.id, {
        firstName: 'Updated',
        lastName: 'Name',
      });

      expect(updated.firstName).toBe('Updated');
      expect(updated.lastName).toBe('Name');
      expect(updated.email).toBe(testUser.email); // Unchanged
    });
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const testUser = await UserFactory.create(prisma);
      const newHashedPassword = 'newHashedPassword123';

      const updated = await repository.updatePassword(
        testUser.id,
        newHashedPassword,
      );

      expect(updated.password).toBe(newHashedPassword);
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      const testUser = await UserFactory.create(prisma);

      await repository.delete(testUser.id);

      const foundUser = await repository.findById(testUser.id);
      expect(foundUser).toBeNull();
    });
  });

  describe('count', () => {
    it('should count total users', async () => {
      await UserFactory.createMany(prisma, 7);

      const count = await repository.count();

      expect(count).toBe(7);
    });
  });
});

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data (in reverse order of dependencies)
  console.log('🗑️  Cleaning existing data...');
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.deploymentJob.deleteMany();
  await prisma.generatedPage.deleteMany();
  await prisma.siteRebuild.deleteMany();
  await prisma.siteAnalysis.deleteMany();
  await prisma.operatingHour.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Existing data cleaned');

  // Create test users
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });

  const restaurantOwner = await prisma.user.create({
    data: {
      email: 'owner@restaurant.com',
      passwordHash: hashedPassword,
      name: 'Restaurant Owner',
      role: 'user',
    },
  });

  const agencyUser = await prisma.user.create({
    data: {
      email: 'agency@example.com',
      passwordHash: hashedPassword,
      name: 'Agency Manager',
      role: 'agency',
    },
  });

  console.log(\`✅ Created 3 users\`);

  // Create test restaurants
  console.log('🍽️  Creating restaurants...');
  const restaurant1 = await prisma.restaurant.create({
    data: {
      name: 'The Italian Kitchen',
      originalUrl: 'https://old-italian-kitchen.com',
      description: 'Authentic Italian cuisine in downtown',
      cuisineType: 'Italian',
      ownerUserId: restaurantOwner.id,
      metadata: {
        phone: '+1-555-0101',
        address: '123 Main St, Downtown',
      },
    },
  });

  const restaurant2 = await prisma.restaurant.create({
    data: {
      name: 'Sushi Paradise',
      originalUrl: 'https://old-sushi-paradise.com',
      description: 'Fresh sushi and Japanese cuisine',
      cuisineType: 'Japanese',
      ownerUserId: restaurantOwner.id,
      metadata: {
        phone: '+1-555-0102',
        address: '456 Ocean Ave',
      },
    },
  });

  console.log(\`✅ Created 2 restaurants\`);

  // Create menu items
  console.log('📋 Creating menu items...');
  const menuItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        restaurantId: restaurant1.id,
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato, mozzarella, and basil',
        price: 12.99,
        category: 'Pizza',
        imageUrl: 'https://example.com/pizza.jpg',
        available: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        restaurantId: restaurant1.id,
        name: 'Spaghetti Carbonara',
        description: 'Traditional pasta with eggs, cheese, and pancetta',
        price: 14.99,
        category: 'Pasta',
        available: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        restaurantId: restaurant2.id,
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber roll',
        price: 8.99,
        category: 'Rolls',
        available: true,
      },
    }),
    prisma.menuItem.create({
      data: {
        restaurantId: restaurant2.id,
        name: 'Salmon Sashimi',
        description: 'Fresh salmon slices',
        price: 15.99,
        category: 'Sashimi',
        available: true,
      },
    }),
  ]);

  console.log(\`✅ Created \${menuItems.length} menu items\`);

  console.log('\n✨ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log('   - 3 users created');
  console.log('   - 2 restaurants created');
  console.log(\`   - \${menuItems.length} menu items created\`);
  console.log('\n🔑 Test Credentials:');
  console.log('   Admin: admin@example.com / password123');
  console.log('   Owner: owner@restaurant.com / password123');
  console.log('   Agency: agency@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

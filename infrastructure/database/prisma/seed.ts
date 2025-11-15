import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default page templates
  const classicTemplate = await prisma.pageTemplate.create({
    data: {
      name: 'Restaurant Classic',
      type: 'restaurant_classic',
      description: 'Traditional restaurant layout with hero section, menu grid, and gallery',
      config: {
        heroLayout: 'full-width',
        menuLayout: 'grid',
        galleryLayout: 'masonry',
        colorScheme: {
          primary: '#1a1a1a',
          secondary: '#f5f5f5',
          accent: '#d4af37',
          background: '#ffffff',
          text: '#333333',
        },
        typography: {
          headingFont: 'Playfair Display',
          bodyFont: 'Inter',
        },
      },
    },
  });

  const modernTemplate = await prisma.pageTemplate.create({
    data: {
      name: 'Restaurant Modern',
      type: 'restaurant_modern',
      description: 'Contemporary design with bold typography and minimalist layout',
      config: {
        heroLayout: 'split-screen',
        menuLayout: 'list',
        galleryLayout: 'grid',
        colorScheme: {
          primary: '#0a0a0a',
          secondary: '#f9f9f9',
          accent: '#ff6b35',
          background: '#ffffff',
          text: '#2d2d2d',
        },
        typography: {
          headingFont: 'Poppins',
          bodyFont: 'Open Sans',
        },
      },
    },
  });

  console.log('✅ Created default templates:', {
    classic: classicTemplate.id,
    modern: modernTemplate.id,
  });

  // Create demo user
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@aiwebsiterebuilder.com',
      passwordHash: '$2b$10$demohashdemohashdemohashdemohashdemohashdemohashdemo', // Not a real hash
      firstName: 'Demo',
      lastName: 'User',
      role: 'restaurant_owner',
    },
  });

  console.log('✅ Created demo user:', demoUser.email);

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

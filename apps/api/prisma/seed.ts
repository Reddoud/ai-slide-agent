import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default organization
  const org = await prisma.organization.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Demo Organization',
      slug: 'demo',
    },
  });

  console.log('Created organization:', org.name);

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'ADMIN',
      organizationId: org.id,
    },
  });

  console.log('Created user:', user.email);

  // Create default themes
  const corporateTheme = await prisma.theme.upsert({
    where: { id: 'corporate-blue' },
    update: {},
    create: {
      id: 'corporate-blue',
      name: 'Corporate Blue',
      isPublic: true,
      colors: {
        primary: '#0088CC',
        secondary: '#005A8C',
        accent: '#00C851',
        background: '#FFFFFF',
        text: '#333333',
        textSecondary: '#666666',
      },
      typography: {
        headingFont: 'Arial',
        bodyFont: 'Arial',
        h1Size: 44,
        h2Size: 32,
        h3Size: 24,
        bodySize: 18,
      },
      spacing: {
        slideMargin: 40,
        elementPadding: 20,
        lineHeight: 1.4,
        paragraphSpacing: 16,
      },
    },
  });

  const modernTheme = await prisma.theme.upsert({
    where: { id: 'modern-minimal' },
    update: {},
    create: {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      isPublic: true,
      colors: {
        primary: '#2C3E50',
        secondary: '#34495E',
        accent: '#E74C3C',
        background: '#FFFFFF',
        text: '#2C3E50',
        textSecondary: '#7F8C8D',
      },
      typography: {
        headingFont: 'Calibri',
        bodyFont: 'Calibri',
        h1Size: 48,
        h2Size: 36,
        h3Size: 28,
        bodySize: 20,
      },
      spacing: {
        slideMargin: 50,
        elementPadding: 24,
        lineHeight: 1.5,
        paragraphSpacing: 20,
      },
    },
  });

  console.log('Created themes:', corporateTheme.name, modernTheme.name);

  // Create a demo deck
  const demoDeck = await prisma.deck.create({
    data: {
      title: 'Sample Consulting Deck',
      status: 'COMPLETED',
      audience: 'executive',
      goal: 'persuade',
      targetSlides: 10,
      themeId: corporateTheme.id,
      organizationId: org.id,
      createdById: user.id,
      planData: {
        narrative: 'A sample deck showcasing the platform capabilities',
        agenda: ['Introduction', 'Problem', 'Solution', 'Next Steps'],
      },
      slides: {
        create: [
          {
            type: 'title',
            order: 0,
            title: 'Sample Consulting Deck',
            subtitle: 'Demonstrating AI-Powered Slide Generation',
          },
          {
            type: 'agenda',
            order: 1,
            title: 'Agenda',
            notes: 'Quick overview of what we will cover',
          },
          {
            type: 'content',
            order: 2,
            title: 'The Challenge',
            notes: 'Outline the key problem we are addressing',
          },
        ],
      },
    },
  });

  console.log('Created demo deck:', demoDeck.title);

  console.log('\nSeed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

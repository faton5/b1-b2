import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('Seeding database from API...');

    // Clear existing to avoid unique constraint errors during successive test runs
    await prisma.userBadge.deleteMany({});
    await prisma.userModuleProgress.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.module.deleteMany({});
    await prisma.badge.deleteMany({});

    // Create badges
    const badge1 = await prisma.badge.create({
      data: {
        name: 'Welcome to AI Academy',
        icon: 'sparkles',
        condition_exp: 0,
      },
    });

    const badge2 = await prisma.badge.create({
      data: {
        name: 'First steps',
        icon: 'star',
        condition_exp: 100,
      },
    });

    const badge3 = await prisma.badge.create({
      data: {
        name: 'AI Maestro',
        icon: 'trophy',
        condition_exp: 1000,
      },
    });

    // Create modules
    const module1 = await prisma.module.create({
      data: {
        title: 'Introduction to AI',
        content: 'Learn the basics of Artificial Intelligence and its daily applications.',
        order: 1,
      },
    });

    const module2 = await prisma.module.create({
      data: {
        title: 'Machine Learning Basics',
        content: 'Understand algorithms, training data, and predictions.',
        order: 2,
      },
    });

    // Create a teacher user
    await prisma.user.create({
      data: {
        email: 'admin@prof.com',
        password: 'hashed_password_placeholder', // TODO: Hash real passwords
        pseudo: 'Prof. AI',
        role: 'TEACHER',
        level: 10,
        total_exp: 5000,
      },
    });

    // Create a student user
    const student = await prisma.user.create({
      data: {
        email: 'student@example.com',
        password: 'hashed_password_placeholder',
        pseudo: 'AI Apprentice',
        role: 'STUDENT',
        level: 2,
        total_exp: 150,
      },
    });

    // Associate users with badges and module progress
    await prisma.userBadge.create({
      data: {
        userId: student.id,
        badgeId: badge1.id,
      },
    });

    await prisma.userBadge.create({
      data: {
        userId: student.id,
        badgeId: badge2.id,
      },
    });

    await prisma.userModuleProgress.create({
      data: {
        userId: student.id,
        moduleId: module1.id,
        status: 'COMPLETED',
      },
    });

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

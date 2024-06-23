import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const date = new Date('2024-06-21T00:00:00.000Z');

  await prisma.user.updateMany({
    data: {
      createdAt: date,
      updatedAt: date
    }
  });

  await prisma.group.updateMany({
    data: {
      createdAt: date,
      updatedAt: date
    }
  });

  await prisma.test.updateMany({
    data: {
      createdAt: date,
      updatedAt: date
    }
  });

  await prisma.userTest.updateMany({
    data: {
      createdAt: date,
      updatedAt: date
    }
  });

  await prisma.groupTest.updateMany({
    data: {
      createdAt: date,
      updatedAt: date
    }
  });

  await prisma.question.updateMany({
    data: {
      createdAt: date,
      updatedAt: date
    }
  });

  await prisma.answer.updateMany({
    data: {
      createdAt: date,
      updatedAt: date
    }
  });

  await prisma.userAnswer.updateMany({
    data: {
      createdAt: date,
      updatedAt: date
    }
  });

  await prisma.result.updateMany({
    data: {
      createdAt: date,
      updatedAt: date
    }
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

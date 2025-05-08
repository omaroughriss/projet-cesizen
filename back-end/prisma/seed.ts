import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Nettoyer la base de données
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Article" RESTART IDENTITY CASCADE;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Question" RESTART IDENTITY CASCADE;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Role" RESTART IDENTITY CASCADE;`);

  // Créer les rôles
  const adminRole = await prisma.role.create({
    data: {
      roleName: 'administrateur',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      roleName: 'utilisateur',
    },
  });

  // Créer les utilisateurs
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      activated: true,
      roleId: adminRole.id,
    },
  });

  // Créer des catégories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        categoryName: 'Développement Web',
      },
    }),
    prisma.category.create({
      data: {
        categoryName: 'Design',
      },
    }),
    prisma.category.create({
      data: {
        categoryName: 'Marketing Digital',
      },
    }),
  ]);

  // Créer des articles
  await Promise.all([
    prisma.article.create({
      data: {
        title: 'Introduction à React',
        content: 'React est une bibliothèque JavaScript pour créer des interfaces utilisateur...',
        categoryId: categories[0].id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'Principes de Design UI/UX',
        content: 'Le design UI/UX est crucial pour créer des applications conviviales...',
        categoryId: categories[1].id,
      },
    }),
  ]);

  // Créer des questions
  await Promise.all([
    prisma.question.create({
      data: {
        question: 'Quelle est la différence entre React et Angular ?',
        score: 5,
      },
    }),
    prisma.question.create({
      data: {
        question: 'Comment optimiser les performances d\'une application web ?',
        score: 8,
      },
    }),
  ]);

  console.log('Base de données remplie avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
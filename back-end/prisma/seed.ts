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
  const hashedPassword = await bcrypt.hash('Hola123', 10);

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

  const user = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@example.com',
      username: 'user',
      password: hashedPassword,
      activated: true,
      roleId: userRole.id,
    },
  });

  // Créer des catégories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        categoryName: 'Gestion du Stress',
      },
    }),
    prisma.category.create({
      data: {
        categoryName: 'Bien-être Émotionnel',
      },
    }),
    prisma.category.create({
      data: {
        categoryName: 'Relations Sociales',
      },
    }),
    prisma.category.create({
      data: {
        categoryName: 'Adaptation au Changement',
      },
    }),
  ]);

  // Créer des articles
  await Promise.all([
    // Articles pour la catégorie "Gestion du Stress"
    prisma.article.create({
      data: {
        title: 'Comprendre l\'échelle de Holmes et Rahe',
        content: 'L\'échelle de Holmes et Rahe est un outil d\'évaluation du stress qui mesure l\'impact cumulatif des événements de vie stressants sur notre santé mentale. Développée par les psychiatres Thomas Holmes et Richard Rahe, cette échelle attribue des points à différents événements de vie, permettant d\'évaluer le risque de développer des problèmes de santé liés au stress...',
        image: 'https://example.com/images/holmes-rahe-scale.jpg',
        categoryId: categories[0].id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'Techniques de Respiration Anti-stress',
        content: 'La respiration est l\'un des outils les plus puissants pour gérer le stress. Découvrez différentes techniques de respiration comme la cohérence cardiaque, la respiration 4-7-8, et la respiration carrée. Ces méthodes simples peuvent être pratiquées n\'importe où et à tout moment pour réduire rapidement le niveau de stress...',
        image: 'https://example.com/images/breathing-techniques.jpg',
        categoryId: categories[0].id,
      },
    }),

    // Articles pour la catégorie "Bien-être Émotionnel"
    prisma.article.create({
      data: {
        title: 'L\'importance de l\'Intelligence Émotionnelle',
        content: 'L\'intelligence émotionnelle est la capacité à reconnaître, comprendre et gérer ses propres émotions, ainsi que celles des autres. Découvrez comment développer votre conscience émotionnelle et améliorer vos relations interpersonnelles...',
        image: 'https://example.com/images/emotional-intelligence.jpg',
        categoryId: categories[1].id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'La Pratique de la Pleine Conscience',
        content: 'La pleine conscience est une pratique qui nous aide à vivre dans le moment présent. Apprenez des exercices simples de mindfulness pour réduire l\'anxiété, améliorer la concentration et développer une plus grande paix intérieure...',
        image: 'https://example.com/images/mindfulness.jpg',
        categoryId: categories[1].id,
      },
    }),

    // Articles pour la catégorie "Relations Sociales"
    prisma.article.create({
      data: {
        title: 'Construire des Relations Saines',
        content: 'Les relations sociales positives sont essentielles pour notre santé mentale. Découvrez les clés pour développer et maintenir des relations enrichissantes, établir des limites saines et communiquer efficacement avec les autres...',
        image: 'https://example.com/images/healthy-relationships.jpg',
        categoryId: categories[2].id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'Surmonter l\'Isolement Social',
        content: 'L\'isolement social peut avoir un impact significatif sur notre bien-être mental. Apprenez des stratégies pratiques pour créer des connexions significatives, maintenir des liens sociaux et combattre la solitude...',
        image: 'https://example.com/images/social-connection.jpg',
        categoryId: categories[2].id,
      },
    }),

    // Articles pour la catégorie "Adaptation au Changement"
    prisma.article.create({
      data: {
        title: 'Développer la Résilience',
        content: 'La résilience est notre capacité à rebondir face aux défis et aux changements. Explorez les facteurs qui renforcent la résilience et apprenez des stratégies concrètes pour mieux faire face aux situations difficiles...',
        image: 'https://example.com/images/resilience.jpg',
        categoryId: categories[3].id,
      },
    }),
    prisma.article.create({
      data: {
        title: 'Gérer les Transitions de Vie',
        content: 'Les transitions de vie peuvent être stressantes, qu\'il s\'agisse d\'un changement professionnel, d\'un déménagement ou d\'une transformation personnelle. Découvrez des outils pratiques pour naviguer ces périodes de changement avec plus de sérénité...',
        image: 'https://example.com/images/life-transitions.jpg',
        categoryId: categories[3].id,
      },
    }),
  ]);

  // Créer des questions basées sur l'échelle de Holmes et Rahe
  const questions = [
    { question: "Avez-vous vécu le décès de votre conjoint(e) récemment ?", score: 100 },
    { question: "Avez-vous divorcé récemment ?", score: 73 },
    { question: "Avez-vous vécu une séparation conjugale ?", score: 65 },
    { question: "Avez-vous fait un séjour en prison ?", score: 63 },
    { question: "Avez-vous perdu un membre proche de votre famille ?", score: 63 },
    { question: "Avez-vous eu une blessure ou maladie personnelle ?", score: 53 },
    { question: "Vous êtes-vous marié(e) récemment ?", score: 50 },
    { question: "Avez-vous été licencié(e) de votre travail ?", score: 47 },
    { question: "Vous êtes-vous réconcilié(e) avec votre conjoint(e) ?", score: 45 },
    { question: "Avez-vous pris votre retraite ?", score: 45 },
    { question: "Y a-t-il eu un changement dans la santé d'un membre de la famille ?", score: 44 },
    { question: "Êtes-vous enceinte ?", score: 40 },
    { question: "Avez-vous des difficultés sexuelles ?", score: 39 },
    { question: "Un nouveau membre est-il arrivé dans la famille ?", score: 39 },
    { question: "Avez-vous vécu une réorganisation professionnelle ?", score: 39 },
    { question: "Y a-t-il eu un changement dans votre situation financière ?", score: 38 },
    { question: "Avez-vous perdu un ami proche ?", score: 37 },
    { question: "Avez-vous changé de type de travail ?", score: 36 },
    { question: "Les disputes avec votre conjoint(e) ont-elles augmenté ?", score: 35 },
    { question: "Avez-vous contracté un prêt important ?", score: 31 },
  ];

  await Promise.all(
    questions.map(q => 
      prisma.question.create({
        data: {
          question: q.question,
          score: q.score,
        },
      })
    )
  );

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
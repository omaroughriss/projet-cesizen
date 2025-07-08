#!/bin/sh

echo "Attente de la base de données..."
while ! npx prisma db push --skip-generate; do
  echo "Base de données pas encore prête. Nouvelle tentative dans 2 secondes..."
  sleep 2
done
echo "Base de données mise à jour avec succès"

echo "Initialisation des données..."
node prisma/seed.ts

echo "Démarrage de l'application..."
exec node dist/src/main 
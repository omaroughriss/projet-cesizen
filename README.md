# CESIZEN - Guide d'Installation

Ce projet est composé de trois parties principales : une application front-end, une API back-end, et une application mobile.

## Prérequis

- Node.js (v18 ou supérieur)
- npm ou bun (gestionnaire de paquets)
- Git
- Base de données PostgreSQL

## Structure du Projet

```
projet-cesizen/
├── front-end/     # Application web React/Vite
├── back-end/      # API NestJS
└── mobile-view/   # Application mobile
```

## Installation du Front-end

1. Accédez au répertoire front-end :
```bash
cd front-end
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez l'application en mode développement :
```bash
npm run dev -- --host
```

L'application sera accessible à l'adresse `http://localhost:8080`

## Installation du Back-end

1. Accédez au répertoire back-end :
```bash
cd back-end
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez votre base de données :
   - Créez un fichier `.env` à la racine du dossier back-end
   - Ajoutez vos variables d'environnement :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/cesizen"
```

4. Exécutez les migrations Prisma :
```bash
npx prisma migrate dev
```

5. Lancez le serveur en mode développement :
```bash
npm run start:dev
```

L'API sera accessible à l'adresse `http://localhost:3000`

## Installation de l'Application Mobile

1. Accédez au répertoire mobile-view/mon-app-mobile :
```bash
cd mobile-view/mon-app-mobile
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez l'application :
```bash
npx expo start --lan
```

## Scripts Disponibles

### Front-end
- `npm run dev` : Lance le serveur de développement
- `npm run build` : Crée une version de production
- `npm run test` : Lance les tests
- `npm run lint` : Vérifie le code avec ESLint

### Back-end
- `npm run start:dev` : Lance le serveur en mode développement
- `npm run build` : Compile l'application
- `npm run prisma:studio` : Ouvre l'interface Prisma Studio

## Support

Pour toute question ou problème, veuillez ouvrir une issue dans le dépôt GitHub. 
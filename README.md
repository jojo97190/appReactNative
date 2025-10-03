# Application de Gestion des Congés

Cette application mobile développée avec React Native et Expo permet de gérer les demandes d'absences au sein d'une organisation.

## Fonctionnalités

- 🔐 Système d'authentification
- 📅 Sélecteur de dates interactif
- 📝 Création de demandes d'absences
- 👀 Consultation des demandes
- 👨‍💼 Interface gestionnaire

## Technologies Utilisées

- React Native
- Expo
- TypeScript
- Supabase (pour la base de données)

## Structure du Projet

```
appReact/
├── api/                  # Configuration API
├── app/                  # Pages de l'application
│   ├── login.tsx        # Page de connexion
│   ├── request.tsx      # Création de demandes
│   ├── my-request.tsx   # Mes demandes
│   └── manager.tsx      # Interface gestionnaire
├── assets/              # Ressources (images, etc.)
└── components/          # Composants réutilisables
    ├── LoginBubble.tsx  # Composant de connexion
    ├── NavBar.tsx       # Barre de navigation
    └── selectDate.tsx   # Sélecteur de dates
```

## Installation

1. Cloner le repository :
```bash
git clone https://github.com/jojo97190/appReactNative.git
```

2. Installer les dépendances :
```bash
cd appReact
npm install
```

3. Lancer l'application :
```bash
npx expo start
```

## Utilisation

- Connectez-vous avec vos identifiants
- Pour créer une demande de congés :
  1. Accédez à la page "Nouvelle Demande"
  2. Sélectionnez les dates (les weekends sont automatiquement exclus)
  3. Ajoutez un motif
  4. Validez votre demande

## Version

- Version actuelle : 1.0.0
- État : En développement

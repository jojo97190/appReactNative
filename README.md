# Application de Gestion d'absences

Cette application mobile développée avec React Native et Expo permet de gérer les demandes d'absences au sein d'une organisation.

## Fonctionnalités

### Authentification et Sécurité
- 🔐 Système d'authentification robuste
- ✅ Validation des emails (format standard)
- 🔒 Validation stricte des mots de passe :
  - Minimum 12 caractères
  - Au moins une lettre majuscule et minuscule
  - Au moins un chiffre
  - Au moins un caractère spécial
- 👥 Gestion des rôles (Admin / Enseignant)

### Gestion des Demandes d'Absence
- 📅 Sélecteur de dates interactif avec exclusion automatique des weekends
- 📝 Création de demandes d'absences avec motif obligatoire
- 👀 Consultation de l'historique des demandes
- 📊 Tri automatique par date (plus récentes en premier)
- ⏰ Auto-rejet des demandes avec dates passées

### Horaires de Remplacement
- 🕐 Planification optionnelle d'horaires de remplacement
- ⏱️ Sélecteur d'heures avec plage horaire restreinte (7h-17h)
- ✓ Validation de durée minimale (1 heure)
- 🏫 Saisie de salle et classe de remplacement
- 📆 Validation que la date de remplacement est après la période d'absence
- ⚠️ Vérifications en temps réel des horaires saisies

### Interface Administrateur
- 👨‍💼 Dashboard avec compteur de demandes en attente
- 📋 Gestion et validation des demandes
- 🔍 Affichage détaillé des informations de remplacement
- 🎯 Interface spécifique selon le rôle utilisateur

### Expérience Utilisateur
- ⌨️ Gestion intelligente du clavier (KeyboardAvoidingView)
- 🔙 Navigation avec bouton retour
- 🎨 Design moderne avec thème indigo cohérent
- 📱 Interface responsive et intuitive
- 🔔 Notifications et alertes informatives

## Technologies Utilisées

- React Native
- Expo
- TypeScript
- Supabase (pour la base de données)

## Structure du Projet

```
appReact/
├── api/                          # Configuration API
├── app/                          # Pages de l'application
│   ├── _layout.tsx              # Layout principal
│   ├── index.tsx                # Page d'accueil avec statistiques
│   ├── login.tsx                # Page de connexion
│   ├── inscription.tsx          # Page d'inscription avec validation
│   ├── request.tsx              # Création de demandes avec remplacement
│   ├── my-request.tsx           # Historique personnel des demandes
│   ├── manager.tsx              # Interface de gestion administrateur
│   ├── supabase.js              # Configuration Supabase
│   └── usercontext.js           # Contexte utilisateur global
├── assets/                       # Ressources (images, etc.)
│   └── images/
├── components/                   # Composants réutilisables
│   ├── LoginBubble.tsx          # Bulle de connexion/déconnexion
│   ├── NavBar.tsx               # Barre de navigation avec rôles
│   ├── selectDate.tsx           # Sélecteur de période (plage)
│   ├── selectSingleDate.tsx     # Sélecteur de date unique
│   └── TimeSelector.tsx         # Sélecteur d'heures (7h-17h)
├── constants/                    # Constantes de l'application
└── types/                        # Définitions TypeScript
    └── demande.ts               # Types pour les demandes d'absence
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

### Inscription
1. Remplissez le formulaire d'inscription avec :
   - Nom et prénom
   - Email valide (format standard)
   - Mot de passe sécurisé (12 caractères min., majuscules, minuscules, chiffres, caractères spéciaux)
   - Sélection du rôle (Admin ou Enseignant)

### Connexion
- Connectez-vous avec vos identifiants
- L'interface s'adapte automatiquement selon votre rôle

### Créer une Demande d'Absence
1. Accédez à "Nouvelle Demande"
2. Sélectionnez la période d'absence :
   - Choisissez les dates de début et fin
   - Les weekends sont automatiquement exclus
3. Saisissez le motif de l'absence
4. (Optionnel) Ajoutez un horaire de remplacement :
   - Date de remplacement (doit être après la fin de l'absence)
   - Heures de début et fin (entre 7h et 17h, durée min. 1h)
   - Numéro de salle
   - Nom de la classe
5. Validez votre demande

### Consulter vos Demandes
- Accédez à "Mes Demandes"
- Visualisez l'historique complet avec :
  - Statut (En attente / Accepté / Refusé)
  - Période d'absence
  - Informations de remplacement si renseignées
  - Tri automatique par date (plus récentes en premier)

### Interface Administrateur (Manager)
- Accédez au tableau de bord
- Visualisez le nombre de demandes en attente
- Consultez toutes les demandes avec détails complets
- Les demandes avec dates passées sont automatiquement rejetées

## Base de Données

### Table `demande_absence`
- `id_absence` : Identifiant unique
- `user_id` : Référence utilisateur
- `absence_date` : Date de début
- `absence_dateFin` : Date de fin
- `statut` : État de la demande (et/acc/rf)
- `raison` : Motif de l'absence
- `date_remplacement` : Date du remplacement (optionnel)
- `heure_remplacement_deb` : Heure de début du remplacement
- `heure_remplacement_fin` : Heure de fin du remplacement
- `salle_remplacement` : Numéro de salle
- `classe` : Nom de la classe
- `commentaire` : Commentaire administrateur
- `date_creation` : Date de création
- `date_maj` : Date de dernière modification

## Design System

### Palette de Couleurs
- **Primary (Indigo)** : `#6366f1`
- **Background** : `#f0f4f8`
- **Text Primary** : `#1e293b`
- **Text Secondary** : `#64748b`
- **Borders** : `#e2e8f0`
- **Success** : `#d1fae5`
- **Error** : `#fee2e2`
- **Warning** : `#fef3c7`

### Composants
- **Border Radius** : 12-20px
- **Font Weight** : 700-800 (titres)
- **Shadows** : elevation 2-8
- **Letter Spacing** : -0.3 à 0.5

## Version

- Version actuelle : 2.0.0
- État : En développement actif

## Validations Implémentées

### Sécurité
- ✅ Validation email (format standard avec @)
- ✅ Mot de passe complexe (12 car. min, Aa, 0-9, caractères spéciaux)
- ✅ Vérification d'unicité email lors de l'inscription

### Demandes d'Absence
- ✅ Champs obligatoires (dates, motif)
- ✅ Exclusion automatique des weekends
- ✅ Auto-rejet des dates passées ou du jour même

### Horaires de Remplacement
- ✅ Date de remplacement après la période d'absence
- ✅ Plage horaire 7h-17h uniquement
- ✅ Heure de fin après heure de début
- ✅ Durée minimale de 1 heure
- ✅ Validation en temps réel lors de la sélection

## Améliorations Récentes

- 🎨 Modernisation complète de l'interface (thème indigo)
- 🔐 Renforcement de la sécurité des mots de passe
- ⏰ Ajout du système de remplacement complet
- 📊 Tri automatique par date
- ⌨️ Gestion optimisée du clavier
- 🔙 Navigation améliorée avec bouton retour
- 📈 Dashboard administrateur avec statistiques
- ✨ Validations multiples en temps réel

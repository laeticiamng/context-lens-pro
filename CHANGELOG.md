# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-29

### 🎉 Release Initiale

Première version production-ready de la plateforme ContextLens.

### ✨ Ajouté

#### Landing Page
- Hero section avec compteur de visiteurs en temps réel (Supabase Presence)
- Statistiques animées avec scroll trigger
- Démo interactive HUD en 5 étapes
- Section partenaires avec logos carousel
- Témoignages clients
- FAQ accordion
- Formulaire waitlist avec validation
- Transitions de page fluides (Framer Motion)

#### Authentification
- Inscription email/mot de passe
- Indicateur de force du mot de passe (4 critères)
- Connexion avec session persistante
- Déconnexion globale
- Protection des routes
- Auto-confirm email configuré

#### Dashboard
- Gestion complète des scripts (CRUD)
- Éditeur de scripts avec preview HUD
- Tracking des appareils en temps réel (Supabase Realtime)
- Graphiques d'analytics avec filtres de dates
- Export scripts (JSON, Markdown, TXT)
- Import de fichiers scripts
- Recherche avec highlighting
- Pagination efficace
- Raccourcis clavier (Cmd+K)
- Onboarding flow 4 étapes

#### Clinical AR (EmotionsCare)
- Modèle 3D du cerveau (Three.js + WebXR)
- Overlay des émotions (anxiété, joie, tristesse, colère, dégoût)
- HUD médical complet:
  - Carte patient
  - Jauge d'émotions
  - Panel des signes vitaux
  - Badges d'alerte
- Commandes vocales bilingues (FR/EN)
- Notes cliniques persistantes

#### Vision IRM (Anatomie AR)
- Visualisation IRM corps entier
- Body tracking (MediaPipe ready)
- Détection de zone de regard
- Filtrage par système organique
- Chargement multi-LOD des meshes
- Vues en coupe (axial, sagittal, coronal)
- Mode comparaison

#### LUNETTES IRM (Plateforme Médicale)
- Gestion des cabinets médicaux
  - Validation SIRET
  - Multi-localisation
- Interface appareils IRM
  - Architecture driver universelle
  - Mock Driver (démo)
  - Chipiron Driver (SQUID ULF-MRI)
  - Kyoto OPM Driver
- 8 protocoles de screening prédéfinis
- Plans d'abonnement (Starter/Pro/Clinic)
- Simulation de scan en temps réel
- Génération de rapports (Edge Function)

#### Documentation
- Guides SDK par tier (0-3)
- Référence API REST searchable
- Exemples de code (Flutter, Android, iOS)
- Table des matières sticky
- Navigation breadcrumb
- Section troubleshooting

#### Paramètres
- Gestion du profil (avatar upload)
- Changement de mot de passe
- Gestion des sessions
- API Key management
- Préférences de notifications
- Panel conformité GDPR
- Suppression de compte

#### Internationalisation
- Support complet FR/EN
- Sélecteur de langue
- Composants UI traduits

#### Design System
- Theme toggle (Dark/Light)
- Effets glassmorphism
- Animations premium (Framer Motion)
- Responsive mobile-first
- Accessibilité WCAG 2.1 AA

### 🔒 Sécurité
- Row Level Security (RLS) sur toutes les tables
- Vues sécurisées pour masquage PHI
- Prévention XSS (sanitization)
- Validation Zod sur tous les formulaires
- Rate limiting sur waitlist et contact
- Protection des variables d'environnement

### 🧪 Tests
- 122 tests passants
- Suite smoke tests (8)
- Suite E2E (33)
- Suite intégration (23)
- Suite sécurité (21)
- Suite accessibilité (25)
- Suite navigation (11)

### 📚 Documentation
- README.md complet
- OpenAPI/Swagger spec (docs/openapi.yaml)
- Ce CHANGELOG

---

## [0.9.0] - 2026-01-28

### ✨ Ajouté
- Module LUNETTES IRM complet
- Drivers MRI (Mock, Chipiron, Kyoto OPM)
- Protocoles de screening
- Système d'abonnements médicaux

### 🔧 Modifié
- Refactoring architecture hooks AR
- Optimisation anti-boucles infinies

---

## [0.8.0] - 2026-01-27

### ✨ Ajouté
- Module Vision IRM (Anatomie AR)
- Body tracking hooks
- Gaze zone detection
- Organ loader avec LOD

### 🔧 Modifié
- Migration vers Zustand stores dédiés
- Séparation émotions/anatomie

---

## [0.7.0] - 2026-01-26

### ✨ Ajouté
- Module Clinical AR (EmotionsCare)
- Modèle 3D cerveau
- Emotion overlay
- HUD médical complet
- Commandes vocales

### 🐛 Corrigé
- Boucles infinies dans useARStore
- Memory leaks WebGL

---

## [0.6.0] - 2026-01-25

### ✨ Ajouté
- Documentation portal complète
- SDK guides par tier
- API reference searchable
- Troubleshooting section

### 🔧 Modifié
- Navigation breadcrumbs
- Table of contents sticky

---

## [0.5.0] - 2026-01-24

### ✨ Ajouté
- Settings page complète
- Gestion profil utilisateur
- Changement mot de passe
- Session management
- GDPR compliance panel
- Account deletion

---

## [0.4.0] - 2026-01-23

### ✨ Ajouté
- Dashboard analytics
- Date range filtering
- Recharts graphiques
- Export scripts (JSON/MD/TXT)
- Import scripts
- Quick actions (Cmd+K)

### 🔧 Modifié
- Pagination optimisée
- Search highlighting

---

## [0.3.0] - 2026-01-22

### ✨ Ajouté
- Script management CRUD
- Device pairing flow
- Realtime device sync
- Onboarding flow

### 🔒 Sécurité
- RLS policies scripts
- RLS policies devices

---

## [0.2.0] - 2026-01-21

### ✨ Ajouté
- Authentification email/password
- Password strength meter
- Protected routes
- Profile auto-creation trigger

### 🔒 Sécurité
- RLS policies profiles
- Session management

---

## [0.1.0] - 2026-01-20

### ✨ Ajouté
- Landing page initiale
- Hero section
- Features section
- Pricing section
- FAQ section
- Waitlist form
- Contact page
- Privacy & Terms pages

### 🔧 Infrastructure
- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase integration
- Framer Motion

---

## Types de changements

- ✨ **Ajouté** - Nouvelles fonctionnalités
- 🔧 **Modifié** - Changements de fonctionnalités existantes
- 🗑️ **Déprécié** - Fonctionnalités qui seront supprimées
- 🚫 **Supprimé** - Fonctionnalités supprimées
- 🐛 **Corrigé** - Corrections de bugs
- 🔒 **Sécurité** - Corrections de vulnérabilités

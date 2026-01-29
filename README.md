# ContextLens 🥽

<div align="center">

![ContextLens Banner](https://img.shields.io/badge/ContextLens-Smart_Glasses_Platform-6366f1?style=for-the-badge&logo=glasses&logoColor=white)

**Transform smart glasses into intelligent contextual prompters**

[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06b6d4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com)
[![Tests](https://img.shields.io/badge/Tests-122%2F122-22c55e?style=flat-square&logo=vitest)](https://vitest.dev)

[Demo](https://id-preview--7aa6e6bc-4a69-4870-9f01-24a1d73d6036.lovable.app) • [Documentation](#-documentation) • [Features](#-features) • [Getting Started](#-getting-started)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Modules](#-modules)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

ContextLens is a comprehensive SaaS platform that transforms smart glasses into intelligent contextual prompters. Using a layered adapter architecture, the system supports varying hardware capabilities through a tiered approach:

| Tier | Name | Capabilities |
|------|------|--------------|
| **Tier 0** | Universal | Phone-only (camera streaming) |
| **Tier 1** | Display | HUD via official SDK |
| **Tier 2** | Enhanced | On-device app / Dev Mode |
| **Tier 3** | Full AR | Vision + AR Anchoring |

### Universal Pipeline

```
📱 Capture → 👁️ Perception → 🔀 Routing → 📚 Retrieval → ✍️ Composer → 🖥️ Renderer
```

1. **Capture**: Phone or glasses camera input
2. **Perception**: OCR and scene classification
3. **Routing**: Context matching
4. **Retrieval**: RAG for script selection
5. **Composer**: HUD formatting
6. **Renderer**: Device delivery

---

## ✨ Features

### 🏠 Landing Page
- Real-time visitor counter (Supabase Presence)
- Animated statistics with scroll triggers
- Interactive 5-step HUD demo tour
- Partner logos carousel
- Testimonials section
- FAQ accordion
- Waitlist form with validation

### 🔐 Authentication
- Email/password signup & login
- Password strength indicator (4 criteria)
- Auto-confirm email configuration
- Session management
- Protected routes
- Remember me functionality

### 📊 Dashboard
- **Script Management**: Create, edit, delete, duplicate scripts
- **Device Tracking**: Real-time Supabase Realtime sync
- **Analytics**: Date range filtering, charts (Recharts)
- **Quick Actions**: Cmd+K shortcuts
- **Export**: JSON, Markdown, TXT formats
- **Import**: Script file import
- **Search**: Highlighted results
- **Pagination**: Efficient data loading
- **Onboarding Flow**: 4-step guided tour

### 🧠 Clinical AR Module
- Three.js + WebXR 3D rendering
- Brain model visualization
- Emotion overlay (anxiety, joy, sadness, anger, disgust)
- Medical HUD components:
  - Patient Card
  - Emotion Gauge
  - Vitals Panel
  - Alert Badges
- Bilingual voice commands (FR/EN)
- Persistent clinical notes

### 🫁 Vision IRM (Anatomy AR)
- Whole-body MRI visualization
- Body tracking (MediaPipe ready)
- Gaze zone detection
- Organ system filtering
- Multi-LOD mesh loading
- Slice views (axial, sagittal, coronal)
- Comparison mode

### 🏥 LUNETTES IRM Platform
- **Cabinet Management**: SIRET validation, multi-location
- **MRI Device Interface**: Universal driver architecture
  - Mock Driver (demo)
  - Chipiron Driver (SQUID ULF-MRI)
  - Kyoto OPM Driver
- **Screening Protocols**: 8 predefined protocols
- **Subscription Plans**: Starter / Pro / Clinic
- **Real-time Scan Simulation**: Frame streaming
- **Report Generation**: Edge function integration

### 📚 Documentation Portal
- SDK integration guides (Tier 0-3)
- REST API reference
- Code examples (Flutter, Android, iOS)
- Searchable with highlighting
- Table of Contents navigation
- Troubleshooting section

### ⚙️ Settings
- Profile management (avatar upload)
- Password change
- Session management
- API key management
- Notification preferences
- GDPR compliance panel
- Account deletion

### 🌐 Internationalization
- Full FR/EN support
- Language switcher
- Translated UI components

### 🎨 Design System
- Dark/Light theme toggle
- Glassmorphism effects
- Premium animations (Framer Motion)
- Responsive (mobile-first)
- WCAG 2.1 AA accessible

---

## 🏗️ Architecture

### Frontend Architecture

```
src/
├── components/          # UI Components
│   ├── ar/             # AR/3D components
│   ├── auth/           # Authentication
│   ├── cabinet/        # MRI cabinet management
│   ├── dashboard/      # Dashboard widgets
│   ├── docs/           # Documentation
│   ├── layout/         # Layout components
│   ├── onboarding/     # Onboarding flow
│   ├── sections/       # Landing page sections
│   ├── settings/       # Settings panels
│   └── ui/             # shadcn/ui components
├── drivers/            # MRI device drivers
├── hooks/              # Custom React hooks
├── i18n/               # Internationalization
├── integrations/       # External integrations
├── lib/                # Utilities
├── pages/              # Route pages
├── services/           # API services
├── stores/             # Zustand stores
└── test/               # Test suites
```

### State Management

| Store | Purpose |
|-------|---------|
| `useARStore` | AR session, brain focus, HUD state |
| `useAnatomyStore` | Body tracking, organ loading |
| `useEmotionsCareStore` | Patient emotions, vitals |

### Backend (Lovable Cloud / Supabase)

#### Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles, notification prefs |
| `scripts` | User scripts with tags |
| `connected_devices` | Paired smart glasses |
| `usage_analytics` | Session tracking |
| `waitlist` | Early access signups |
| `cabinets` | Medical cabinets |
| `mri_devices` | MRI hardware |
| `mri_scans` | Scan records |
| `mri_subscriptions` | SaaS subscriptions |
| `screening_protocols` | Protocol definitions |
| `contact_messages` | Contact form submissions |

#### Edge Functions

| Function | Purpose |
|----------|---------|
| `generate-report` | PDF report generation |
| `check-subscription` | Subscription validation |
| `create-checkout` | Stripe checkout session |
| `customer-portal` | Stripe portal access |

#### Security

- Row Level Security (RLS) on all tables
- Secure views for PHI data masking
- Database functions with SECURITY DEFINER

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3 | UI framework |
| TypeScript | 5.0 | Type safety |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.4 | Styling |
| shadcn/ui | Latest | UI components |
| Framer Motion | 11.x | Animations |
| Three.js | 0.158 | 3D rendering |
| @react-three/fiber | 8.18 | React Three.js |
| @react-three/xr | 6.6 | WebXR support |
| Zustand | 4.5 | State management |
| TanStack Query | 5.x | Data fetching |
| React Router | 6.x | Routing |
| React Hook Form | 7.x | Form handling |
| Zod | 3.x | Validation |
| Recharts | 2.x | Charts |
| Lucide React | 0.462 | Icons |

### Backend

| Technology | Purpose |
|------------|---------|
| Supabase | Database, Auth, Realtime |
| PostgreSQL | Database |
| Edge Functions | Serverless logic |
| Supabase Storage | File storage |

### Testing

| Technology | Purpose |
|------------|---------|
| Vitest | Test runner |
| @testing-library/react | Component testing |
| jsdom | DOM simulation |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommend using [nvm](https://github.com/nvm-sh/nvm))
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/contextlens.git
cd contextlens

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

The project uses Lovable Cloud, which automatically provides:

```env
VITE_SUPABASE_URL=<auto-configured>
VITE_SUPABASE_PUBLISHABLE_KEY=<auto-configured>
VITE_SUPABASE_PROJECT_ID=<auto-configured>
```

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
npm run test         # Run tests
```

---

## 📁 Project Structure

```
contextlens/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── ar/            # AR components
│   │   │   ├── anatomy/   # Vision IRM
│   │   │   ├── brain/     # Brain model
│   │   │   └── hud/       # HUD panels
│   │   ├── auth/          # Auth components
│   │   ├── cabinet/       # MRI cabinet
│   │   ├── dashboard/     # Dashboard widgets
│   │   ├── docs/          # Documentation
│   │   ├── layout/        # Layout (Header, Footer)
│   │   ├── onboarding/    # Onboarding
│   │   ├── sections/      # Landing sections
│   │   ├── settings/      # Settings tabs
│   │   └── ui/            # Base UI (shadcn)
│   ├── drivers/           # MRI drivers
│   │   ├── chipiron/      # Chipiron SQUID
│   │   ├── kyoto-opm/     # Kyoto OPM
│   │   ├── mock/          # Demo driver
│   │   └── types/         # Driver interfaces
│   ├── hooks/
│   │   ├── anatomy/       # Anatomy hooks
│   │   ├── emotionscare/  # Clinical hooks
│   │   └── mri/           # MRI hooks
│   ├── i18n/              # Translations
│   ├── integrations/
│   │   ├── lovable/       # Lovable AI
│   │   └── supabase/      # Supabase client
│   ├── lib/               # Utilities
│   ├── pages/             # Route pages
│   ├── services/
│   │   └── emotionscare/  # EmotionsCare API
│   ├── stores/            # Zustand stores
│   └── test/              # Test suites
├── supabase/
│   ├── config.toml        # Supabase config
│   └── functions/         # Edge functions
├── index.html
├── tailwind.config.ts
├── vite.config.ts
├── vitest.config.ts
└── tsconfig.json
```

---

## 📖 API Reference

### Scripts API

```typescript
// Create script
POST /rest/v1/scripts
{ title: string, content: string, tags?: string[] }

// Get user scripts
GET /rest/v1/scripts?user_id=eq.{userId}&order=created_at.desc

// Update script
PATCH /rest/v1/scripts?id=eq.{scriptId}
{ title?: string, content?: string }

// Delete script
DELETE /rest/v1/scripts?id=eq.{scriptId}
```

### Devices API

```typescript
// Add device
POST /rest/v1/connected_devices
{ device_name: string, device_type: string, tier: number }

// Get devices
GET /rest/v1/connected_devices?user_id=eq.{userId}

// Update device status
PATCH /rest/v1/connected_devices?id=eq.{deviceId}
{ is_connected: boolean }
```

### Waitlist API

```typescript
// Join waitlist
POST /rest/v1/waitlist
{ email: string, source: string }
```

### MRI Cabinets API

```typescript
// Create cabinet
POST /rest/v1/cabinets
{ name: string, siret: string, owner_id: string }

// Get user cabinets
GET /rest/v1/cabinets?owner_id=eq.{userId}
```

---

## 🧪 Testing

### Test Suites

| Suite | Tests | Coverage |
|-------|-------|----------|
| Smoke | 8 | Core navigation, auth |
| E2E | 33 | Full user workflows |
| Integration | 23 | Service validation |
| Security | 21 | XSS, env protection |
| Accessibility | 25 | WCAG 2.1 AA |
| Navigation | 11 | Route testing |
| Example | 1 | Setup verification |
| **Total** | **122** | **100% passing** |

### Running Tests

```bash
# Run all tests
npm run test

# Run specific suite
npm run test -- src/test/security.test.ts

# Watch mode
npm run test -- --watch
```

### Test Examples

```typescript
// Security test
describe("Security: XSS Prevention", () => {
  it("should sanitize script tags", () => {
    const input = "<script>alert('xss')</script>";
    const sanitized = sanitizeInput(input);
    expect(sanitized).not.toContain("<script>");
  });
});

// E2E test
describe("E2E: Authentication", () => {
  it("should complete signup flow", async () => {
    // ... test implementation
  });
});
```

---

## 🚢 Deployment

### Lovable Deployment

1. Open [Lovable](https://lovable.dev)
2. Navigate to your project
3. Click **Share → Publish**
4. Click **Update** to deploy frontend changes

> **Note**: Backend changes (Edge Functions, migrations) deploy automatically.

### Custom Domain

1. Go to **Project → Settings → Domains**
2. Click **Connect Domain**
3. Add DNS records as instructed
4. Wait for SSL certificate provisioning

---

## 🔒 Security

### Authentication

- Supabase Auth with email/password
- Password strength validation
- Session management
- Protected route middleware

### Database Security

- Row Level Security (RLS) enabled on all tables
- Policies for user data isolation
- Secure views for sensitive data (PHI masking)
- SECURITY DEFINER functions for controlled access

### Frontend Security

- XSS prevention (input sanitization)
- Environment variable protection
- No sensitive data in client bundle
- CSP headers configured

### Compliance

- GDPR data export/deletion
- Privacy policy page
- Cookie consent banner
- Terms of service

---

## 🌍 Internationalization

### Supported Languages

- 🇫🇷 French (fr)
- 🇬🇧 English (en)

### Adding Translations

```typescript
// src/i18n/translations.ts
export const translations = {
  en: {
    hero: {
      title: "Scripts for Your",
      titleHighlight: "Smart Glasses"
    }
  },
  fr: {
    hero: {
      title: "Scripts pour vos",
      titleHighlight: "Lunettes Connectées"
    }
  }
};
```

### Using Translations

```tsx
import { useLanguage } from "@/i18n/LanguageContext";

function Component() {
  const { t, language, setLanguage } = useLanguage();
  return <h1>{t.hero.title}</h1>;
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

### Code Style

- ESLint configuration enforced
- Prettier for formatting
- TypeScript strict mode
- Component-first architecture

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📞 Support

- **Documentation**: [docs.lovable.dev](https://docs.lovable.dev)
- **Discord**: [Lovable Community](https://discord.com/channels/1119885301872070706)
- **Contact**: Via the [Contact Page](/contact)

---

<div align="center">

**Built with ❤️ using [Lovable](https://lovable.dev)**

</div>

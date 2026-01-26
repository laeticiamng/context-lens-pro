export type Language = "en" | "fr";

// Type for translation structure (use string to avoid literal type issues)
interface NavTranslations {
  features: string;
  pricing: string;
  docs: string;
  dashboard: string;
  signIn: string;
  getStarted: string;
}

interface HeroTranslations {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  cta: string;
  secondaryCta: string;
  watchDemo: string;
}

interface StatsTranslations {
  activeUsers: string;
  deviceModels: string;
  promptsDelivered: string;
  uptimeSla: string;
}

interface PartnersTranslations {
  compatible: string;
}

interface CapabilitiesTranslations {
  title: string;
  titleHighlight: string;
  description: string;
  tier0: string;
  tier0Desc: string;
  tier1: string;
  tier1Desc: string;
  tier2: string;
  tier2Desc: string;
  tier3: string;
  tier3Desc: string;
}

interface DevicesTranslations {
  title: string;
  titleHighlight: string;
  description: string;
}

interface PipelineTranslations {
  title: string;
  titleHighlight: string;
  description: string;
}

interface DemoTranslations {
  title: string;
  titleHighlight: string;
  description: string;
}

interface TestimonialsTranslations {
  title: string;
  titleHighlight: string;
}

interface PricingTranslations {
  title: string;
  titleHighlight: string;
  description: string;
  free: string;
  pro: string;
  enterprise: string;
  perMonth: string;
  getStarted: string;
  contactSales: string;
  currentPlan: string;
  popular: string;
}

interface FaqTranslations {
  title: string;
  titleHighlight: string;
}

interface CtaTranslations {
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
}

interface WaitlistTranslations {
  placeholder: string;
  button: string;
  success: string;
  successDesc: string;
  freeAccess: string;
  noCard: string;
  onWaitlist: string;
}

interface FooterTranslations {
  product: string;
  resources: string;
  company: string;
  legal: string;
  copyright: string;
}

interface AuthTranslations {
  welcomeBack: string;
  createAccount: string;
  signInDesc: string;
  signUpDesc: string;
  email: string;
  password: string;
  forgotPassword: string;
  rememberMe: string;
  signIn: string;
  signUp: string;
  noAccount: string;
  haveAccount: string;
  backToHome: string;
}

interface DashboardTranslations {
  title: string;
  totalScripts: string;
  activeScripts: string;
  connectedDevices: string;
  totalUsage: string;
  scripts: string;
  devices: string;
  analytics: string;
  newScript: string;
  searchScripts: string;
  noScripts: string;
  noDevices: string;
  addDevice: string;
}

interface SettingsTranslations {
  title: string;
  description: string;
  profile: string;
  security: string;
  notifications: string;
  api: string;
  billing: string;
  save: string;
  saving: string;
}

interface CommonTranslations {
  loading: string;
  error: string;
  success: string;
  cancel: string;
  confirm: string;
  delete: string;
  edit: string;
  save: string;
  close: string;
  back: string;
  next: string;
  previous: string;
  search: string;
  filter: string;
  export: string;
  import: string;
}

export interface TranslationKeys {
  nav: NavTranslations;
  hero: HeroTranslations;
  stats: StatsTranslations;
  partners: PartnersTranslations;
  capabilities: CapabilitiesTranslations;
  devices: DevicesTranslations;
  pipeline: PipelineTranslations;
  demo: DemoTranslations;
  testimonials: TestimonialsTranslations;
  pricing: PricingTranslations;
  faq: FaqTranslations;
  cta: CtaTranslations;
  waitlist: WaitlistTranslations;
  footer: FooterTranslations;
  auth: AuthTranslations;
  dashboard: DashboardTranslations;
  settings: SettingsTranslations;
  common: CommonTranslations;
}

export const translations = {
  en: {
    // Navigation
    nav: {
      features: "Features",
      pricing: "Pricing",
      docs: "Docs",
      dashboard: "Dashboard",
      signIn: "Sign In",
      getStarted: "Get Started",
    },
    // Hero Section
    hero: {
      badge: "Now in Beta — Join 5,000+ on the Waitlist",
      title: "Contextual Prompter for",
      titleHighlight: "Smart Glasses",
      description: "Turn any smart glasses into an AI-powered teleprompter. ContextLens displays relevant information based on what you see, hear, and do — in real-time.",
      cta: "Join Waitlist",
      secondaryCta: "View Demo",
      watchDemo: "Watch Demo",
    },
    // Stats
    stats: {
      activeUsers: "Active Users",
      deviceModels: "Device Models",
      promptsDelivered: "Prompts Delivered",
      uptimeSla: "Uptime SLA",
    },
    // Partners
    partners: {
      compatible: "Compatible with leading smart glasses manufacturers",
    },
    // Capabilities
    capabilities: {
      title: "One Platform,",
      titleHighlight: "Every Device",
      description: "From basic phone fallback to full AR spatial computing — ContextLens adapts to your device's capabilities.",
      tier0: "Universal Fallback",
      tier0Desc: "Works with ANY device",
      tier1: "Display via SDK",
      tier1Desc: "Native HUD integration",
      tier2: "On-Device Mode",
      tier2Desc: "Native camera & sensors",
      tier3: "Vision + AR",
      tier3Desc: "Spatial computing",
    },
    // Devices
    devices: {
      title: "Works With Your",
      titleHighlight: "Favorite Glasses",
      description: "Native integrations with leading smart glasses manufacturers. One app, universal compatibility.",
    },
    // Pipeline
    pipeline: {
      title: "The Universal",
      titleHighlight: "Pipeline",
      description: "Six stages that transform raw context into perfectly-timed prompts on any device.",
    },
    // Demo
    demo: {
      title: "See It In",
      titleHighlight: "Action",
      description: "Watch how ContextLens delivers real-time contextual prompts across different devices and scenarios.",
    },
    // Testimonials
    testimonials: {
      title: "Trusted by",
      titleHighlight: "Innovators",
    },
    // Pricing
    pricing: {
      title: "Simple,",
      titleHighlight: "Transparent Pricing",
      description: "Start free, scale as you grow. No hidden fees.",
      free: "Free",
      pro: "Pro",
      enterprise: "Enterprise",
      perMonth: "/month",
      getStarted: "Get Started",
      contactSales: "Contact Sales",
      currentPlan: "Current Plan",
      popular: "Popular",
    },
    // FAQ
    faq: {
      title: "Frequently Asked",
      titleHighlight: "Questions",
    },
    // CTA
    cta: {
      badge: "Early Access Now Open",
      title: "Ready to transform your",
      titleHighlight: "smart glasses",
      description: "Join the waitlist for early access. Be among the first to experience contextual prompter technology.",
    },
    // Waitlist
    waitlist: {
      placeholder: "Enter your email",
      button: "Join Waitlist",
      success: "You're on the list!",
      successDesc: "We'll notify you when early access opens.",
      freeAccess: "Free Early Access",
      noCard: "No credit card required",
      onWaitlist: "on waitlist",
    },
    // Footer
    footer: {
      product: "Product",
      resources: "Resources",
      company: "Company",
      legal: "Legal",
      copyright: "All rights reserved.",
    },
    // Auth
    auth: {
      welcomeBack: "Welcome back",
      createAccount: "Create account",
      signInDesc: "Sign in to access your dashboard",
      signUpDesc: "Get started with ContextLens",
      email: "Email",
      password: "Password",
      forgotPassword: "Forgot password?",
      rememberMe: "Remember me for 30 days",
      signIn: "Sign In",
      signUp: "Create Account",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      backToHome: "Back to Home",
    },
    // Dashboard
    dashboard: {
      title: "Dashboard",
      totalScripts: "Total Scripts",
      activeScripts: "Active Scripts",
      connectedDevices: "Connected Devices",
      totalUsage: "Total Usage",
      scripts: "Scripts",
      devices: "Devices",
      analytics: "Analytics",
      newScript: "New Script",
      searchScripts: "Search scripts...",
      noScripts: "No scripts yet",
      noDevices: "No devices connected",
      addDevice: "Add Device",
    },
    // Settings
    settings: {
      title: "Settings",
      description: "Manage your account, privacy, and preferences",
      profile: "Profile",
      security: "Security",
      notifications: "Alerts",
      api: "API",
      billing: "Billing",
      save: "Save Changes",
      saving: "Saving...",
    },
    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      confirm: "Confirm",
      delete: "Delete",
      edit: "Edit",
      save: "Save",
      close: "Close",
      back: "Back",
      next: "Next",
      previous: "Previous",
      search: "Search",
      filter: "Filter",
      export: "Export",
      import: "Import",
    },
  },
  fr: {
    // Navigation
    nav: {
      features: "Fonctionnalités",
      pricing: "Tarifs",
      docs: "Documentation",
      dashboard: "Tableau de bord",
      signIn: "Connexion",
      getStarted: "Commencer",
    },
    // Hero Section
    hero: {
      badge: "En bêta — Rejoignez +5 000 personnes sur la liste d'attente",
      title: "Prompteur contextuel pour",
      titleHighlight: "Lunettes Connectées",
      description: "Transformez n'importe quelles lunettes connectées en téléprompteur intelligent. ContextLens affiche les informations pertinentes en fonction de ce que vous voyez, entendez et faites — en temps réel.",
      cta: "Rejoindre la liste",
      secondaryCta: "Voir la démo",
      watchDemo: "Voir la démo",
    },
    // Stats
    stats: {
      activeUsers: "Utilisateurs actifs",
      deviceModels: "Modèles d'appareils",
      promptsDelivered: "Prompts délivrés",
      uptimeSla: "Disponibilité SLA",
    },
    // Partners
    partners: {
      compatible: "Compatible avec les principaux fabricants de lunettes connectées",
    },
    // Capabilities
    capabilities: {
      title: "Une plateforme,",
      titleHighlight: "Tous les appareils",
      description: "Du mode téléphone de secours au calcul spatial AR complet — ContextLens s'adapte aux capacités de votre appareil.",
      tier0: "Mode universel",
      tier0Desc: "Fonctionne avec TOUS les appareils",
      tier1: "Affichage via SDK",
      tier1Desc: "Intégration HUD native",
      tier2: "Mode embarqué",
      tier2Desc: "Caméra et capteurs natifs",
      tier3: "Vision + AR",
      tier3Desc: "Calcul spatial",
    },
    // Devices
    devices: {
      title: "Fonctionne avec vos",
      titleHighlight: "Lunettes préférées",
      description: "Intégrations natives avec les principaux fabricants de lunettes connectées. Une seule app, compatibilité universelle.",
    },
    // Pipeline
    pipeline: {
      title: "Le Pipeline",
      titleHighlight: "Universel",
      description: "Six étapes qui transforment le contexte brut en prompts parfaitement synchronisés sur n'importe quel appareil.",
    },
    // Demo
    demo: {
      title: "Voyez-le en",
      titleHighlight: "Action",
      description: "Découvrez comment ContextLens délivre des prompts contextuels en temps réel sur différents appareils et scénarios.",
    },
    // Testimonials
    testimonials: {
      title: "Approuvé par les",
      titleHighlight: "Innovateurs",
    },
    // Pricing
    pricing: {
      title: "Tarification",
      titleHighlight: "Simple et transparente",
      description: "Commencez gratuitement, évoluez selon vos besoins. Sans frais cachés.",
      free: "Gratuit",
      pro: "Pro",
      enterprise: "Entreprise",
      perMonth: "/mois",
      getStarted: "Commencer",
      contactSales: "Contacter les ventes",
      currentPlan: "Plan actuel",
      popular: "Populaire",
    },
    // FAQ
    faq: {
      title: "Questions",
      titleHighlight: "Fréquentes",
    },
    // CTA
    cta: {
      badge: "Accès anticipé maintenant ouvert",
      title: "Prêt à transformer vos",
      titleHighlight: "lunettes connectées",
      description: "Rejoignez la liste d'attente pour un accès anticipé. Soyez parmi les premiers à découvrir la technologie du prompteur contextuel.",
    },
    // Waitlist
    waitlist: {
      placeholder: "Entrez votre email",
      button: "Rejoindre la liste",
      success: "Vous êtes inscrit !",
      successDesc: "Nous vous préviendrons dès l'ouverture de l'accès anticipé.",
      freeAccess: "Accès anticipé gratuit",
      noCard: "Sans carte bancaire",
      onWaitlist: "sur la liste d'attente",
    },
    // Footer
    footer: {
      product: "Produit",
      resources: "Ressources",
      company: "Entreprise",
      legal: "Légal",
      copyright: "Tous droits réservés.",
    },
    // Auth
    auth: {
      welcomeBack: "Content de vous revoir",
      createAccount: "Créer un compte",
      signInDesc: "Connectez-vous pour accéder à votre tableau de bord",
      signUpDesc: "Commencez avec ContextLens",
      email: "Email",
      password: "Mot de passe",
      forgotPassword: "Mot de passe oublié ?",
      rememberMe: "Se souvenir de moi pendant 30 jours",
      signIn: "Se connecter",
      signUp: "Créer un compte",
      noAccount: "Pas encore de compte ?",
      haveAccount: "Déjà un compte ?",
      backToHome: "Retour à l'accueil",
    },
    // Dashboard
    dashboard: {
      title: "Tableau de bord",
      totalScripts: "Total Scripts",
      activeScripts: "Scripts actifs",
      connectedDevices: "Appareils connectés",
      totalUsage: "Utilisation totale",
      scripts: "Scripts",
      devices: "Appareils",
      analytics: "Analytique",
      newScript: "Nouveau Script",
      searchScripts: "Rechercher des scripts...",
      noScripts: "Aucun script",
      noDevices: "Aucun appareil connecté",
      addDevice: "Ajouter un appareil",
    },
    // Settings
    settings: {
      title: "Paramètres",
      description: "Gérez votre compte, confidentialité et préférences",
      profile: "Profil",
      security: "Sécurité",
      notifications: "Alertes",
      api: "API",
      billing: "Facturation",
      save: "Enregistrer",
      saving: "Enregistrement...",
    },
    // Common
    common: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      cancel: "Annuler",
      confirm: "Confirmer",
      delete: "Supprimer",
      edit: "Modifier",
      save: "Enregistrer",
      close: "Fermer",
      back: "Retour",
      next: "Suivant",
      previous: "Précédent",
      search: "Rechercher",
      filter: "Filtrer",
      export: "Exporter",
      import: "Importer",
    },
  },
} as const;

export const getTranslations = (lang: Language): TranslationKeys => translations[lang];

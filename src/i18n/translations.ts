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

interface MarketplaceTranslations {
  title: string;
  comingSoon: string;
  description: string;
  free: string;
  creatorProgram: string;
  creatorProgramDesc: string;
}

interface UxControlsTranslations {
  title: string;
  description: string;
  action: string;
  next: string;
  nextDesc: string;
  prev: string;
  prevDesc: string;
  pin: string;
  pinDesc: string;
  unpin: string;
  unpinDesc: string;
  speedUp: string;
  speedUpDesc: string;
  speedDown: string;
  speedDownDesc: string;
  mode: string;
  modeDesc: string;
  silentNote: string;
}

interface ScriptImportTranslations {
  title: string;
  description: string;
  jsonData: string;
  markdownContent: string;
  uploadFile: string;
  importJson: string;
  importMarkdown: string;
  importing: string;
  success: string;
  successDesc: string;
}

interface ApiKeyTranslations {
  title: string;
  description: string;
  yourApiKey: string;
  keepSecret: string;
  quickStart: string;
  regenerateKey: string;
  regenerateTitle: string;
  regenerateDesc: string;
  regenerating: string;
  regenerated: string;
  regeneratedDesc: string;
  securityNotice: string;
  securityNoticeDesc: string;
  copied: string;
  copiedDesc: string;
}

interface SessionTranslations {
  title: string;
  description: string;
  current: string;
  signOutOthers: string;
  revoked: string;
  revokedDesc: string;
  allRevoked: string;
  allRevokedDesc: string;
  securityTip: string;
}

interface PasswordTranslations {
  changeTitle: string;
  changeDesc: string;
  newPassword: string;
  confirmPassword: string;
  passwordsDoNotMatch: string;
  updatePassword: string;
  confirmTitle: string;
  confirmDesc: string;
  updating: string;
  yesChange: string;
  updated: string;
  updatedDesc: string;
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
  marketplace: MarketplaceTranslations;
  uxControls: UxControlsTranslations;
  scriptImport: ScriptImportTranslations;
  apiKey: ApiKeyTranslations;
  session: SessionTranslations;
  password: PasswordTranslations;
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
    // Marketplace
    marketplace: {
      title: "Script Marketplace",
      comingSoon: "Coming Soon",
      description: "Discover and share professional script packs",
      free: "Free",
      creatorProgram: "Creator Program",
      creatorProgramDesc: "Publish your scripts and earn 70% of each sale.",
    },
    // UX Controls
    uxControls: {
      title: "UX Controls Mapping",
      description: "Universal actions mapped to each device's input methods",
      action: "Action",
      next: "NEXT",
      nextDesc: "Next block/page",
      prev: "PREV",
      prevDesc: "Previous block/page",
      pin: "PIN",
      pinDesc: "Keep on screen",
      unpin: "UNPIN",
      unpinDesc: "Release pinned",
      speedUp: "SPEED+",
      speedUpDesc: "Faster scroll",
      speedDown: "SPEED-",
      speedDownDesc: "Slower scroll",
      mode: "MODE",
      modeDesc: "Toggle cards ⇄ continuous",
      silentNote: "All controls work silently without voice commands. Perfect for meetings, presentations, and healthcare.",
    },
    // Script Import
    scriptImport: {
      title: "Import Scripts",
      description: "Import scripts from JSON or Markdown files",
      jsonData: "JSON Data",
      markdownContent: "Markdown Content",
      uploadFile: "Upload File",
      importJson: "Import JSON",
      importMarkdown: "Import Markdown",
      importing: "Importing...",
      success: "Import successful",
      successDesc: "Imported {count} script(s)",
    },
    // API Key
    apiKey: {
      title: "API Access",
      description: "Manage your API keys for SDK integration",
      yourApiKey: "Your API Key",
      keepSecret: "Keep this key secret. Use it in your SDK integration.",
      quickStart: "Quick Start",
      regenerateKey: "Regenerate Key",
      regenerateTitle: "Regenerate API Key?",
      regenerateDesc: "This will immediately invalidate your current API key. All applications using the old key will stop working until you update them with the new key.",
      regenerating: "Regenerating...",
      regenerated: "API Key Regenerated",
      regeneratedDesc: "Your old key will stop working immediately. Update your integrations.",
      securityNotice: "Security Notice",
      securityNoticeDesc: "Never expose your API key in client-side code or public repositories. Use environment variables and server-side calls for production apps.",
      copied: "Copied",
      copiedDesc: "API key copied to clipboard",
    },
    // Session Management
    session: {
      title: "Active Sessions",
      description: "Manage devices where you're signed in",
      current: "Current",
      signOutOthers: "Sign Out Others",
      revoked: "Session Revoked",
      revokedDesc: "The device has been signed out.",
      allRevoked: "All Other Sessions Revoked",
      allRevokedDesc: "All other devices have been signed out.",
      securityTip: "If you don't recognize a session, revoke it immediately and change your password to secure your account.",
    },
    // Password
    password: {
      changeTitle: "Change Password",
      changeDesc: "Enter a new password for your account",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      passwordsDoNotMatch: "Passwords do not match",
      updatePassword: "Update Password",
      confirmTitle: "Confirm Password Change",
      confirmDesc: "Are you sure you want to change your password? You'll need to use the new password for all future logins.",
      updating: "Updating...",
      yesChange: "Yes, Change Password",
      updated: "Password Updated",
      updatedDesc: "Your password has been changed successfully.",
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
    // Marketplace
    marketplace: {
      title: "Marketplace de Scripts",
      comingSoon: "Bientôt disponible",
      description: "Découvrez et partagez des packs de scripts professionnels",
      free: "Gratuit",
      creatorProgram: "Programme Créateur",
      creatorProgramDesc: "Publiez vos scripts et gagnez 70% de chaque vente.",
    },
    // UX Controls
    uxControls: {
      title: "Mapping des Contrôles UX",
      description: "Actions universelles mappées sur les méthodes d'entrée de chaque appareil",
      action: "Action",
      next: "SUIVANT",
      nextDesc: "Bloc/page suivant",
      prev: "PRÉCÉD.",
      prevDesc: "Bloc/page précédent",
      pin: "ÉPINGLER",
      pinDesc: "Garder à l'écran",
      unpin: "DÉSÉPINGLER",
      unpinDesc: "Libérer l'épingle",
      speedUp: "VITESSE+",
      speedUpDesc: "Défilement plus rapide",
      speedDown: "VITESSE-",
      speedDownDesc: "Défilement plus lent",
      mode: "MODE",
      modeDesc: "Basculer cartes ⇄ continu",
      silentNote: "Tous les contrôles fonctionnent silencieusement sans commandes vocales. Parfait pour les réunions, présentations et le secteur médical.",
    },
    // Script Import
    scriptImport: {
      title: "Importer des Scripts",
      description: "Importez des scripts depuis des fichiers JSON ou Markdown",
      jsonData: "Données JSON",
      markdownContent: "Contenu Markdown",
      uploadFile: "Charger un fichier",
      importJson: "Importer JSON",
      importMarkdown: "Importer Markdown",
      importing: "Importation...",
      success: "Importation réussie",
      successDesc: "{count} script(s) importé(s)",
    },
    // API Key
    apiKey: {
      title: "Accès API",
      description: "Gérez vos clés API pour l'intégration SDK",
      yourApiKey: "Votre clé API",
      keepSecret: "Gardez cette clé secrète. Utilisez-la dans votre intégration SDK.",
      quickStart: "Démarrage rapide",
      regenerateKey: "Régénérer la clé",
      regenerateTitle: "Régénérer la clé API ?",
      regenerateDesc: "Cela invalidera immédiatement votre clé API actuelle. Toutes les applications utilisant l'ancienne clé cesseront de fonctionner jusqu'à ce que vous les mettiez à jour avec la nouvelle clé.",
      regenerating: "Régénération...",
      regenerated: "Clé API régénérée",
      regeneratedDesc: "Votre ancienne clé cessera de fonctionner immédiatement. Mettez à jour vos intégrations.",
      securityNotice: "Avis de sécurité",
      securityNoticeDesc: "N'exposez jamais votre clé API dans le code côté client ou les dépôts publics. Utilisez des variables d'environnement et des appels côté serveur pour les applications en production.",
      copied: "Copié",
      copiedDesc: "Clé API copiée dans le presse-papiers",
    },
    // Session Management
    session: {
      title: "Sessions actives",
      description: "Gérez les appareils où vous êtes connecté",
      current: "Actuelle",
      signOutOthers: "Déconnecter les autres",
      revoked: "Session révoquée",
      revokedDesc: "L'appareil a été déconnecté.",
      allRevoked: "Toutes les autres sessions révoquées",
      allRevokedDesc: "Tous les autres appareils ont été déconnectés.",
      securityTip: "Si vous ne reconnaissez pas une session, révoquez-la immédiatement et changez votre mot de passe pour sécuriser votre compte.",
    },
    // Password
    password: {
      changeTitle: "Changer le mot de passe",
      changeDesc: "Entrez un nouveau mot de passe pour votre compte",
      newPassword: "Nouveau mot de passe",
      confirmPassword: "Confirmer le nouveau mot de passe",
      passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
      updatePassword: "Mettre à jour le mot de passe",
      confirmTitle: "Confirmer le changement de mot de passe",
      confirmDesc: "Êtes-vous sûr de vouloir changer votre mot de passe ? Vous devrez utiliser le nouveau mot de passe pour toutes vos futures connexions.",
      updating: "Mise à jour...",
      yesChange: "Oui, changer le mot de passe",
      updated: "Mot de passe mis à jour",
      updatedDesc: "Votre mot de passe a été changé avec succès.",
    },
  },
} as const;

export const getTranslations = (lang: Language): TranslationKeys => translations[lang];

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

interface ScriptEditorTranslations {
  editScript: string;
  newScript: string;
  title: string;
  titlePlaceholder: string;
  content: string;
  contentPlaceholder: string;
  tags: string;
  tagsPlaceholder: string;
  lines: string;
  lineBreakHint: string;
  cancel: string;
  save: string;
  saving: string;
  hidePreview: string;
  showPreview: string;
  typeToPreview: string;
  hudHint: string;
}

interface UsageLimitsTranslations {
  title: string;
  scriptsUsed: string;
  devicesConnected: string;
  monthlyAnalyses: string;
  unlimited: string;
  upgradeToPro: string;
  freePlanLimits: string;
}

interface PrivacyControlsTranslations {
  privacyMode: string;
  localOnly: string;
  cloudProcessing: string;
  localOnlyDesc: string;
  cloudDesc: string;
  visualAnalysis: string;
  visualAnalysisDesc: string;
  enableVisualAnalysis: string;
  enableVisualAnalysisDesc: string;
  localOnlyProcessing: string;
  localOnlyProcessingDesc: string;
  recommended: string;
  captureIndicator: string;
  captureIndicatorDesc: string;
  dataManagement: string;
  dataManagementDesc: string;
  shareAnonymousAnalytics: string;
  shareAnonymousAnalyticsDesc: string;
  exportAllData: string;
  deleteAllData: string;
  gdprNotice: string;
  settingUpdated: string;
  settingUpdatedDesc: string;
}

interface ScriptTemplatesTranslations {
  title: string;
  useTemplate: string;
  templates: {
    salesPitch: { title: string; content: string };
    meetingNotes: { title: string; content: string };
    presentation: { title: string; content: string };
    interview: { title: string; content: string };
    training: { title: string; content: string };
    customerService: { title: string; content: string };
  };
}

interface ScriptPreviewTranslations {
  edit: string;
  duplicate: string;
  share: string;
  delete: string;
  inactive: string;
  uses: string;
  lines: string;
  lastUsed: string;
  never: string;
}

interface ExportDialogTranslations {
  title: string;
  description: string;
  format: string;
  json: string;
  jsonDesc: string;
  markdown: string;
  markdownDesc: string;
  text: string;
  textDesc: string;
  includeMetadata: string;
  cancel: string;
  export: string;
  exporting: string;
  success: string;
  successDesc: string;
}

// Interactive Pipeline
interface PipelineStepsTranslations {
  capture: { title: string; subtitle: string; description: string; details: readonly string[] };
  perception: { title: string; subtitle: string; description: string; details: readonly string[] };
  routing: { title: string; subtitle: string; description: string; details: readonly string[] };
  retrieval: { title: string; subtitle: string; description: string; details: readonly string[] };
  composer: { title: string; subtitle: string; description: string; details: readonly string[] };
  renderer: { title: string; subtitle: string; description: string; details: readonly string[] };
  features: string;
  techStack: string;
  performance: string;
  runDemo: string;
  animating: string;
  clickHint: string;
}

// Capability Matrix
interface CapabilityMatrixTranslations {
  tiers: {
    t0: { title: string; subtitle: string; description: string; badge: string; features: readonly string[]; works: readonly string[] };
    t1: { title: string; subtitle: string; description: string; badge: string; features: readonly string[]; works: readonly string[] };
    t2: { title: string; subtitle: string; description: string; badge: string; features: readonly string[]; works: readonly string[] };
    t3: { title: string; subtitle: string; description: string; badge: string; features: readonly string[]; works: readonly string[] };
  };
  capabilities: readonly { name: string; description: string }[];
  fullMatrix: string;
  compatibleDevices: string;
  capability: string;
}

// Devices Section
interface DevicesSectionTranslations {
  title: string;
  titleHighlight: string;
  description: string;
  sdkAvailable: string;
  earlyAccess: string;
  uncertain: string;
  closed: string;
  camera: string;
  hudApi: string;
  rxSupport: string;
  battery: string;
  display: string;
  dontSeeDevice: string;
  requestSupport: string;
}

// Clinical AR Module
interface ClinicalARTranslations {
  title: string;
  description: string;
  startSession: string;
  selectPatient: string;
  recentPatients: string;
  voiceHint: string;
  backToDashboard: string;
  exitAR: string;
  loading: string;
  deviceDetected: string;
  micListening: string;
  micOff: string;
  screenshot: string;
  report: string;
  realTimeActive: string;
  demoMode: string;
  commands: string;
  emotions: string;
  vitals: string;
  heartRate: string;
  stress: string;
  patient: string;
  lastSession: string;
  years: string;
  dominant: string;
  anxiety: string;
  joy: string;
  sadness: string;
  anger: string;
  disgust: string;
  highStress: string;
  patientLoaded: string;
  patientNotFound: string;
  captureSaved: string;
  generatingReport: string;
  reportGenerated: string;
  reportNotAvailable: string;
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
  scriptEditor: ScriptEditorTranslations;
  usageLimits: UsageLimitsTranslations;
  privacyControls: PrivacyControlsTranslations;
  scriptTemplates: ScriptTemplatesTranslations;
  scriptPreview: ScriptPreviewTranslations;
  exportDialog: ExportDialogTranslations;
  pipelineSteps: PipelineStepsTranslations;
  capabilityMatrix: CapabilityMatrixTranslations;
  devicesSection: DevicesSectionTranslations;
  clinicalAR: ClinicalARTranslations;
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
    // Script Editor
    scriptEditor: {
      editScript: "Edit Script",
      newScript: "New Script",
      title: "Title",
      titlePlaceholder: "e.g., Sales Pitch",
      content: "Script Content",
      contentPlaceholder: "Enter your script content... Each line will be a separate prompt block.",
      tags: "Tags (comma-separated)",
      tagsPlaceholder: "e.g., sales, meeting, pitch",
      lines: "lines",
      lineBreakHint: "Use line breaks to separate prompt blocks",
      cancel: "Cancel",
      save: "Save Script",
      saving: "Saving...",
      hidePreview: "Hide Preview",
      showPreview: "Show Preview",
      typeToPreview: "Type content to preview",
      hudHint: "Use ↑↓ keys to scroll • This simulates the HUD display",
    },
    // Usage Limits
    usageLimits: {
      title: "Usage Limits",
      scriptsUsed: "Scripts Used",
      devicesConnected: "Devices Connected",
      monthlyAnalyses: "Monthly Analyses",
      unlimited: "Unlimited",
      upgradeToPro: "Upgrade to Pro",
      freePlanLimits: "Free plan limits",
    },
    // Privacy Controls
    privacyControls: {
      privacyMode: "Privacy Mode",
      localOnly: "Local Only",
      cloudProcessing: "Cloud Processing",
      localOnlyDesc: "All analysis runs on your device. No data leaves your phone.",
      cloudDesc: "Some analysis uses cloud AI for better accuracy.",
      visualAnalysis: "Visual Analysis",
      visualAnalysisDesc: "Control how ContextLens analyzes camera input",
      enableVisualAnalysis: "Enable Visual Analysis",
      enableVisualAnalysisDesc: "Allow AI to analyze camera feed for context",
      localOnlyProcessing: "Local-Only Processing",
      localOnlyProcessingDesc: "Use on-device ML, never send images to cloud",
      recommended: "Recommended",
      captureIndicator: "Capture Indicator",
      captureIndicatorDesc: "Show visible indicator when camera is active",
      dataManagement: "Data Management",
      dataManagementDesc: "GDPR compliant data controls",
      shareAnonymousAnalytics: "Share Anonymous Analytics",
      shareAnonymousAnalyticsDesc: "Help improve ContextLens with usage data",
      exportAllData: "Export All My Data (JSON)",
      deleteAllData: "Delete All My Data",
      gdprNotice: "ContextLens complies with GDPR. You can request data export or deletion at any time. We never sell your data to third parties.",
      settingUpdated: "Privacy Setting Updated",
      settingUpdatedDesc: "Your preferences have been saved.",
    },
    // Script Templates
    scriptTemplates: {
      title: "Script Templates",
      useTemplate: "Use Template",
      templates: {
        salesPitch: { title: "Sales Pitch", content: "Opening hook and value proposition\n\nKey benefits for the client\n• Benefit 1\n• Benefit 2\n• Benefit 3\n\nPricing and next steps\n\nClosing and call to action" },
        meetingNotes: { title: "Meeting Notes", content: "Meeting objective: [State main goal]\n\nKey discussion points:\n• Point 1\n• Point 2\n\nAction items:\n• [Owner] - Task by [date]\n\nNext meeting: [Date/Time]" },
        presentation: { title: "Presentation", content: "Introduction & hook\n\nAgenda overview\n\nMain point 1 with supporting data\n\nMain point 2 with examples\n\nMain point 3 with case study\n\nConclusion and Q&A" },
        interview: { title: "Interview Guide", content: "Candidate: [Name]\nPosition: [Role]\n\nIntroduction (2 min)\n\nExperience questions:\n• Tell me about...\n• How did you handle...\n\nTechnical questions:\n• Describe your approach to...\n\nClosing and next steps" },
        training: { title: "Training Module", content: "Module: [Topic Name]\nDuration: [X minutes]\n\nLearning objectives:\n• Objective 1\n• Objective 2\n\nKey concepts:\n• Concept A - [explanation]\n• Concept B - [explanation]\n\nPractice exercise\n\nSummary & quiz" },
        customerService: { title: "Customer Service", content: "Greeting: Hello! How can I help you today?\n\nListen and acknowledge concern\n\nGather information:\n• Order number?\n• Issue details?\n\nProvide solution options\n\nConfirm resolution\n\nClosing: Is there anything else I can help with?" },
      },
    },
    // Script Preview
    scriptPreview: {
      edit: "Edit",
      duplicate: "Duplicate",
      share: "Share",
      delete: "Delete",
      inactive: "Inactive",
      uses: "uses",
      lines: "lines",
      lastUsed: "Last used",
      never: "Never",
    },
    // Export Dialog
    exportDialog: {
      title: "Export Scripts",
      description: "Export your scripts in different formats",
      format: "Format",
      json: "JSON",
      jsonDesc: "Full data with metadata, importable",
      markdown: "Markdown",
      markdownDesc: "Human-readable, great for docs",
      text: "Plain Text",
      textDesc: "Simple text format, no metadata",
      includeMetadata: "Include metadata (tags, dates, usage)",
      cancel: "Cancel",
      export: "Export",
      exporting: "Exporting...",
      success: "Scripts exported",
      successDesc: "Downloaded {count} scripts as {format}",
    },
    // Pipeline Steps
    pipelineSteps: {
      capture: {
        title: "CAPTURE",
        subtitle: "Input Layer",
        description: "Camera feed from glasses or phone continuously captures visual context.",
        details: ["Frame JPEG extraction at 1-10 fps", "Auto-switch between glasses & phone camera", "Configurable resolution & quality", "Battery-optimized capture modes"],
      },
      perception: {
        title: "PERCEPTION",
        subtitle: "Understanding Layer",
        description: "AI analyzes the visual feed to understand context, text, and objects.",
        details: ["Multi-language OCR (Tesseract + Cloud)", "Entity recognition (faces, objects)", "Scene classification (meeting, presentation)", "Context tagging & metadata extraction"],
      },
      routing: {
        title: "ROUTING",
        subtitle: "Decision Layer",
        description: "Smart routing matches detected context to your content library.",
        details: ["Tag-based matching algorithms", "Relevance scoring (0-100)", "Priority queue management", "Top-k candidates selection"],
      },
      retrieval: {
        title: "RETRIEVAL",
        subtitle: "Memory Layer",
        description: "Semantic search finds the most relevant scripts from your library.",
        details: ["Vector embeddings (1536-dim)", "RAG pipeline integration", "Combined ranking (keyword + semantic)", "Context window optimization"],
      },
      composer: {
        title: "COMPOSER",
        subtitle: "Formatting Layer",
        description: "Content is formatted optimally for micro-display rendering.",
        details: ["10-15 line block formatting", "Display adaptation (HUD vs phone)", "Smart scroll management", "Font & contrast optimization"],
      },
      renderer: {
        title: "RENDERER",
        subtitle: "Output Layer",
        description: "Pushes formatted content to your device with optimal UX.",
        details: ["Device-specific adapters (SDK/WebSocket)", "Gesture & input handling", "Phone fallback (notifications/TTS)", "Real-time synchronization"],
      },
      features: "Features",
      techStack: "Tech Stack",
      performance: "Performance",
      runDemo: "Run Pipeline Demo",
      animating: "Animating...",
      clickHint: "Click on any stage to see details, or run the demo to see the full flow.",
    },
    // Capability Matrix
    capabilityMatrix: {
      tiers: {
        t0: {
          title: "Universal",
          subtitle: "Phone-Only Fallback",
          description: "Works with ALL devices. Vision via phone camera, display via notifications or audio TTS.",
          badge: "Safety Net",
          features: ["Phone camera capture", "Cloud AI analysis", "Push notifications", "Audio TTS output"],
          works: ["Any glasses", "Closed ecosystems", "No SDK required"],
        },
        t1: {
          title: "Display via SDK",
          subtitle: "Native HUD Integration",
          description: "Push text and images directly to the HUD via official manufacturer SDK.",
          badge: "Recommended",
          features: ["Phone camera capture", "Native HUD display", "Smooth prompter UX", "No hacks required"],
          works: ["Even G2", "Vuzix Z100", "Xreal Air"],
        },
        t2: {
          title: "On-Device Mode",
          subtitle: "Developer Access",
          description: "App runs directly on the glasses with potential sensor access.",
          badge: "Advanced",
          features: ["On-device compute", "Sensor integration", "Lower latency", "Developer mode"],
          works: ["Rokid (Dev Program)", "Meta Quest", "HoloLens"],
        },
        t3: {
          title: "Vision + AR",
          subtitle: "Full Spatial Computing",
          description: "Spatial overlays with 6DoF tracking. The ultimate AR experience.",
          badge: "Endgame",
          features: ["Spatial anchors", "6DoF tracking", "World-locked UI", "Full AR capability"],
          works: ["Apple Vision Pro", "Magic Leap 2", "Future devices"],
        },
      },
      capabilities: [
        { name: "Vision Input", description: "Camera access for context capture" },
        { name: "Display Output", description: "How content is rendered" },
        { name: "Latency", description: "End-to-end response time" },
        { name: "Offline Mode", description: "Works without internet" },
        { name: "Gesture Control", description: "Hand/gesture input support" },
        { name: "Voice Control", description: "Voice command support" },
        { name: "Head Tracking", description: "IMU-based orientation" },
        { name: "Spatial Anchors", description: "World-locked content" },
        { name: "Multi-User", description: "Shared AR experiences" },
        { name: "SDK Required", description: "Developer SDK needed" },
      ],
      fullMatrix: "Full Capability Matrix",
      compatibleDevices: "Compatible Devices",
      capability: "Capability",
    },
    // Devices Section
    devicesSection: {
      title: "Device",
      titleHighlight: "Compatibility Matrix",
      description: "Real capabilities, verified SDKs. We only promise what we can deliver.",
      sdkAvailable: "SDK Available",
      earlyAccess: "Early Access",
      uncertain: "Uncertain",
      closed: "Closed",
      camera: "Camera",
      hudApi: "HUD API",
      rxSupport: "Rx Support",
      battery: "battery",
      display: "Display",
      dontSeeDevice: "Don't see your device?",
      requestSupport: "Request Device Support",
    },
    // Clinical AR Module
    clinicalAR: {
      title: "Clinical AR Session",
      description: "Visualize brain data in augmented reality",
      startSession: "Start AR Session",
      selectPatient: "Select a patient to begin",
      recentPatients: "Recent Patients",
      voiceHint: 'Or say "Patient [name]" to load a file',
      backToDashboard: "Back to dashboard",
      exitAR: "Exit AR",
      loading: "Initializing AR session...",
      deviceDetected: "Device detected",
      micListening: "Listening...",
      micOff: "Mic off",
      screenshot: "Screenshot",
      report: "Report",
      realTimeActive: "Real-time active",
      demoMode: "Demo mode",
      commands: 'Commands: "Zoom [region]" • "View axial" • "Note: [text]" • "Reset"',
      emotions: "Emotions",
      vitals: "Vitals",
      heartRate: "HR",
      stress: "Stress",
      patient: "Patient",
      lastSession: "Last session",
      years: "y/o",
      dominant: "Dominant",
      anxiety: "Anxiety",
      joy: "Joy",
      sadness: "Sadness",
      anger: "Anger",
      disgust: "Disgust",
      highStress: "High stress detected",
      patientLoaded: "Patient loaded",
      patientNotFound: "Patient not found",
      captureSaved: "Screenshot saved",
      generatingReport: "Generating report...",
      reportGenerated: "Report generated",
      reportNotAvailable: "Report generation not available in demo mode",
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
    // Script Editor
    scriptEditor: {
      editScript: "Modifier le script",
      newScript: "Nouveau script",
      title: "Titre",
      titlePlaceholder: "ex. Pitch commercial",
      content: "Contenu du script",
      contentPlaceholder: "Entrez le contenu de votre script... Chaque ligne sera un bloc de prompt séparé.",
      tags: "Tags (séparés par des virgules)",
      tagsPlaceholder: "ex. ventes, réunion, pitch",
      lines: "lignes",
      lineBreakHint: "Utilisez les sauts de ligne pour séparer les blocs de prompts",
      cancel: "Annuler",
      save: "Enregistrer le script",
      saving: "Enregistrement...",
      hidePreview: "Masquer l'aperçu",
      showPreview: "Afficher l'aperçu",
      typeToPreview: "Tapez du contenu pour prévisualiser",
      hudHint: "Utilisez ↑↓ pour défiler • Ceci simule l'affichage HUD",
    },
    // Usage Limits
    usageLimits: {
      title: "Limites d'utilisation",
      scriptsUsed: "Scripts utilisés",
      devicesConnected: "Appareils connectés",
      monthlyAnalyses: "Analyses mensuelles",
      unlimited: "Illimité",
      upgradeToPro: "Passer à Pro",
      freePlanLimits: "Limites du plan gratuit",
    },
    // Privacy Controls
    privacyControls: {
      privacyMode: "Mode confidentialité",
      localOnly: "Local uniquement",
      cloudProcessing: "Traitement cloud",
      localOnlyDesc: "Toute l'analyse s'exécute sur votre appareil. Aucune donnée ne quitte votre téléphone.",
      cloudDesc: "Certaines analyses utilisent l'IA cloud pour une meilleure précision.",
      visualAnalysis: "Analyse visuelle",
      visualAnalysisDesc: "Contrôlez comment ContextLens analyse les entrées caméra",
      enableVisualAnalysis: "Activer l'analyse visuelle",
      enableVisualAnalysisDesc: "Permettre à l'IA d'analyser le flux caméra pour le contexte",
      localOnlyProcessing: "Traitement local uniquement",
      localOnlyProcessingDesc: "Utiliser le ML sur l'appareil, ne jamais envoyer d'images au cloud",
      recommended: "Recommandé",
      captureIndicator: "Indicateur de capture",
      captureIndicatorDesc: "Afficher un indicateur visible quand la caméra est active",
      dataManagement: "Gestion des données",
      dataManagementDesc: "Contrôles de données conformes au RGPD",
      shareAnonymousAnalytics: "Partager les analyses anonymes",
      shareAnonymousAnalyticsDesc: "Aider à améliorer ContextLens avec des données d'utilisation",
      exportAllData: "Exporter toutes mes données (JSON)",
      deleteAllData: "Supprimer toutes mes données",
      gdprNotice: "ContextLens est conforme au RGPD. Vous pouvez demander l'export ou la suppression de vos données à tout moment. Nous ne vendons jamais vos données à des tiers.",
      settingUpdated: "Paramètre de confidentialité mis à jour",
      settingUpdatedDesc: "Vos préférences ont été enregistrées.",
    },
    // Script Templates
    scriptTemplates: {
      title: "Modèles de scripts",
      useTemplate: "Utiliser le modèle",
      templates: {
        salesPitch: { title: "Pitch commercial", content: "Accroche d'ouverture et proposition de valeur\n\nAvantages clés pour le client\n• Avantage 1\n• Avantage 2\n• Avantage 3\n\nTarifs et prochaines étapes\n\nConclusion et appel à l'action" },
        meetingNotes: { title: "Notes de réunion", content: "Objectif de la réunion : [Indiquer l'objectif principal]\n\nPoints de discussion clés :\n• Point 1\n• Point 2\n\nActions à faire :\n• [Responsable] - Tâche avant le [date]\n\nProchaine réunion : [Date/Heure]" },
        presentation: { title: "Présentation", content: "Introduction & accroche\n\nAperçu de l'agenda\n\nPoint principal 1 avec données de support\n\nPoint principal 2 avec exemples\n\nPoint principal 3 avec étude de cas\n\nConclusion et Q&R" },
        interview: { title: "Guide d'entretien", content: "Candidat : [Nom]\nPoste : [Rôle]\n\nIntroduction (2 min)\n\nQuestions d'expérience :\n• Parlez-moi de...\n• Comment avez-vous géré...\n\nQuestions techniques :\n• Décrivez votre approche de...\n\nConclusion et prochaines étapes" },
        training: { title: "Module de formation", content: "Module : [Nom du sujet]\nDurée : [X minutes]\n\nObjectifs d'apprentissage :\n• Objectif 1\n• Objectif 2\n\nConcepts clés :\n• Concept A - [explication]\n• Concept B - [explication]\n\nExercice pratique\n\nRésumé & quiz" },
        customerService: { title: "Service client", content: "Salutation : Bonjour ! Comment puis-je vous aider aujourd'hui ?\n\nÉcouter et reconnaître la préoccupation\n\nRecueillir les informations :\n• Numéro de commande ?\n• Détails du problème ?\n\nProposer des solutions\n\nConfirmer la résolution\n\nConclusion : Y a-t-il autre chose que je puisse faire pour vous ?" },
      },
    },
    // Script Preview
    scriptPreview: {
      edit: "Modifier",
      duplicate: "Dupliquer",
      share: "Partager",
      delete: "Supprimer",
      inactive: "Inactif",
      uses: "utilisations",
      lines: "lignes",
      lastUsed: "Dernière utilisation",
      never: "Jamais",
    },
    // Export Dialog
    exportDialog: {
      title: "Exporter les scripts",
      description: "Exportez vos scripts dans différents formats",
      format: "Format",
      json: "JSON",
      jsonDesc: "Données complètes avec métadonnées, importable",
      markdown: "Markdown",
      markdownDesc: "Lisible par l'humain, idéal pour la doc",
      text: "Texte brut",
      textDesc: "Format texte simple, sans métadonnées",
      includeMetadata: "Inclure les métadonnées (tags, dates, utilisation)",
      cancel: "Annuler",
      export: "Exporter",
      exporting: "Exportation...",
      success: "Scripts exportés",
      successDesc: "{count} scripts téléchargés en {format}",
    },
    // Pipeline Steps
    pipelineSteps: {
      capture: {
        title: "CAPTURE",
        subtitle: "Couche d'entrée",
        description: "Le flux caméra des lunettes ou du téléphone capture en continu le contexte visuel.",
        details: ["Extraction JPEG à 1-10 fps", "Bascule auto entre lunettes & téléphone", "Résolution et qualité configurables", "Modes de capture optimisés batterie"],
      },
      perception: {
        title: "PERCEPTION",
        subtitle: "Couche de compréhension",
        description: "L'IA analyse le flux visuel pour comprendre le contexte, le texte et les objets.",
        details: ["OCR multilingue (Tesseract + Cloud)", "Reconnaissance d'entités (visages, objets)", "Classification de scène (réunion, présentation)", "Extraction de tags et métadonnées"],
      },
      routing: {
        title: "ROUTAGE",
        subtitle: "Couche de décision",
        description: "Le routage intelligent associe le contexte détecté à votre bibliothèque de contenu.",
        details: ["Algorithmes de correspondance par tags", "Score de pertinence (0-100)", "Gestion des files de priorité", "Sélection des top-k candidats"],
      },
      retrieval: {
        title: "RÉCUPÉRATION",
        subtitle: "Couche mémoire",
        description: "La recherche sémantique trouve les scripts les plus pertinents dans votre bibliothèque.",
        details: ["Embeddings vectoriels (1536-dim)", "Intégration pipeline RAG", "Classement combiné (mots-clés + sémantique)", "Optimisation de la fenêtre de contexte"],
      },
      composer: {
        title: "COMPOSITEUR",
        subtitle: "Couche de formatage",
        description: "Le contenu est formaté de manière optimale pour le rendu sur micro-affichage.",
        details: ["Formatage en blocs de 10-15 lignes", "Adaptation à l'affichage (HUD vs téléphone)", "Gestion intelligente du défilement", "Optimisation police & contraste"],
      },
      renderer: {
        title: "RENDU",
        subtitle: "Couche de sortie",
        description: "Pousse le contenu formaté vers votre appareil avec une UX optimale.",
        details: ["Adaptateurs spécifiques par appareil (SDK/WebSocket)", "Gestion des gestes & entrées", "Repli téléphone (notifications/TTS)", "Synchronisation temps réel"],
      },
      features: "Fonctionnalités",
      techStack: "Stack technique",
      performance: "Performance",
      runDemo: "Lancer la démo",
      animating: "Animation...",
      clickHint: "Cliquez sur une étape pour voir les détails, ou lancez la démo pour voir le flux complet.",
    },
    // Capability Matrix
    capabilityMatrix: {
      tiers: {
        t0: {
          title: "Universel",
          subtitle: "Mode téléphone uniquement",
          description: "Fonctionne avec TOUS les appareils. Vision via caméra téléphone, affichage via notifications ou audio TTS.",
          badge: "Filet de sécurité",
          features: ["Capture caméra téléphone", "Analyse IA cloud", "Notifications push", "Sortie audio TTS"],
          works: ["Toutes lunettes", "Écosystèmes fermés", "Aucun SDK requis"],
        },
        t1: {
          title: "Affichage via SDK",
          subtitle: "Intégration HUD native",
          description: "Poussez texte et images directement sur le HUD via le SDK officiel du fabricant.",
          badge: "Recommandé",
          features: ["Capture caméra téléphone", "Affichage HUD natif", "UX prompteur fluide", "Aucun hack requis"],
          works: ["Even G2", "Vuzix Z100", "Xreal Air"],
        },
        t2: {
          title: "Mode embarqué",
          subtitle: "Accès développeur",
          description: "L'app tourne directement sur les lunettes avec accès potentiel aux capteurs.",
          badge: "Avancé",
          features: ["Calcul sur l'appareil", "Intégration capteurs", "Latence réduite", "Mode développeur"],
          works: ["Rokid (Programme Dev)", "Meta Quest", "HoloLens"],
        },
        t3: {
          title: "Vision + AR",
          subtitle: "Calcul spatial complet",
          description: "Overlays spatiaux avec tracking 6DoF. L'expérience AR ultime.",
          badge: "Objectif final",
          features: ["Ancres spatiales", "Tracking 6DoF", "UI world-locked", "Capacité AR complète"],
          works: ["Apple Vision Pro", "Magic Leap 2", "Futurs appareils"],
        },
      },
      capabilities: [
        { name: "Entrée vision", description: "Accès caméra pour capture de contexte" },
        { name: "Sortie affichage", description: "Mode de rendu du contenu" },
        { name: "Latence", description: "Temps de réponse bout en bout" },
        { name: "Mode hors ligne", description: "Fonctionne sans internet" },
        { name: "Contrôle gestuel", description: "Support entrée main/gestes" },
        { name: "Contrôle vocal", description: "Support commandes vocales" },
        { name: "Head Tracking", description: "Orientation basée IMU" },
        { name: "Ancres spatiales", description: "Contenu verrouillé au monde" },
        { name: "Multi-utilisateur", description: "Expériences AR partagées" },
        { name: "SDK requis", description: "SDK développeur nécessaire" },
      ],
      fullMatrix: "Matrice complète des capacités",
      compatibleDevices: "Appareils compatibles",
      capability: "Capacité",
    },
    // Devices Section
    devicesSection: {
      title: "Matrice de",
      titleHighlight: "Compatibilité",
      description: "Capacités réelles, SDKs vérifiés. Nous ne promettons que ce que nous pouvons livrer.",
      sdkAvailable: "SDK disponible",
      earlyAccess: "Accès anticipé",
      uncertain: "Incertain",
      closed: "Fermé",
      camera: "Caméra",
      hudApi: "API HUD",
      rxSupport: "Support Rx",
      battery: "batterie",
      display: "Affichage",
      dontSeeDevice: "Vous ne voyez pas votre appareil ?",
      requestSupport: "Demander le support",
    },
    // Clinical AR Module
    clinicalAR: {
      title: "Session AR Clinique",
      description: "Visualisez les données cérébrales en réalité augmentée",
      startSession: "Démarrer la session AR",
      selectPatient: "Sélectionnez un patient pour commencer",
      recentPatients: "Patients récents",
      voiceHint: 'Ou dites "Patient [nom]" pour charger un dossier',
      backToDashboard: "Retour au tableau de bord",
      exitAR: "Quitter AR",
      loading: "Initialisation de la session AR...",
      deviceDetected: "Appareil détecté",
      micListening: "Écoute...",
      micOff: "Micro désactivé",
      screenshot: "Capture",
      report: "Rapport",
      realTimeActive: "Temps réel actif",
      demoMode: "Mode démo",
      commands: 'Commandes: "Zoom [région]" • "Vue axiale" • "Note: [texte]" • "Reset"',
      emotions: "Émotions",
      vitals: "Signes Vitaux",
      heartRate: "FC",
      stress: "Stress",
      patient: "Patient",
      lastSession: "Dernière session",
      years: "ans",
      dominant: "Dominante",
      anxiety: "Anxiété",
      joy: "Joie",
      sadness: "Tristesse",
      anger: "Colère",
      disgust: "Dégoût",
      highStress: "Stress élevé détecté",
      patientLoaded: "Patient chargé",
      patientNotFound: "Patient non trouvé",
      captureSaved: "Capture enregistrée",
      generatingReport: "Génération du rapport...",
      reportGenerated: "Rapport généré",
      reportNotAvailable: "Génération de rapport non disponible en mode démo",
    },
  },
} as const;

export const getTranslations = (lang: Language): TranslationKeys => translations[lang];

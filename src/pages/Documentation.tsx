import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Code, 
  Smartphone, 
  Glasses, 
  Zap,
  ChevronDown,
  BookOpen,
  Cpu,
  Layers,
  Terminal,
  FileCode,
  ArrowRight,
  Server
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import APIEndpointsDocs from "@/components/docs/APIEndpointsDocs";
import DocSearch from "@/components/docs/DocSearch";
import TableOfContents from "@/components/docs/TableOfContents";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ErrorBoundary from "@/components/ui/error-boundary";

const CodeBlock = ({ code, language = "typescript" }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-mono">{language}</span>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <pre className="bg-secondary/50 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm">
        <code className="text-muted-foreground">{code}</code>
      </pre>
    </div>
  );
};

const ExpandableSection = ({ 
  title, 
  children, 
  defaultOpen = false 
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors text-left"
      >
        <span className="font-medium">{title}</span>
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const tierDocs = [
  {
    tier: 0,
    title: "Tier 0 — Universal Fallback",
    icon: Smartphone,
    color: "emerald",
    description: "Works with ANY device. Uses phone camera for vision and push notifications or TTS for output.",
    devices: ["Ray-Ban Meta", "Any glasses without SDK", "Closed ecosystems"],
    features: [
      "Phone camera as vision source",
      "Push notifications for prompts",
      "Audio TTS output option",
      "No SDK integration required",
    ],
    code: `// Tier 0: Phone Fallback Mode
import { ContextLens, PhoneFallbackAdapter } from '@contextlens/sdk';

const contextLens = new ContextLens({
  apiKey: 'YOUR_API_KEY',
  adapter: new PhoneFallbackAdapter({
    outputMode: 'notification', // or 'tts'
    captureSource: 'phone_camera',
  }),
});

// Start contextual prompting
await contextLens.startSession({
  onPromptReady: (prompt) => {
    // Will show as push notification
    console.log('Prompt ready:', prompt.title);
  },
});`,
  },
  {
    tier: 1,
    title: "Tier 1 — Display via SDK",
    icon: Glasses,
    color: "primary",
    description: "Push text and images directly to the HUD via official manufacturer SDK.",
    devices: ["Even G2", "Vuzix Z100", "Xreal Air 2"],
    features: [
      "Native HUD display integration",
      "Phone camera for vision input",
      "Smooth prompter scrolling UX",
      "Gesture & ring controller support",
    ],
    code: `// Tier 1: HUD SDK Integration
import { ContextLens, EvenG2Adapter } from '@contextlens/sdk';
import { EvenHubClient } from 'even-hub-sdk';

const evenHub = await EvenHubClient.connect();
const contextLens = new ContextLens({
  apiKey: 'YOUR_API_KEY',
  adapter: new EvenG2Adapter(evenHub),
});

// Display prompt on HUD
await contextLens.displayPrompt({
  title: 'Meeting Notes',
  lines: [
    'Discuss Q4 roadmap',
    'Review budget allocations',
    'Team capacity planning',
  ],
  scrollSpeed: 'medium',
});`,
  },
  {
    tier: 2,
    title: "Tier 2 — On-Device Mode",
    icon: Cpu,
    color: "violet",
    description: "App runs directly on the glasses with native sensor access and lower latency.",
    devices: ["Rokid (Dev Program)", "Meta Quest 3", "HoloLens 2"],
    features: [
      "On-device compute available",
      "Native camera access",
      "Lower latency (100-200ms)",
      "Sensor integration (IMU, etc.)",
    ],
    code: `// Tier 2: On-Device Mode
import { ContextLens, RokidAdapter } from '@contextlens/sdk';

const contextLens = new ContextLens({
  apiKey: 'YOUR_API_KEY',
  adapter: new RokidAdapter({
    useNativeCamera: true,
    computeMode: 'hybrid', // 'device' | 'cloud' | 'hybrid'
  }),
});

// Use native camera for capture
await contextLens.startSession({
  captureSource: 'native',
  onFrameProcessed: (context) => {
    console.log('Detected:', context.entities);
  },
});`,
  },
  {
    tier: 3,
    title: "Tier 3 — Vision + AR",
    icon: Layers,
    color: "amber",
    description: "Full spatial computing with 6DoF tracking and world-locked AR overlays.",
    devices: ["Apple Vision Pro", "Magic Leap 2", "Future AR devices"],
    features: [
      "Spatial anchors & world-lock",
      "6DoF head tracking",
      "Full AR overlay capability",
      "Multi-user shared experiences",
    ],
    code: `// Tier 3: Full AR Mode
import { ContextLens, VisionProAdapter } from '@contextlens/sdk';

const contextLens = new ContextLens({
  apiKey: 'YOUR_API_KEY',
  adapter: new VisionProAdapter({
    spatialMode: true,
    trackingMode: '6dof',
  }),
});

// Create spatial anchor for prompt
const anchor = await contextLens.createSpatialAnchor({
  position: { x: 0, y: 1.5, z: -1 },
  size: { width: 0.4, height: 0.3 },
});

await contextLens.displayPrompt({
  anchor: anchor,
  title: 'Product Specs',
  lines: ['Feature A', 'Feature B'],
  worldLocked: true,
});`,
  },
];

const Documentation = () => {
  const [activeTier, setActiveTier] = useState<number | null>(null);

  const handleSearchResultClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // TOC items for sidebar
  const tocItems = [
    { id: "tier-0", title: "Tier 0 — Universal Fallback", level: 1 },
    { id: "tier-1", title: "Tier 1 — Display via SDK", level: 1 },
    { id: "tier-2", title: "Tier 2 — On-Device Mode", level: 1 },
    { id: "tier-3", title: "Tier 3 — Vision + AR", level: 1 },
    { id: "device-sdks", title: "Device-Specific SDKs", level: 1 },
    { id: "api-reference", title: "API Reference", level: 1 },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container px-4">
            <Breadcrumbs />
            
            {/* Hero */}
            <div className="max-w-4xl mx-auto text-center mb-16">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                <BookOpen className="h-3 w-3 mr-1" />
                Developer Documentation
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                SDK Integration <span className="text-gradient">Guides</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Comprehensive guides for integrating ContextLens with smart glasses at every tier level.
                From phone fallback to full AR spatial computing.
              </p>

              {/* Search */}
              <div className="flex justify-center mb-8">
                <DocSearch onResultClick={handleSearchResultClick} />
              </div>

              {/* Quick nav */}
              <div className="flex flex-wrap justify-center gap-3">
                {tierDocs.map((doc) => (
                  <a
                    key={doc.tier}
                    href={`#tier-${doc.tier}`}
                    className={`tier-badge tier-${doc.tier} hover:scale-105 transition-transform`}
                  >
                    <doc.icon className="h-3.5 w-3.5" />
                    Tier {doc.tier}
                  </a>
                ))}
              </div>
            </div>

            {/* Main content with TOC sidebar */}
            <div className="max-w-6xl mx-auto flex gap-8">
              {/* TOC Sidebar - Hidden on mobile */}
              <aside className="hidden lg:block w-64 shrink-0">
                <TableOfContents items={tocItems} />
              </aside>
              
              {/* Tier Documentation Sections */}
              <div className="flex-1 space-y-12">
            {tierDocs.map((doc) => (
              <section key={doc.tier} id={`tier-${doc.tier}`} className="scroll-mt-24">
                <Card className="glass-card border-border/50 overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div 
                        className={`p-3 rounded-xl`}
                        style={{ 
                          backgroundColor: `hsl(var(--${doc.color === 'primary' ? 'primary' : doc.color}) / 0.15)`,
                          color: `hsl(var(--${doc.color === 'primary' ? 'primary' : doc.color}))`
                        }}
                      >
                        <doc.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <CardTitle>{doc.title}</CardTitle>
                          <Badge className={`tier-badge tier-${doc.tier}`}>T{doc.tier}</Badge>
                        </div>
                        <CardDescription>{doc.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Devices & Features */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                          Compatible Devices
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {doc.devices.map((device) => (
                            <span key={device} className="px-2.5 py-1 rounded-full bg-secondary text-sm">
                              {device}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                          Features
                        </h4>
                        <ul className="space-y-1.5">
                          {doc.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm">
                              <Check className={`h-3.5 w-3.5 ${doc.color === 'primary' ? 'text-primary' : `text-${doc.color}-400`}`} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Code Example */}
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Quick Start
                      </h4>
                      <CodeBlock code={doc.code} language="typescript" />
                    </div>
                  </CardContent>
                </Card>
              </section>
            ))}
          </div>

          {/* Device-Specific SDK Tabs */}
          <div className="max-w-5xl mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Device-Specific <span className="text-gradient">SDK Guides</span>
            </h2>

            <Tabs defaultValue="even-g2" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 max-w-xl mx-auto">
                <TabsTrigger value="even-g2" className="gap-1.5">
                  <Glasses className="h-4 w-4" />
                  <span className="hidden sm:inline">Even G2</span>
                </TabsTrigger>
                <TabsTrigger value="vuzix-z100" className="gap-1.5">
                  <Glasses className="h-4 w-4" />
                  <span className="hidden sm:inline">Vuzix</span>
                </TabsTrigger>
                <TabsTrigger value="rokid" className="gap-1.5">
                  <Cpu className="h-4 w-4" />
                  <span className="hidden sm:inline">Rokid</span>
                </TabsTrigger>
                <TabsTrigger value="phone" className="gap-1.5">
                  <Smartphone className="h-4 w-4" />
                  <span className="hidden sm:inline">Phone</span>
                </TabsTrigger>
              </TabsList>

              {/* Even G2 */}
              <TabsContent value="even-g2" className="space-y-6">
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Glasses className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Even G2 Integration</CardTitle>
                        <CardDescription>Flutter SDK • Tier 1 • HUD Display</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 rounded-lg bg-secondary/50 text-center">
                        <p className="text-2xl font-bold text-primary">48h</p>
                        <p className="text-xs text-muted-foreground">Battery</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50 text-center">
                        <p className="text-2xl font-bold text-primary">640×350</p>
                        <p className="text-xs text-muted-foreground">Resolution</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50 text-center">
                        <p className="text-2xl font-bold text-primary">27.5°</p>
                        <p className="text-xs text-muted-foreground">FOV</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50 text-center">
                        <p className="text-2xl font-bold text-primary">Rx</p>
                        <p className="text-xs text-muted-foreground">Prescription</p>
                      </div>
                    </div>

                    <ExpandableSection title="1. Prerequisites" defaultOpen>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-accent mt-1 shrink-0" />
                          Flutter 3.10+ installed on your development machine
                        </li>
                        <li className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-accent mt-1 shrink-0" />
                          Even Hub SDK access (apply at evenhub.evenrealities.com)
                        </li>
                        <li className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-accent mt-1 shrink-0" />
                          ContextLens API key (available in your dashboard)
                        </li>
                      </ul>
                    </ExpandableSection>

                    <ExpandableSection title="2. Installation">
                      <CodeBlock code={`# Add to pubspec.yaml
dependencies:
  even_hub_sdk: ^1.0.0
  contextlens_flutter: ^1.0.0

# Then run
flutter pub get`} language="yaml" />
                    </ExpandableSection>

                    <ExpandableSection title="3. Initialize SDK">
                      <CodeBlock code={`import 'package:even_hub_sdk/even_hub_sdk.dart';
import 'package:contextlens_flutter/contextlens.dart';

class ContextLensApp {
  late EvenHubClient _evenHub;
  late ContextLens _contextLens;

  Future<void> initialize() async {
    // Initialize Even Hub
    _evenHub = await EvenHubClient.connect();
    
    // Initialize ContextLens with your API key
    _contextLens = ContextLens(
      apiKey: 'YOUR_API_KEY',
      deviceAdapter: EvenG2Adapter(_evenHub),
    );
    
    await _contextLens.initialize();
  }
}`} language="dart" />
                    </ExpandableSection>

                    <ExpandableSection title="4. Display Content">
                      <CodeBlock code={`// Display a prompt on the glasses
await _contextLens.displayPrompt(
  Prompt(
    title: 'Meeting Notes',
    lines: [
      'Discuss Q4 roadmap',
      'Review budget allocations',
      'Team capacity planning',
    ],
    scrollSpeed: ScrollSpeed.medium,
  ),
);

// Or display contextual info based on camera
await _contextLens.startContextualMode(
  onPromptReady: (prompt) {
    print('Displaying: \${prompt.title}');
  },
);`} language="dart" />
                    </ExpandableSection>

                    <ExpandableSection title="5. Handle User Input">
                      <CodeBlock code={`// Listen for touchbar and R1 ring inputs
_contextLens.onInput.listen((input) {
  switch (input) {
    case InputAction.next:
      _contextLens.nextBlock();
      break;
    case InputAction.previous:
      _contextLens.previousBlock();
      break;
    case InputAction.pin:
      _contextLens.pinCurrentBlock();
      break;
    case InputAction.speedUp:
      _contextLens.adjustSpeed(1.5);
      break;
  }
});`} language="dart" />
                    </ExpandableSection>

                    <div className="flex gap-3">
                      <Button variant="hero" asChild>
                        <a href="https://evenhub.evenrealities.com/" target="_blank" rel="noopener noreferrer">
                          Get SDK Access
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                      <Button variant="glass" asChild>
                        <a href="https://github.com/even-realities" target="_blank" rel="noopener noreferrer">
                          <Code className="h-4 w-4 mr-2" />
                          View on GitHub
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Vuzix Z100 */}
              <TabsContent value="vuzix-z100" className="space-y-6">
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Glasses className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <CardTitle>Vuzix Z100 Integration</CardTitle>
                        <CardDescription>Ultralite SDK • Tier 1 • Android/iOS</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 rounded-lg bg-secondary/50 text-center">
                        <p className="text-2xl font-bold text-accent">12h</p>
                        <p className="text-xs text-muted-foreground">Battery</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50 text-center">
                        <p className="text-2xl font-bold text-accent">Mono</p>
                        <p className="text-xs text-muted-foreground">Display</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50 text-center">
                        <p className="text-2xl font-bold text-accent">30°</p>
                        <p className="text-xs text-muted-foreground">FOV</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/50 text-center">
                        <p className="text-2xl font-bold text-accent">Rx</p>
                        <p className="text-xs text-muted-foreground">Prescription</p>
                      </div>
                    </div>

                    <ExpandableSection title="Android Setup" defaultOpen>
                      <CodeBlock code={`// Add to build.gradle (app level)
dependencies {
    implementation 'com.vuzix:ultralite-sdk:1.0.0'
    implementation 'com.contextlens:android-sdk:1.0.0'
}

// Add to AndroidManifest.xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.CAMERA" />`} language="kotlin" />
                    </ExpandableSection>

                    <ExpandableSection title="Initialize (Kotlin)">
                      <CodeBlock code={`import com.vuzix.ultralite.UltraliteSDK
import com.contextlens.sdk.ContextLens
import com.contextlens.sdk.adapters.VuzixZ100Adapter

class MainActivity : AppCompatActivity() {
    private lateinit var ultralite: UltraliteSDK
    private lateinit var contextLens: ContextLens

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize Vuzix SDK
        ultralite = UltraliteSDK.get(this)
        
        // Initialize ContextLens
        contextLens = ContextLens.Builder()
            .apiKey("YOUR_API_KEY")
            .adapter(VuzixZ100Adapter(ultralite))
            .build()
        
        contextLens.initialize()
    }
}`} language="kotlin" />
                    </ExpandableSection>

                    <ExpandableSection title="iOS Setup (Swift)">
                      <CodeBlock code={`// Add to Podfile
pod 'VuzixUltralite', '~> 1.0'
pod 'ContextLensSDK', '~> 1.0'

// Initialize in AppDelegate
import VuzixUltralite
import ContextLensSDK

class AppDelegate: UIResponder, UIApplicationDelegate {
    var contextLens: ContextLens!
    
    func application(_ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        let ultralite = VuzixUltralite.shared
        
        contextLens = ContextLens(
            apiKey: "YOUR_API_KEY",
            adapter: VuzixZ100Adapter(ultralite: ultralite)
        )
        
        return true
    }
}`} language="swift" />
                    </ExpandableSection>

                    <div className="flex gap-3">
                      <Button variant="hero" asChild>
                        <a href="https://github.com/Vuzix/ultralite-sdk-android" target="_blank" rel="noopener noreferrer">
                          Android SDK
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                      <Button variant="glass" asChild>
                        <a href="https://support.vuzix.com/docs/sdk-for-android" target="_blank" rel="noopener noreferrer">
                          <FileCode className="h-4 w-4 mr-2" />
                          Full Docs
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Rokid */}
              <TabsContent value="rokid" className="space-y-6">
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                        <Cpu className="h-6 w-6 text-violet-400" />
                      </div>
                      <div>
                        <CardTitle>Rokid Integration</CardTitle>
                        <CardDescription>UXR SDK • Tier 2 • On-Device Mode</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <p className="text-sm text-amber-200">
                        <strong>Note:</strong> Rokid SDK access requires joining the Developer Program.
                        Contact Rokid directly for access.
                      </p>
                    </div>

                    <ExpandableSection title="UXR SDK Setup" defaultOpen>
                      <CodeBlock code={`// Rokid UXR SDK integration
import com.rokid.uxr.UXRClient
import com.contextlens.sdk.ContextLens
import com.contextlens.sdk.adapters.RokidAdapter

class RokidActivity : Activity() {
    private lateinit var uxr: UXRClient
    private lateinit var contextLens: ContextLens

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize Rokid UXR
        uxr = UXRClient.Builder(this)
            .enableCamera(true)
            .enableSensors(true)
            .build()
        
        // Initialize ContextLens with native camera
        contextLens = ContextLens.Builder()
            .apiKey("YOUR_API_KEY")
            .adapter(RokidAdapter(uxr))
            .captureMode(CaptureMode.NATIVE)
            .build()
    }
}`} language="kotlin" />
                    </ExpandableSection>

                    <ExpandableSection title="Native Camera Access">
                      <CodeBlock code={`// Use native camera instead of phone
contextLens.setConfiguration(
    Configuration(
        captureSource = CaptureSource.NATIVE_CAMERA,
        frameRate = 5, // FPS
        resolution = Resolution.HD_720,
    )
)

// Handle native camera frames
contextLens.onCameraFrame { frame ->
    // Process frame locally or send to cloud
    val context = contextLens.analyzeFrame(frame)
    updateDisplay(context)
}`} language="kotlin" />
                    </ExpandableSection>

                    <Button variant="glass" asChild>
                      <a href="https://developer.rokid.com/" target="_blank" rel="noopener noreferrer">
                        Apply for Dev Access
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Phone Fallback */}
              <TabsContent value="phone" className="space-y-6">
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Smartphone className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle>Phone Fallback Mode</CardTitle>
                        <CardDescription>Tier 0 • Works with any glasses</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground">
                      When glasses don't have an open SDK or camera, ContextLens falls back to using 
                      your phone for both vision capture and prompt display.
                    </p>

                    <ExpandableSection title="React Native Setup" defaultOpen>
                      <CodeBlock code={`// Install packages
npm install @contextlens/react-native

// Initialize in App.tsx
import { ContextLensProvider, useContextLens } from '@contextlens/react-native';

function App() {
  return (
    <ContextLensProvider apiKey="YOUR_API_KEY">
      <PrompterScreen />
    </ContextLensProvider>
  );
}

function PrompterScreen() {
  const { startSession, currentPrompt, isActive } = useContextLens();
  
  return (
    <View style={styles.container}>
      <CameraView onFrame={(frame) => processFrame(frame)} />
      {currentPrompt && (
        <PromptOverlay prompt={currentPrompt} />
      )}
    </View>
  );
}`} language="typescript" />
                    </ExpandableSection>

                    <ExpandableSection title="Web Integration">
                      <CodeBlock code={`// Browser-based phone capture
import { ContextLens } from '@contextlens/web';

const contextLens = new ContextLens({
  apiKey: 'YOUR_API_KEY',
  outputMode: 'overlay', // 'overlay' | 'notification' | 'tts'
});

// Request camera permission
await contextLens.requestCameraAccess();

// Start session
await contextLens.startSession({
  onPromptReady: (prompt) => {
    // Display as overlay or send notification
    showPrompt(prompt);
  },
  onError: (error) => {
    console.error('Error:', error);
  },
});`} language="typescript" />
                    </ExpandableSection>

                    <ExpandableSection title="Output Modes">
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-secondary/50">
                          <h5 className="font-medium mb-1">Push Notifications</h5>
                          <p className="text-sm text-muted-foreground">
                            Prompts appear as rich notifications on the phone
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/50">
                          <h5 className="font-medium mb-1">Text-to-Speech (TTS)</h5>
                          <p className="text-sm text-muted-foreground">
                            Prompts are read aloud via earbuds connected to glasses
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/50">
                          <h5 className="font-medium mb-1">Screen Overlay</h5>
                          <p className="text-sm text-muted-foreground">
                            Floating prompter window on the phone screen
                          </p>
                        </div>
                      </div>
                    </ExpandableSection>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* REST API Endpoints */}
          <div className="max-w-5xl mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-8 text-center">
              REST API <span className="text-gradient">Reference</span>
            </h2>
            <APIEndpointsDocs />
          </div>

          {/* SDK API Reference */}
          <div className="max-w-5xl mx-auto mt-12">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Terminal className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>SDK Method Reference</CardTitle>
                    <CardDescription>Common methods available across all SDKs</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Core Methods</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 rounded bg-secondary/30 font-mono">
                        initialize() → Promise&lt;void&gt;
                      </div>
                      <div className="p-2 rounded bg-secondary/30 font-mono">
                        startSession(config) → Session
                      </div>
                      <div className="p-2 rounded bg-secondary/30 font-mono">
                        displayPrompt(prompt) → void
                      </div>
                      <div className="p-2 rounded bg-secondary/30 font-mono">
                        stopSession() → void
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Navigation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 rounded bg-secondary/30 font-mono">
                        nextBlock() → void
                      </div>
                      <div className="p-2 rounded bg-secondary/30 font-mono">
                        previousBlock() → void
                      </div>
                      <div className="p-2 rounded bg-secondary/30 font-mono">
                        pinCurrentBlock() → void
                      </div>
                      <div className="p-2 rounded bg-secondary/30 font-mono">
                        adjustSpeed(multiplier) → void
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <Button variant="hero">
                    Full API Docs
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button variant="glass">
                    <Code className="h-4 w-4 mr-2" />
                    API Playground
                  </Button>
                </div>
              </CardContent>
            </Card>
            </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default Documentation;

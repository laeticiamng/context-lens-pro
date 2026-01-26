import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink, Code, Smartphone, Glasses, Zap } from "lucide-react";

const CodeBlock = ({ code, language = "typescript" }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-secondary/50 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm">
        <code className="text-muted-foreground">{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
};

const Documentation = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container px-4">
          {/* Hero */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Developer Documentation
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              SDK Integration <span className="text-gradient">Guides</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn how to integrate ContextLens with supported smart glasses devices.
              Step-by-step guides for Even G2 and Vuzix Z100.
            </p>
          </div>

          {/* SDK Tabs */}
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="even-g2" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="even-g2" className="gap-2">
                  <Glasses className="h-4 w-4" />
                  Even G2
                </TabsTrigger>
                <TabsTrigger value="vuzix-z100" className="gap-2">
                  <Glasses className="h-4 w-4" />
                  Vuzix Z100
                </TabsTrigger>
              </TabsList>

              {/* Even G2 Documentation */}
              <TabsContent value="even-g2" className="space-y-8">
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
                  <CardContent className="space-y-8">
                    {/* Overview */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Overview</h3>
                      <p className="text-muted-foreground mb-4">
                        The Even G2 uses the Even Hub SDK (Flutter) to push text and images to its 
                        monochrome green HUD display. Since it has no camera, ContextLens uses 
                        your phone's camera for vision analysis.
                      </p>
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
                    </div>

                    {/* Prerequisites */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Prerequisites</h3>
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
                    </div>

                    {/* Installation */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">1. Install Dependencies</h3>
                      <CodeBlock code={`# Add to pubspec.yaml
dependencies:
  even_hub_sdk: ^1.0.0
  contextlens_flutter: ^1.0.0

# Then run
flutter pub get`} language="yaml" />
                    </div>

                    {/* Initialize */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">2. Initialize SDK</h3>
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
}`} />
                    </div>

                    {/* Display Content */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">3. Push Content to HUD</h3>
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
);`} />
                    </div>

                    {/* Input Handling */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">4. Handle User Input</h3>
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
});`} />
                    </div>

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

              {/* Vuzix Z100 Documentation */}
              <TabsContent value="vuzix-z100" className="space-y-8">
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
                  <CardContent className="space-y-8">
                    {/* Overview */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Overview</h3>
                      <p className="text-muted-foreground mb-4">
                        The Vuzix Z100 uses the Ultralite SDK for Android and iOS. It provides 
                        a monochrome display with 30° FOV. Like the Even G2, it relies on your 
                        phone's camera for vision analysis.
                      </p>
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
                    </div>

                    {/* Prerequisites */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Prerequisites</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-accent mt-1 shrink-0" />
                          Android Studio or Xcode for native development
                        </li>
                        <li className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-accent mt-1 shrink-0" />
                          Vuzix Ultralite SDK from GitHub
                        </li>
                        <li className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-accent mt-1 shrink-0" />
                          ContextLens API key (available in your dashboard)
                        </li>
                      </ul>
                    </div>

                    {/* Android Installation */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">1. Android Setup</h3>
                      <CodeBlock code={`// Add to build.gradle (app level)
dependencies {
    implementation 'com.vuzix:ultralite-sdk:1.0.0'
    implementation 'com.contextlens:android-sdk:1.0.0'
}

// Add to AndroidManifest.xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.CAMERA" />`} language="kotlin" />
                    </div>

                    {/* Initialize */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">2. Initialize SDK</h3>
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
                    </div>

                    {/* Display Content */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">3. Push Content to HUD</h3>
                      <CodeBlock code={`// Display a prompt
contextLens.displayPrompt(
    Prompt.Builder()
        .title("Sales Pitch")
        .addLine("Product features overview")
        .addLine("Pricing tiers")
        .addLine("Implementation timeline")
        .scrollSpeed(ScrollSpeed.MEDIUM)
        .build()
)

// Start contextual mode with camera
contextLens.startContextualMode(object : ContextCallback {
    override fun onPromptReady(prompt: Prompt) {
        Log.d("ContextLens", "Displaying: \${prompt.title}")
    }
    
    override fun onError(error: ContextError) {
        Log.e("ContextLens", "Error: \${error.message}")
    }
})`} language="kotlin" />
                    </div>

                    {/* iOS Setup */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">4. iOS Setup (Swift)</h3>
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
                    </div>

                    <div className="flex gap-3">
                      <Button variant="hero" asChild>
                        <a href="https://github.com/Vuzix/ultralite-sdk-android" target="_blank" rel="noopener noreferrer">
                          Android SDK
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                      <Button variant="glass" asChild>
                        <a href="https://support.vuzix.com/docs/sdk-for-android" target="_blank" rel="noopener noreferrer">
                          <Smartphone className="h-4 w-4 mr-2" />
                          View Docs
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* API Reference */}
            <Card className="glass-card border-border/50 mt-12">
              <CardHeader>
                <CardTitle>ContextLens API Reference</CardTitle>
                <CardDescription>Common methods available across all SDKs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 text-primary">Display Methods</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li><code className="text-foreground">displayPrompt(prompt)</code> - Show a prompt</li>
                      <li><code className="text-foreground">clearDisplay()</code> - Clear the HUD</li>
                      <li><code className="text-foreground">showNotification(text)</code> - Quick notification</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-primary">Navigation Methods</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li><code className="text-foreground">nextBlock()</code> - Advance to next block</li>
                      <li><code className="text-foreground">previousBlock()</code> - Go to previous block</li>
                      <li><code className="text-foreground">pinCurrentBlock()</code> - Pin current block</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-primary">Context Methods</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li><code className="text-foreground">startContextualMode()</code> - Enable vision</li>
                      <li><code className="text-foreground">stopContextualMode()</code> - Disable vision</li>
                      <li><code className="text-foreground">setTags(tags[])</code> - Filter content</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-primary">Configuration</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li><code className="text-foreground">adjustSpeed(factor)</code> - Set scroll speed</li>
                      <li><code className="text-foreground">setLanguage(code)</code> - Set OCR language</li>
                      <li><code className="text-foreground">enableOfflineMode()</code> - Work offline</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;

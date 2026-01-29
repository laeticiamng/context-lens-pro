import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Copy, 
  Check, 
  Terminal, 
  Smartphone,
  Globe,
  Package,
  FileCode,
  Zap,
  Shield,
  BookOpen
} from "lucide-react";

const SDKDocumentation = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Quick Start</p>
              <p className="text-xs text-muted-foreground">Get up and running in 5 minutes with our SDKs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Shield className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-medium text-sm">Type-Safe</p>
              <p className="text-xs text-muted-foreground">Full TypeScript support with auto-generated types</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <BookOpen className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="font-medium text-sm">Auto-Generated</p>
              <p className="text-xs text-muted-foreground">SDKs generated from OpenAPI 3.1.0 spec</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SDK Tabs */}
      <Tabs defaultValue="typescript" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="typescript" className="gap-1.5 text-xs">
            <FileCode className="h-3.5 w-3.5" />
            TypeScript
          </TabsTrigger>
          <TabsTrigger value="python" className="gap-1.5 text-xs">
            <Terminal className="h-3.5 w-3.5" />
            Python
          </TabsTrigger>
          <TabsTrigger value="flutter" className="gap-1.5 text-xs">
            <Smartphone className="h-3.5 w-3.5" />
            Flutter
          </TabsTrigger>
          <TabsTrigger value="swift" className="gap-1.5 text-xs">
            <Smartphone className="h-3.5 w-3.5" />
            Swift
          </TabsTrigger>
          <TabsTrigger value="kotlin" className="gap-1.5 text-xs">
            <Smartphone className="h-3.5 w-3.5" />
            Kotlin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="typescript">
          <SDKSection
            language="TypeScript"
            packageName="@contextlens/sdk"
            version="1.0.0"
            installCommand="npm install @contextlens/sdk"
            copyCode={copyCode}
            copiedId={copiedId}
            examples={[
              {
                title: "Installation",
                code: `# Using npm
npm install @contextlens/sdk

# Using yarn
yarn add @contextlens/sdk

# Using pnpm
pnpm add @contextlens/sdk`
              },
              {
                title: "Initialize Client",
                code: `import { ContextLensClient } from '@contextlens/sdk';

const client = new ContextLensClient({
  apiKey: process.env.CONTEXTLENS_API_KEY,
  baseUrl: 'https://api.contextlens.io/v1', // optional
});`
              },
              {
                title: "Authentication",
                code: `// Sign up a new user
const { user, session } = await client.auth.signUp({
  email: 'user@example.com',
  password: 'SecurePassword123!',
  displayName: 'John Doe'
});

// Sign in existing user
const { accessToken } = await client.auth.signIn({
  email: 'user@example.com',
  password: 'SecurePassword123!'
});

// Sign out
await client.auth.signOut();`
              },
              {
                title: "Scripts CRUD",
                code: `// List all scripts
const { scripts, total } = await client.scripts.list({
  page: 1,
  limit: 20,
  search: 'sales',
  tags: ['meeting', 'pitch']
});

// Create a new script
const newScript = await client.scripts.create({
  title: 'Sales Pitch Q1',
  content: 'Welcome to our presentation...',
  tags: ['sales', 'quarterly']
});

// Update a script
const updated = await client.scripts.update(scriptId, {
  title: 'Updated Sales Pitch',
  isActive: true
});

// Delete a script
await client.scripts.delete(scriptId);`
              },
              {
                title: "Device Management",
                code: `// List connected devices
const { devices } = await client.devices.list();

// Pair a new device
const { pairingCode, expiresIn } = await client.devices.pair({
  deviceType: 'even_g2',
  connectionMode: 'bluetooth'
});

// Push content to device
await client.display.push(deviceId, {
  title: 'Meeting Notes',
  lines: ['Point 1', 'Point 2', 'Point 3'],
  scrollSpeed: 'medium'
});`
              },
              {
                title: "Context Analysis",
                code: `// Analyze an image for context
const { context, matchedScripts } = await client.context.analyze({
  image: base64EncodedImage,
  options: {
    ocr: true,
    entities: true,
    scene: true
  }
});

console.log(context.text);       // Extracted text
console.log(context.entities);   // ['person', 'laptop']
console.log(context.scene);      // 'office_meeting'
console.log(matchedScripts);     // Relevant scripts`
              },
              {
                title: "MRI / Vision IRM",
                code: `// List MRI scans
const { scans } = await client.mri.scans.list({
  cabinetId: 'cabinet-uuid',
  status: 'completed'
});

// Create a new scan
const scan = await client.mri.scans.create({
  cabinetId: 'cabinet-uuid',
  deviceId: 'device-uuid',
  patientReference: 'PAT-2026-001',
  protocolId: 'full_body_screen'
});

// Generate report
const { reportUrl } = await client.mri.reports.generate(scanId);`
              },
              {
                title: "Error Handling",
                code: `import { ContextLensError, RateLimitError } from '@contextlens/sdk';

try {
  const scripts = await client.scripts.list();
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(\`Rate limited. Retry after \${error.retryAfter}s\`);
  } else if (error instanceof ContextLensError) {
    console.log(\`API Error: \${error.message} (code: \${error.code})\`);
  }
}`
              },
              {
                title: "TypeScript Types",
                code: `import type { 
  Script, 
  Device, 
  MRIScan,
  ContextAnalysis,
  CreateScriptRequest,
  PaginatedResponse
} from '@contextlens/sdk';

// Fully typed responses
const scripts: PaginatedResponse<Script> = await client.scripts.list();

// Type-safe request objects
const request: CreateScriptRequest = {
  title: 'My Script',
  content: 'Content here...',
  tags: ['tag1', 'tag2']
};`
              }
            ]}
          />
        </TabsContent>

        <TabsContent value="python">
          <SDKSection
            language="Python"
            packageName="contextlens"
            version="1.0.0"
            installCommand="pip install contextlens"
            copyCode={copyCode}
            copiedId={copiedId}
            examples={[
              {
                title: "Installation",
                code: `# Using pip
pip install contextlens

# Using poetry
poetry add contextlens`
              },
              {
                title: "Initialize Client",
                code: `from contextlens import ContextLensClient
import os

client = ContextLensClient(
    api_key=os.environ["CONTEXTLENS_API_KEY"],
    base_url="https://api.contextlens.io/v1"  # optional
)`
              },
              {
                title: "Scripts Management",
                code: `# List all scripts
scripts = client.scripts.list(
    page=1,
    limit=20,
    search="sales"
)

# Create a new script
new_script = client.scripts.create(
    title="Sales Pitch Q1",
    content="Welcome to our presentation...",
    tags=["sales", "quarterly"]
)

# Update a script
updated = client.scripts.update(
    script_id,
    title="Updated Title",
    is_active=True
)

# Delete a script
client.scripts.delete(script_id)`
              },
              {
                title: "Async Support",
                code: `from contextlens import AsyncContextLensClient
import asyncio

async def main():
    client = AsyncContextLensClient(api_key="...")
    
    scripts = await client.scripts.list()
    
    # Concurrent requests
    results = await asyncio.gather(
        client.scripts.get(id1),
        client.scripts.get(id2),
        client.scripts.get(id3)
    )

asyncio.run(main())`
              },
              {
                title: "Error Handling",
                code: `from contextlens.exceptions import (
    ContextLensError,
    AuthenticationError,
    RateLimitError,
    ValidationError
)

try:
    scripts = client.scripts.list()
except RateLimitError as e:
    print(f"Rate limited. Retry after {e.retry_after}s")
except AuthenticationError:
    print("Invalid API key")
except ContextLensError as e:
    print(f"API Error: {e.message}")`
              }
            ]}
          />
        </TabsContent>

        <TabsContent value="flutter">
          <SDKSection
            language="Flutter"
            packageName="contextlens_flutter"
            version="1.0.0"
            installCommand="flutter pub add contextlens_flutter"
            copyCode={copyCode}
            copiedId={copiedId}
            examples={[
              {
                title: "Installation",
                code: `# Add to pubspec.yaml
dependencies:
  contextlens_flutter: ^1.0.0

# Or run
flutter pub add contextlens_flutter`
              },
              {
                title: "Initialize Client",
                code: `import 'package:contextlens_flutter/contextlens_flutter.dart';

final client = ContextLensClient(
  apiKey: 'your-api-key',
  baseUrl: 'https://api.contextlens.io/v1',
);`
              },
              {
                title: "Device Pairing (Even G2)",
                code: `// Pair with Even G2 smart glasses
final pairing = await client.devices.pair(
  deviceType: DeviceType.evenG2,
  connectionMode: ConnectionMode.bluetooth,
);

print('Pairing code: \${pairing.pairingCode}');
print('Expires in: \${pairing.expiresIn}s');

// Listen for connection status
client.devices.onConnectionChange.listen((device) {
  print('Device \${device.name}: \${device.isConnected}');
});`
              },
              {
                title: "Push to HUD Display",
                code: `// Push content to smart glasses
await client.display.push(
  deviceId: device.id,
  content: DisplayContent(
    title: 'Meeting Notes',
    lines: ['Point 1', 'Point 2', 'Point 3'],
    scrollSpeed: ScrollSpeed.medium,
  ),
);

// Clear display
await client.display.clear(deviceId: device.id);`
              },
              {
                title: "Flutter Widgets",
                code: `import 'package:contextlens_flutter/widgets.dart';

// Script list widget
ScriptListView(
  client: client,
  onScriptTap: (script) => print(script.title),
)

// Device status indicator
DeviceStatusIndicator(
  device: device,
  showBattery: true,
)

// HUD preview
HUDPreview(
  content: displayContent,
  tier: DeviceTier.tier2,
)`
              }
            ]}
          />
        </TabsContent>

        <TabsContent value="swift">
          <SDKSection
            language="Swift"
            packageName="ContextLensSDK"
            version="1.0.0"
            installCommand="pod 'ContextLensSDK' # or Swift Package Manager"
            copyCode={copyCode}
            copiedId={copiedId}
            examples={[
              {
                title: "Installation (SPM)",
                code: `// Package.swift
dependencies: [
    .package(
        url: "https://github.com/contextlens/contextlens-swift.git",
        from: "1.0.0"
    )
]

// Or via Xcode: File > Add Packages...
// Enter: https://github.com/contextlens/contextlens-swift.git`
              },
              {
                title: "Initialize Client",
                code: `import ContextLensSDK

let client = ContextLensClient(
    apiKey: "your-api-key",
    baseURL: URL(string: "https://api.contextlens.io/v1")!
)`
              },
              {
                title: "Scripts Management",
                code: `// List scripts
let response = try await client.scripts.list(
    page: 1,
    limit: 20,
    search: "sales"
)

for script in response.scripts {
    print(script.title)
}

// Create script
let newScript = try await client.scripts.create(
    CreateScriptRequest(
        title: "Sales Pitch",
        content: "Welcome...",
        tags: ["sales"]
    )
)`
              },
              {
                title: "Device Integration",
                code: `// Pair with smart glasses
let pairing = try await client.devices.pair(
    deviceType: .vuzixZ100,
    connectionMode: .bluetooth
)

// Push to display
try await client.display.push(
    deviceId: device.id,
    content: DisplayContent(
        title: "Notes",
        lines: ["Line 1", "Line 2"],
        scrollSpeed: .medium
    )
)`
              },
              {
                title: "Combine Integration",
                code: `import Combine

// Reactive device status
client.devices.connectionStatus
    .sink { status in
        print("Connection: \\(status)")
    }
    .store(in: &cancellables)

// Script updates publisher
client.scripts.updates
    .receive(on: DispatchQueue.main)
    .sink { scripts in
        self.scripts = scripts
    }
    .store(in: &cancellables)`
              }
            ]}
          />
        </TabsContent>

        <TabsContent value="kotlin">
          <SDKSection
            language="Kotlin"
            packageName="io.contextlens:sdk"
            version="1.0.0"
            installCommand="implementation 'io.contextlens:sdk:1.0.0'"
            copyCode={copyCode}
            copiedId={copiedId}
            examples={[
              {
                title: "Installation (Gradle)",
                code: `// build.gradle.kts
dependencies {
    implementation("io.contextlens:sdk:1.0.0")
}

// Or Maven
<dependency>
    <groupId>io.contextlens</groupId>
    <artifactId>sdk</artifactId>
    <version>1.0.0</version>
</dependency>`
              },
              {
                title: "Initialize Client",
                code: `import io.contextlens.sdk.ContextLensClient

val client = ContextLensClient(
    apiKey = "your-api-key",
    baseUrl = "https://api.contextlens.io/v1"
)`
              },
              {
                title: "Coroutines Support",
                code: `import kotlinx.coroutines.*

// Suspend functions
suspend fun loadScripts() {
    val response = client.scripts.list(
        page = 1,
        limit = 20,
        search = "sales"
    )
    
    response.scripts.forEach { script ->
        println(script.title)
    }
}

// Flow for real-time updates
client.devices.connectionFlow
    .collect { status ->
        println("Device status: $status")
    }`
              },
              {
                title: "Android Integration",
                code: `// ViewModel
class ScriptsViewModel : ViewModel() {
    private val client = ContextLensClient(apiKey = "...")
    
    private val _scripts = MutableStateFlow<List<Script>>(emptyList())
    val scripts: StateFlow<List<Script>> = _scripts.asStateFlow()
    
    fun loadScripts() {
        viewModelScope.launch {
            val response = client.scripts.list()
            _scripts.value = response.scripts
        }
    }
}

// Compose UI
@Composable
fun ScriptsList(viewModel: ScriptsViewModel) {
    val scripts by viewModel.scripts.collectAsState()
    
    LazyColumn {
        items(scripts) { script ->
            ScriptCard(script = script)
        }
    }
}`
              },
              {
                title: "Error Handling",
                code: `import io.contextlens.sdk.exceptions.*

try {
    val scripts = client.scripts.list()
} catch (e: RateLimitException) {
    println("Rate limited. Retry after \${e.retryAfter}s")
} catch (e: AuthenticationException) {
    println("Invalid API key")
} catch (e: ContextLensException) {
    println("API Error: \${e.message}")
}`
              }
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface SDKSectionProps {
  language: string;
  packageName: string;
  version: string;
  installCommand: string;
  examples: { title: string; code: string }[];
  copyCode: (code: string, id: string) => void;
  copiedId: string | null;
}

const SDKSection = ({ 
  language, 
  packageName, 
  version, 
  installCommand,
  examples, 
  copyCode, 
  copiedId 
}: SDKSectionProps) => (
  <Card className="glass-card border-border/50">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {language} SDK
          </CardTitle>
          <CardDescription>
            <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">{packageName}</code>
            {" • "}
            <span className="text-xs">v{version}</span>
          </CardDescription>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
          Stable
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-6">
          {examples.map((example, i) => {
            const id = `${language}-${i}`;
            return (
              <div key={i} className="relative group">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">{example.title}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyCode(example.code, id)}
                  >
                    {copiedId === id ? (
                      <><Check className="h-3 w-3 mr-1 text-accent" /> Copied</>
                    ) : (
                      <><Copy className="h-3 w-3 mr-1" /> Copy</>
                    )}
                  </Button>
                </div>
                <pre className="text-xs bg-secondary/50 p-4 rounded-lg overflow-x-auto border border-border/30">
                  <code className="text-foreground/90">{example.code}</code>
                </pre>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
);

export default SDKDocumentation;

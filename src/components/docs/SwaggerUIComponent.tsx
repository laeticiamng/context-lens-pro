import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronDown, 
  ChevronRight, 
  Lock, 
  Unlock, 
  Play,
  Copy,
  Check,
  Server
} from "lucide-react";

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  summary: string;
  description: string;
  tags: string[];
  auth: boolean;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
}

interface Parameter {
  name: string;
  in: "path" | "query" | "header";
  required: boolean;
  type: string;
  description: string;
}

interface RequestBody {
  contentType: string;
  schema: string;
  example: string;
}

interface Response {
  description: string;
  example?: string;
}

const endpoints: Endpoint[] = [
  // Auth
  {
    method: "POST",
    path: "/auth/signup",
    summary: "User Registration",
    description: "Create a new user account with email and password",
    tags: ["Authentication"],
    auth: false,
    requestBody: {
      contentType: "application/json",
      schema: "SignupRequest",
      example: `{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "display_name": "John Doe"
}`
    },
    responses: {
      "201": { description: "User created successfully", example: `{ "user": { "id": "uuid", "email": "user@example.com" }, "session": { "access_token": "..." } }` },
      "400": { description: "Invalid request body" },
      "409": { description: "Email already registered" }
    }
  },
  {
    method: "POST",
    path: "/auth/login",
    summary: "User Login",
    description: "Authenticate user and receive access token",
    tags: ["Authentication"],
    auth: false,
    requestBody: {
      contentType: "application/json",
      schema: "LoginRequest",
      example: `{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}`
    },
    responses: {
      "200": { description: "Login successful", example: `{ "access_token": "eyJ...", "refresh_token": "...", "expires_in": 3600 }` },
      "401": { description: "Invalid credentials" }
    }
  },
  // Scripts
  {
    method: "GET",
    path: "/scripts",
    summary: "List Scripts",
    description: "Retrieve all scripts for the authenticated user with pagination",
    tags: ["Scripts"],
    auth: true,
    parameters: [
      { name: "page", in: "query", required: false, type: "integer", description: "Page number (default: 1)" },
      { name: "limit", in: "query", required: false, type: "integer", description: "Items per page (default: 20, max: 100)" },
      { name: "search", in: "query", required: false, type: "string", description: "Search in title and content" },
      { name: "tags", in: "query", required: false, type: "string", description: "Filter by tags (comma-separated)" }
    ],
    responses: {
      "200": { description: "Scripts list", example: `{ "scripts": [...], "total": 42, "page": 1, "pages": 3 }` },
      "401": { description: "Unauthorized" }
    }
  },
  {
    method: "POST",
    path: "/scripts",
    summary: "Create Script",
    description: "Create a new teleprompter script",
    tags: ["Scripts"],
    auth: true,
    requestBody: {
      contentType: "application/json",
      schema: "CreateScriptRequest",
      example: `{
  "title": "Sales Pitch Q1",
  "content": "Welcome to our presentation...",
  "tags": ["sales", "quarterly"]
}`
    },
    responses: {
      "201": { description: "Script created", example: `{ "id": "uuid", "title": "Sales Pitch Q1", "created_at": "2026-01-29T..." }` },
      "400": { description: "Validation error" },
      "401": { description: "Unauthorized" }
    }
  },
  {
    method: "GET",
    path: "/scripts/{id}",
    summary: "Get Script",
    description: "Retrieve a specific script by ID",
    tags: ["Scripts"],
    auth: true,
    parameters: [
      { name: "id", in: "path", required: true, type: "uuid", description: "Script UUID" }
    ],
    responses: {
      "200": { description: "Script details" },
      "404": { description: "Script not found" }
    }
  },
  {
    method: "PUT",
    path: "/scripts/{id}",
    summary: "Update Script",
    description: "Update an existing script",
    tags: ["Scripts"],
    auth: true,
    parameters: [
      { name: "id", in: "path", required: true, type: "uuid", description: "Script UUID" }
    ],
    requestBody: {
      contentType: "application/json",
      schema: "UpdateScriptRequest",
      example: `{
  "title": "Updated Title",
  "content": "Updated content...",
  "is_active": true
}`
    },
    responses: {
      "200": { description: "Script updated" },
      "404": { description: "Script not found" }
    }
  },
  {
    method: "DELETE",
    path: "/scripts/{id}",
    summary: "Delete Script",
    description: "Permanently delete a script",
    tags: ["Scripts"],
    auth: true,
    parameters: [
      { name: "id", in: "path", required: true, type: "uuid", description: "Script UUID" }
    ],
    responses: {
      "204": { description: "Script deleted" },
      "404": { description: "Script not found" }
    }
  },
  // Devices
  {
    method: "GET",
    path: "/devices",
    summary: "List Devices",
    description: "Get all connected smart glasses and HUD devices",
    tags: ["Devices"],
    auth: true,
    responses: {
      "200": { description: "Devices list", example: `{ "devices": [{ "id": "uuid", "device_name": "Even G2", "tier": 2, "is_connected": true }] }` }
    }
  },
  {
    method: "POST",
    path: "/devices/pair",
    summary: "Pair Device",
    description: "Initiate Bluetooth pairing with a smart glasses device",
    tags: ["Devices"],
    auth: true,
    requestBody: {
      contentType: "application/json",
      schema: "PairDeviceRequest",
      example: `{
  "device_type": "even_g2",
  "connection_mode": "bluetooth"
}`
    },
    responses: {
      "200": { description: "Pairing initiated", example: `{ "pairing_code": "123456", "expires_in": 300 }` }
    }
  },
  // MRI
  {
    method: "GET",
    path: "/mri/scans",
    summary: "List MRI Scans",
    description: "Retrieve MRI scans for the cabinet",
    tags: ["MRI / Vision IRM"],
    auth: true,
    parameters: [
      { name: "cabinet_id", in: "query", required: true, type: "uuid", description: "Cabinet UUID" },
      { name: "status", in: "query", required: false, type: "string", description: "Filter by status" }
    ],
    responses: {
      "200": { description: "Scans list" }
    }
  },
  {
    method: "POST",
    path: "/mri/scans",
    summary: "Create MRI Scan",
    description: "Initiate a new MRI scan session",
    tags: ["MRI / Vision IRM"],
    auth: true,
    requestBody: {
      contentType: "application/json",
      schema: "CreateScanRequest",
      example: `{
  "cabinet_id": "uuid",
  "device_id": "uuid",
  "patient_reference": "PAT-2026-001",
  "protocol_id": "full_body_screen"
}`
    },
    responses: {
      "201": { description: "Scan created" }
    }
  },
  // Waitlist
  {
    method: "POST",
    path: "/waitlist",
    summary: "Join Waitlist",
    description: "Add email to the product waitlist",
    tags: ["Waitlist"],
    auth: false,
    requestBody: {
      contentType: "application/json",
      schema: "WaitlistRequest",
      example: `{
  "email": "interested@example.com",
  "source": "landing_page"
}`
    },
    responses: {
      "201": { description: "Added to waitlist" },
      "409": { description: "Email already registered" }
    }
  }
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  POST: "bg-primary/10 text-primary border-primary/30",
  PUT: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  DELETE: "bg-destructive/10 text-destructive border-destructive/30",
  PATCH: "bg-violet-500/10 text-violet-500 border-violet-500/30",
};

const SwaggerUIComponent = () => {
  const [openEndpoints, setOpenEndpoints] = useState<Set<string>>(new Set());
  const [apiKey, setApiKey] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleEndpoint = (id: string) => {
    const newOpen = new Set(openEndpoints);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenEndpoints(newOpen);
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
    const tag = endpoint.tags[0] || "Other";
    if (!acc[tag]) acc[tag] = [];
    acc[tag].push(endpoint);
    return acc;
  }, {} as Record<string, Endpoint[]>);

  return (
    <div className="space-y-6">
      {/* Server & Auth Configuration */}
      <Card className="glass-card border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                API Configuration
              </CardTitle>
              <CardDescription>Base URL and authentication</CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
              v1.0.0
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Base URL</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 rounded-lg bg-secondary/50 text-sm font-mono">
                  https://api.contextlens.io/v1
                </code>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">API Key</label>
              <Input
                type="password"
                placeholder="Enter your API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <ScrollArea className="h-[700px]">
        <div className="space-y-6 pr-4">
          {Object.entries(groupedEndpoints).map(([tag, tagEndpoints]) => (
            <Card key={tag} className="glass-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{tag}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tagEndpoints.map((endpoint, i) => {
                  const id = `${endpoint.method}-${endpoint.path}-${i}`;
                  const isOpen = openEndpoints.has(id);
                  
                  return (
                    <Collapsible key={id} open={isOpen} onOpenChange={() => toggleEndpoint(id)}>
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors">
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <Badge 
                            variant="outline" 
                            className={`font-mono text-xs w-16 justify-center ${methodColors[endpoint.method]}`}
                          >
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono flex-1">{endpoint.path}</code>
                          <span className="text-sm text-muted-foreground">{endpoint.summary}</span>
                          {endpoint.auth ? (
                            <Lock className="h-4 w-4 text-amber-500" />
                          ) : (
                            <Unlock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-3 pb-3">
                        <div className="mt-3 p-4 rounded-lg bg-secondary/20 space-y-4">
                          <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                          
                          {/* Parameters */}
                          {endpoint.parameters && endpoint.parameters.length > 0 && (
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground mb-2">Parameters</h4>
                              <div className="space-y-1">
                                {endpoint.parameters.map((param, pi) => (
                                  <div key={pi} className="flex items-center gap-2 text-xs">
                                    <code className="px-1.5 py-0.5 rounded bg-secondary">{param.name}</code>
                                    <Badge variant="outline" className="text-[10px]">{param.in}</Badge>
                                    <span className="text-muted-foreground">{param.type}</span>
                                    {param.required && <Badge variant="destructive" className="text-[10px]">required</Badge>}
                                    <span className="text-muted-foreground">— {param.description}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Request Body */}
                          {endpoint.requestBody && (
                            <div className="relative group">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-medium text-muted-foreground">Request Body</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyCode(endpoint.requestBody!.example, `req-${id}`);
                                  }}
                                >
                                  {copiedId === `req-${id}` ? (
                                    <><Check className="h-3 w-3 mr-1 text-accent" /> Copied</>
                                  ) : (
                                    <><Copy className="h-3 w-3 mr-1" /> Copy</>
                                  )}
                                </Button>
                              </div>
                              <pre className="text-xs bg-background/50 p-3 rounded-lg overflow-x-auto border border-border/30">
                                <code>{endpoint.requestBody.example}</code>
                              </pre>
                            </div>
                          )}

                          {/* Responses */}
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">Responses</h4>
                            <div className="space-y-2">
                              {Object.entries(endpoint.responses).map(([code, response]) => (
                                <div key={code} className="relative group">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge 
                                      variant="outline" 
                                      className={code.startsWith("2") ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}
                                    >
                                      {code}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{response.description}</span>
                                  </div>
                                  {response.example && (
                                    <pre className="text-xs bg-background/50 p-2 rounded-lg overflow-x-auto border border-border/30">
                                      <code>{response.example}</code>
                                    </pre>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Try it out button */}
                          <div className="flex justify-end pt-2">
                            <Button size="sm" variant="outline" className="gap-2" disabled={endpoint.auth && !apiKey}>
                              <Play className="h-3.5 w-3.5" />
                              Try it out
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SwaggerUIComponent;

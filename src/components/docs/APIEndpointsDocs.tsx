import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  Lock, 
  Unlock,
  ArrowRight,
  Copy,
  Check
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  auth: boolean;
  request?: string;
  response: string;
}

const endpoints: Record<string, Endpoint[]> = {
  scripts: [
    {
      method: "GET",
      path: "/api/v1/scripts",
      description: "List all scripts for the authenticated user",
      auth: true,
      response: `{
  "scripts": [
    {
      "id": "uuid",
      "title": "Sales Pitch",
      "content": "...",
      "tags": ["sales", "meeting"],
      "is_active": true,
      "usage_count": 42,
      "created_at": "2026-01-15T10:00:00Z"
    }
  ],
  "total": 10,
  "page": 1
}`,
    },
    {
      method: "POST",
      path: "/api/v1/scripts",
      description: "Create a new script",
      auth: true,
      request: `{
  "title": "New Script",
  "content": "Your script content here...",
  "tags": ["tag1", "tag2"]
}`,
      response: `{
  "id": "uuid",
  "title": "New Script",
  "created_at": "2026-01-26T10:00:00Z"
}`,
    },
    {
      method: "PUT",
      path: "/api/v1/scripts/:id",
      description: "Update an existing script",
      auth: true,
      request: `{
  "title": "Updated Title",
  "content": "Updated content...",
  "is_active": false
}`,
      response: `{
  "id": "uuid",
  "updated_at": "2026-01-26T10:00:00Z"
}`,
    },
    {
      method: "DELETE",
      path: "/api/v1/scripts/:id",
      description: "Delete a script",
      auth: true,
      response: `{
  "success": true
}`,
    },
  ],
  devices: [
    {
      method: "GET",
      path: "/api/v1/devices",
      description: "List connected devices",
      auth: true,
      response: `{
  "devices": [
    {
      "id": "uuid",
      "device_name": "Even G2",
      "device_type": "smart_glasses",
      "tier": 1,
      "is_connected": true
    }
  ]
}`,
    },
    {
      method: "POST",
      path: "/api/v1/devices/pair",
      description: "Initiate device pairing",
      auth: true,
      request: `{
  "device_type": "even_g2",
  "connection_mode": "bluetooth"
}`,
      response: `{
  "pairing_code": "123456",
  "expires_in": 300
}`,
    },
  ],
  context: [
    {
      method: "POST",
      path: "/api/v1/context/analyze",
      description: "Analyze an image for context",
      auth: true,
      request: `{
  "image": "base64_encoded_image",
  "options": {
    "ocr": true,
    "entities": true,
    "scene": true
  }
}`,
      response: `{
  "context": {
    "text": "Extracted text...",
    "entities": ["person", "laptop", "meeting_room"],
    "scene": "office_meeting",
    "language": "en",
    "confidence": 0.95
  },
  "matched_scripts": [
    {
      "id": "uuid",
      "title": "Meeting Notes",
      "relevance_score": 0.87
    }
  ]
}`,
    },
  ],
  display: [
    {
      method: "POST",
      path: "/api/v1/display/push",
      description: "Push content to device display",
      auth: true,
      request: `{
  "device_id": "uuid",
  "content": {
    "title": "Sales Pitch",
    "lines": ["Line 1", "Line 2", "Line 3"],
    "scroll_speed": "medium"
  }
}`,
      response: `{
  "displayed": true,
  "display_id": "uuid"
}`,
    },
  ],
};

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  POST: "bg-primary/10 text-primary border-primary/30",
  PUT: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  DELETE: "bg-destructive/10 text-destructive border-destructive/30",
  PATCH: "bg-violet-500/10 text-violet-500 border-violet-500/30",
};

const APIEndpointsDocs = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyEndpoint = (path: string) => {
    navigator.clipboard.writeText(`https://api.contextlens.io${path}`);
    setCopiedEndpoint(path);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          API Endpoints
        </CardTitle>
        <CardDescription>
          RESTful API reference for integrating ContextLens
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scripts" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="context">Context</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
          </TabsList>

          {Object.entries(endpoints).map(([category, categoryEndpoints]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {categoryEndpoints.map((endpoint, i) => (
                <div 
                  key={i}
                  className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={`font-mono text-xs ${methodColors[endpoint.method]}`}
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono flex-1">{endpoint.path}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7"
                      onClick={() => copyEndpoint(endpoint.path)}
                    >
                      {copiedEndpoint === endpoint.path ? (
                        <Check className="h-3.5 w-3.5 text-accent" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    {endpoint.auth ? (
                      <Lock className="h-4 w-4 text-amber-500" aria-label="Requires authentication" />
                    ) : (
                      <Unlock className="h-4 w-4 text-muted-foreground" aria-label="Public endpoint" />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>

                  {endpoint.request && (
                    <div className="relative group">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-muted-foreground">Request Body</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyCode(endpoint.request!, `req-${i}`)}
                        >
                          {copiedCode === `req-${i}` ? (
                            <><Check className="h-3 w-3 mr-1 text-accent" /> Copied</>
                          ) : (
                            <><Copy className="h-3 w-3 mr-1" /> Copy</>
                          )}
                        </Button>
                      </div>
                      <pre className="text-xs bg-secondary/50 p-3 rounded-lg overflow-x-auto">
                        <code>{endpoint.request}</code>
                      </pre>
                    </div>
                  )}

                  <div className="relative group">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-muted-foreground">Response</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyCode(endpoint.response, `res-${i}`)}
                      >
                        {copiedCode === `res-${i}` ? (
                          <><Check className="h-3 w-3 mr-1 text-accent" /> Copied</>
                        ) : (
                          <><Copy className="h-3 w-3 mr-1" /> Copy</>
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs bg-secondary/50 p-3 rounded-lg overflow-x-auto">
                      <code>{endpoint.response}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-primary">Base URL:</span>{" "}
            <code className="bg-secondary px-1.5 py-0.5 rounded">https://api.contextlens.io/v1</code>
            {" • "}All authenticated endpoints require the <code className="bg-secondary px-1.5 py-0.5 rounded">Authorization: Bearer YOUR_API_KEY</code> header.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIEndpointsDocs;

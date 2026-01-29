// Edge Function: Generate MRI Scan Report PDF
// Uses Lovable AI Gateway for report generation

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReportRequest {
  scan_id: string;
  format?: 'json' | 'markdown' | 'html';
  language?: 'fr' | 'en';
}

interface ScanData {
  id: string;
  patient_reference: string;
  protocol_id: string;
  body_zones: string[];
  anomalies_detected: number;
  risk_level: string;
  findings: Record<string, any>;
  duration_seconds: number;
  completed_at: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with user's auth
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get request body
    const { scan_id, format = 'json', language = 'fr' }: ReportRequest = await req.json();

    if (!scan_id) {
      return new Response(
        JSON.stringify({ error: "scan_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch scan data using secure RPC function
    const { data: scanData, error: scanError } = await supabase
      .rpc('get_patient_scan_details', { scan_id });

    if (scanError || !scanData || scanData.length === 0) {
      console.error("[generate-report] Scan fetch error:", scanError);
      return new Response(
        JSON.stringify({ error: "Scan not found or unauthorized" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const scan = scanData[0];
    console.log("[generate-report] Processing scan:", scan.id);

    // Generate report content based on format
    const reportContent = generateReportContent(scan, language, format);

    // For AI-enhanced reports (optional, uses LOVABLE_API_KEY if available)
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    let aiSummary: string | null = null;

    if (lovableApiKey && scan.findings) {
      try {
        aiSummary = await generateAISummary(scan, language, lovableApiKey);
      } catch (aiError) {
        console.warn("[generate-report] AI summary failed, using default:", aiError);
      }
    }

    const response = {
      report_id: `RPT-${scan.id.slice(0, 8)}`,
      generated_at: new Date().toISOString(),
      format,
      language,
      content: reportContent,
      ai_summary: aiSummary,
      metadata: {
        scan_id: scan.id,
        patient_reference_masked: maskPatientRef(scan.patient_reference),
      }
    };

    console.log("[generate-report] Report generated successfully");

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("[generate-report] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function maskPatientRef(ref: string): string {
  if (!ref || ref.length <= 5) return "****";
  return ref.slice(0, 3) + "***" + ref.slice(-2);
}

function generateReportContent(
  scan: { id: string; patient_reference: string; findings: any; report_url: string },
  language: string,
  format: string
): string {
  const t = {
    title: language === 'fr' ? 'Rapport de Scan IRM' : 'MRI Scan Report',
    patient: language === 'fr' ? 'Référence Patient' : 'Patient Reference',
    findings: language === 'fr' ? 'Résultats' : 'Findings',
    noFindings: language === 'fr' ? 'Aucune anomalie détectée' : 'No anomalies detected',
    disclaimer: language === 'fr' 
      ? 'Ce rapport est généré automatiquement et doit être validé par un professionnel de santé.'
      : 'This report is automatically generated and must be validated by a healthcare professional.',
  };

  const patientRef = maskPatientRef(scan.patient_reference);
  const findingsText = scan.findings 
    ? JSON.stringify(scan.findings, null, 2) 
    : t.noFindings;

  if (format === 'markdown') {
    return `# ${t.title}

**${t.patient}:** ${patientRef}

## ${t.findings}

\`\`\`json
${findingsText}
\`\`\`

---

*${t.disclaimer}*
`;
  }

  if (format === 'html') {
    return `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <title>${t.title}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 1rem; }
    h1 { color: #1a1a2e; }
    .findings { background: #f5f5f5; padding: 1rem; border-radius: 8px; }
    .disclaimer { color: #666; font-style: italic; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <h1>${t.title}</h1>
  <p><strong>${t.patient}:</strong> ${patientRef}</p>
  <h2>${t.findings}</h2>
  <pre class="findings">${findingsText}</pre>
  <p class="disclaimer">${t.disclaimer}</p>
</body>
</html>`;
  }

  // Default JSON format
  return JSON.stringify({
    title: t.title,
    patient_reference: patientRef,
    findings: scan.findings || t.noFindings,
    disclaimer: t.disclaimer,
  }, null, 2);
}

async function generateAISummary(
  scan: { findings: any },
  language: string,
  apiKey: string
): Promise<string> {
  const prompt = language === 'fr'
    ? `En tant que radiologue, résumez brièvement ces résultats d'IRM en 2-3 phrases pour le patient: ${JSON.stringify(scan.findings)}`
    : `As a radiologist, briefly summarize these MRI findings in 2-3 sentences for the patient: ${JSON.stringify(scan.findings)}`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are a medical professional providing clear, compassionate summaries of MRI findings." },
        { role: "user", content: prompt }
      ],
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || null;
}

/**
 * API Client — routes analysis requests to backend or local pipeline.
 *
 * Frontend (Expo): calls backend via HTTP when EXPO_PUBLIC_API_BASE_URL set, else mock.
 * Server-side: uses real risk pipeline directly when AI_STUDIO_API_KEY present.
 */

import type { AnalyzeClient, AnalysisInput, AnalyzeOutput } from './contract';
import { safeParseAnalyzeOutput } from './contract';
import { mockAnalyze } from './mock';

function getBaseUrl(): string {
  // Server-side (Node.js/Express)
  if (typeof process !== 'undefined' && process.env?.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  // Expo client-side: EXPO_PUBLIC_ prefix is baked into bundle
  if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  // Browser client-side: relative routing behind Nginx when on production domain
  const win = (globalThis as any).window;
  if (typeof win !== 'undefined' && win.location && win.location.origin) {
    const origin = win.location.origin;
    if (!origin.includes(':8081') && !origin.includes(':19006') && !origin.includes(':8082') && !origin.includes('localhost')) {
      return origin;
    }
  }
  // Deployed public AI API endpoint fallback
  return 'https://unesco.w9.nu';
}



// ── HTTP Client (frontend → backend) ────────────────────────────────────────

export class ApiAnalyzeClient implements AnalyzeClient {
  constructor(private readonly baseUrl: string = getBaseUrl()) {}

  async analyze(input: AnalysisInput): Promise<AnalyzeOutput> {
    if (!this.baseUrl) return mockAnalyze(input);
    const targetUrl = `${this.baseUrl.replace(/\/$/, '')}/api/analyze`;
    let res: Response;
    try {
      res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
    } catch (err) {
      console.warn(`[ApiAnalyzeClient] Fetch network error from ${targetUrl}, using local client fallback:`, err);
      const direct = new DirectAnalyzeClient();
      return direct.analyze(input);
    }

    if (!res.ok) throw new Error(`analyze request failed: ${res.status}`);
    const raw = await res.json();
    const parsed = safeParseAnalyzeOutput(raw);
    if (!parsed.ok) {
      throw new Error(`Invalid analyze response: ${parsed.error.message}`);
    }
    return parsed.data;
  }
}

// ── Direct Pipeline Client (server-side or local with API key) ───────────────

class DirectAnalyzeClient implements AnalyzeClient {
  async analyze(input: AnalysisInput): Promise<AnalyzeOutput> {
    const { DefaultRiskPipeline } = await import('./risk/pipeline');
    const pipeline = new DefaultRiskPipeline();

    // Build preprocessed input for the pipeline
    const text = input.kind === 'text'
      ? input.text
      : input.kind === 'url'
        ? `Liên kết: ${input.url}`
        : input.kind === 'voice'
          ? input.data // base64 voice data
          : '';

    const preprocessed = {
      normalised: { cleaned: text },
      redacted: { text }, // No PII redaction for direct calls
    };

    const output = await pipeline.run({ preprocessed });
    return output;
  }
}

// ── Factory ─────────────────────────────────────────────────────────────────

/**
 * Create analyze client for frontend use.
 * - If API_BASE_URL is set → HTTP backend
 * - Else → mock (safe fallback)
 */
export function createAnalyzeClient(baseUrl?: string): AnalyzeClient {
  return new ApiAnalyzeClient(baseUrl);
}

/**
 * Create analyze client for server-side use.
 * - If AI_STUDIO_API_KEY is set → real pipeline (Google AI Studio)
 * - Else → mock
 */
export function createServerAnalyzeClient(): AnalyzeClient {
  const hasApiKey =
    typeof process !== 'undefined' && process.env?.AI_STUDIO_API_KEY;

  if (hasApiKey) {
    return new DirectAnalyzeClient();
  }
  return { analyze: mockAnalyze };
}

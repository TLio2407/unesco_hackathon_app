import type { AnalyzeClient, AnalysisInput, AnalyzeOutput } from './contract';
import { mockAnalyze } from './mock';
import { safeParseAnalyzeOutput } from './contract';

const BASE_URL =
  (typeof process !== 'undefined' && process.env && process.env.API_BASE_URL) || '';

export class ApiAnalyzeClient implements AnalyzeClient {
  constructor(private readonly baseUrl: string = BASE_URL) {}

  async analyze(input: AnalysisInput): Promise<AnalyzeOutput> {
    if (!this.baseUrl) return mockAnalyze(input);
    const res = await fetch(`${this.baseUrl.replace(/\/$/, '')}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`analyze request failed: ${res.status}`);
    const raw = await res.json();
    const parsed = safeParseAnalyzeOutput(raw);
    if (!parsed.ok) {
      throw new Error(`Invalid analyze response: ${parsed.error.message}`);
    }
    return parsed.data;
  }
}

export function createAnalyzeClient(baseUrl?: string): AnalyzeClient {
  return new ApiAnalyzeClient(baseUrl);
}

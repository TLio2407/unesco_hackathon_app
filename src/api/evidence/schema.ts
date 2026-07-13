export interface AlertSchema {
  id: string;
  source: string;
  sourceUrl: string;
  date: string;
  title: string;
  summary: string;
  category: 'authority_impersonation' | 'investment_scam' | 'health' | 'gift_scam' | 'tech_support';
  signals: string[];
  region: 'VN' | 'global';
}

export const VALID_SOURCES = ['BoCA', 'VietNamNet', 'FTC', 'IC3', 'WHO', 'MoH'] as const;

export const VALID_SIGNALS = [
  'urgency',
  'upfront_payment',
  'authority_impersonation',
  'suspicious_url',
  'too_good_to_be_true',
  'personal_data_request',
  'social_proof',
] as const;

export const VALID_CATEGORIES = [
  'authority_impersonation',
  'investment_scam',
  'health',
  'gift_scam',
  'tech_support',
] as const;

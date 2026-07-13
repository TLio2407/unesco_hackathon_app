import type { AnalyzeOutput, RedFlagSignal, RiskLevel } from '@/api/contract';

const VALID_RISK_LEVELS: RiskLevel[] = [
  'safe',
  'caution',
  'high_risk',
  'insufficient_data',
];

const VALID_SIGNALS: RedFlagSignal[] = [
  'urgency',
  'upfront_payment',
  'authority_impersonation',
  'suspicious_url',
  'too_good_to_be_true',
  'personal_data_request',
  'social_proof',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isRedFlag(value: unknown): boolean {
  return (
    isRecord(value) &&
    isString(value.signal) &&
    (VALID_SIGNALS as readonly string[]).includes(value.signal) &&
    isString(value.explanation)
  );
}

function isLessonCard(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (!isString(value.title)) return false;
  if (!isStringArray(value.points)) return false;
  if (value.quiz != null) {
    if (!isRecord(value.quiz)) return false;
    if (!isString(value.quiz.question)) return false;
    if (!isString(value.quiz.answer)) return false;
  }
  return true;
}

export function validateOutput(value: unknown): value is AnalyzeOutput {
  if (!isRecord(value)) return false;
  if (!(VALID_RISK_LEVELS as readonly string[]).includes(value.riskLevel as string))
    return false;
  if (!Array.isArray(value.redFlags) || !value.redFlags.every(isRedFlag)) return false;
  if (!isStringArray(value.verificationSteps)) return false;
  if (!isString(value.nextAction)) return false;
  if (value.lessonCard != null && !isLessonCard(value.lessonCard)) return false;
  if (value.disclaimer != null && !isString(value.disclaimer)) return false;
  return true;
}

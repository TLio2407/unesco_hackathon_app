import { redact } from '../../lib/redact';

export function redactText(text: string): string {
  return redact(text).text;
}

export function redactObject(
  obj: Record<string, any>,
  sensitiveKeys?: string[]
): Record<string, any> {
  const keys = sensitiveKeys ?? ['text', 'input', 'url', 'data', 'voiceRef', 'imageRef'];
  const clone = structuredClone(obj);
  for (const key of keys) {
    if (typeof clone[key] === 'string') {
      clone[key] = redact(clone[key]).text;
    }
  }
  return clone;
}

import { describe, expect, it } from 'vitest';
import {
  TAXONOMY_MODULES,
  STRUCTURED_LESSONS,
  getLessonsByModule,
  calculateProgress,
  evaluateBadges,
  generateCertificate,
} from '../../src/lib/learning-taxonomy';

describe('Structured Study & Micro-Learning Taxonomy', () => {
  it('defines 4 core taxonomy modules', () => {
    expect(TAXONOMY_MODULES.length).toBe(4);
    const modIds = TAXONOMY_MODULES.map((m) => m.id);
    expect(modIds).toEqual(['banking', 'impersonation', 'ecommerce', 'privacy']);
  });

  it('filters micro-lessons by taxonomy module', () => {
    const bankingLessons = getLessonsByModule('banking');
    expect(bankingLessons.length).toBeGreaterThan(0);
    bankingLessons.forEach((l) => expect(l.moduleId).toBe('banking'));

    const allLessons = getLessonsByModule('all');
    expect(allLessons.length).toBe(STRUCTURED_LESSONS.length);
  });

  it('calculates completion progress accurately', () => {
    const p0 = calculateProgress([]);
    expect(p0.completed).toBe(0);
    expect(p0.percent).toBe(0);

    const lesson1Id = STRUCTURED_LESSONS[0].id;
    const p1 = calculateProgress([lesson1Id]);
    expect(p1.completed).toBe(1);
    expect(p1.percent).toBeGreaterThan(0);

    const allIds = STRUCTURED_LESSONS.map((l) => l.id);
    const pAll = calculateProgress(allIds);
    expect(pAll.completed).toBe(STRUCTURED_LESSONS.length);
    expect(pAll.percent).toBe(100);
  });

  it('evaluates unlocked badges based on progress', () => {
    const badges0 = evaluateBadges([]);
    const unlocked0 = badges0.filter((b) => b.unlocked);
    expect(unlocked0.length).toBe(0);

    const badges1 = evaluateBadges([STRUCTURED_LESSONS[0].id]);
    const rookie = badges1.find((b) => b.id === 'rookie');
    expect(rookie?.unlocked).toBe(true);

    const allIds = STRUCTURED_LESSONS.map((l) => l.id);
    const badgesAll = evaluateBadges(allIds);
    const grandmaster = badgesAll.find((b) => b.id === 'grandmaster');
    expect(grandmaster?.unlocked).toBe(true);
  });

  it('generates digital achievement certificate payload', () => {
    const cert = generateCertificate('Bác Nguyễn Văn A', [1, 2, 3]);
    expect(cert.userName).toBe('Bác Nguyễn Văn A');
    expect(cert.totalCompleted).toBe(3);
    expect(cert.certificateId).toContain('UNESCO-MIL-');
    expect(cert.verifiedBy).toContain('UNESCO');
  });
});

import { describe, expect, it, beforeEach } from 'vitest';
import {
  OFFICIAL_THREAT_FEEDS,
  filterThreatAlerts,
  dispatchAlertToCircle,
  getDispatchHistory,
  clearDispatchHistory,
  ThreatAlert,
} from '../../src/lib/threat-feeds';

describe('Threat Feeds & Network Circle Alert Engine', () => {
  beforeEach(() => {
    clearDispatchHistory();
  });

  it('contains official threat feeds from Ministry of Public Security, AIS, and SBV', () => {
    expect(OFFICIAL_THREAT_FEEDS.length).toBeGreaterThanOrEqual(4);
    const sources = OFFICIAL_THREAT_FEEDS.map((f) => f.source);
    expect(sources).toContain('Bộ Công an');
    expect(sources).toContain('Cục An toàn thông tin');
    expect(sources).toContain('Ngân hàng Nhà nước');
  });

  it('filters threat alerts by source', () => {
    const policeAlerts = filterThreatAlerts(OFFICIAL_THREAT_FEEDS, { source: 'Bộ Công an' });
    expect(policeAlerts.length).toBeGreaterThan(0);
    policeAlerts.forEach((item) => {
      expect(item.source).toBe('Bộ Công an');
    });
  });

  it('filters threat alerts by category', () => {
    const authorityAlerts = filterThreatAlerts(OFFICIAL_THREAT_FEEDS, { category: 'Fake Authority' });
    expect(authorityAlerts.length).toBeGreaterThan(0);
    authorityAlerts.forEach((item) => {
      expect(item.category).toBe('Fake Authority');
    });
  });

  it('filters threat alerts by search keyword', () => {
    const matched = filterThreatAlerts(OFFICIAL_THREAT_FEEDS, { search: 'VNeID' });
    expect(matched.length).toBeGreaterThan(0);
    expect(matched[0].title.toLowerCase()).toContain('vneid');
  });

  it('dispatches alert to Trusted Circle with automatic PII redaction', () => {
    const alert: ThreatAlert = {
      id: 'test-alert-1',
      title: 'Giả mạo số 0901234567 đe dọa nợ tiền',
      category: 'Fake Authority',
      risk: 'high_risk',
      summary: 'Kẻ xấu gọi từ 0901234567 bảo chuyển tiền cho Nguyễn Văn A tại 123 Lê Lợi',
      source: 'Bộ Công an',
      publishedAt: '2026-07-31',
      verifiedBy: 'NCSC',
    };

    const log = dispatchAlertToCircle(alert, 3, 'Gọi cho con 0987654321 ngay');
    expect(log.alertId).toBe('test-alert-1');
    expect(log.recipientsCount).toBe(3);

    // Summary PII must be redacted
    expect(log.redactedSummary).not.toContain('0901234567');
    expect(log.redactedSummary).toContain('[ĐÃ CHE]');

    // Custom note PII must be redacted
    expect(log.customNote).not.toContain('0987654321');

    const history = getDispatchHistory();
    expect(history.length).toBe(1);
    expect(history[0].id).toBe(log.id);
  });
});

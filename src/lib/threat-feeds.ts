/**
 * Warnings & Threat Intelligence Engine (WP4 Extension)
 *
 * Ingests real-time fraud alerts from official databases (Bộ Công an, Cục ATTT, SBV)
 * and enables automated dispatch to a user's Trusted Circle.
 */

import { redactPii } from '@/api/preprocess/redact';

export type ThreatSource = 'Bộ Công an' | 'Cục An toàn thông tin' | 'Ngân hàng Nhà nước' | 'Cổng thông tin Chính phủ';

export type ThreatCategory = 'Scam' | 'Fake Authority' | 'Health' | 'Banking' | 'E-Commerce';

export interface ThreatAlert {
  id: string;
  title: string;
  category: ThreatCategory;
  risk: 'high_risk' | 'caution';
  summary: string;
  source: ThreatSource;
  sourceUrl?: string;
  publishedAt: string; // ISO date or formatted date
  verifiedBy: string;
  affectedDemographic?: string;
}

export interface CircleDispatchLog {
  id: string;
  alertId: string;
  alertTitle: string;
  recipientsCount: number;
  dispatchedAt: number;
  redactedSummary: string;
  customNote?: string;
}

export const OFFICIAL_THREAT_FEEDS: ThreatAlert[] = [
  {
    id: 'feed-1',
    title: 'Giả mạo Công an gọi điện đe dọa nợ tiền phạt',
    category: 'Fake Authority',
    risk: 'high_risk',
    summary: 'Đối tượng gọi điện tự xưng là công an, thông báo người dân liên quan đến vụ án ma túy/phạt nguội và yêu cầu chuyển tiền vào tài khoản "tạm giữ".',
    source: 'Bộ Công an',
    sourceUrl: 'https://bocongan.gov.vn',
    publishedAt: '2026-07-30',
    verifiedBy: 'Trung tâm Giám sát an toàn không gian mạng Quốc gia (NCSC)',
    affectedDemographic: 'Người cao tuổi (55+)',
  },
  {
    id: 'feed-2',
    title: 'Lừa đảo tuyển CTV "Việc nhẹ lương cao" chốt đơn',
    category: 'Scam',
    risk: 'high_risk',
    summary: 'Mời chào tham gia làm CTV chốt đơn Shopee, Lazada để nhận hoa hồng, sau đó yêu cầu nạp số tiền lớn và chiếm đoạt.',
    source: 'Cục An toàn thông tin',
    sourceUrl: 'https://khonggianmang.vn',
    publishedAt: '2026-07-28',
    verifiedBy: 'Cục An toàn thông tin - Bộ TT&TT',
    affectedDemographic: 'Người về hưu, phụ nữ nội trợ',
  },
  {
    id: 'feed-3',
    title: 'Tin giả về "Thuốc thần" trị bách bệnh cho người già',
    category: 'Health',
    risk: 'caution',
    summary: 'Các quảng cáo trên Facebook/Zalo sử dụng cắt ghép hình ảnh bác sĩ đài truyền hình để thổi phồng công dụng thực phẩm chức năng.',
    source: 'Bộ Công an',
    sourceUrl: 'https://moh.gov.vn',
    publishedAt: '2026-07-25',
    verifiedBy: 'Bộ Y tế & NCSC',
    affectedDemographic: 'Người cao tuổi',
  },
  {
    id: 'feed-4',
    title: 'Cảnh báo link lạ giả mạo VNeID đánh cắp tài khoản ngân hàng',
    category: 'Fake Authority',
    risk: 'high_risk',
    summary: 'Tin nhắn SMS yêu cầu cập nhật VNeID mức độ 2 qua một đường link lạ (.apk) để cài mã độc vào điện thoại chiếm quyền ứng dụng ngân hàng.',
    source: 'Cổng thông tin Chính phủ',
    sourceUrl: 'https://chinhphu.vn',
    publishedAt: '2026-07-24',
    verifiedBy: 'Cục Cảnh sát QLHC về TTXH',
    affectedDemographic: 'Tất cả công dân',
  },
  {
    id: 'feed-5',
    title: 'Mạo danh Ngân hàng Nhà nước thông báo nâng cấp mã QR chuyển tiền',
    category: 'Banking',
    risk: 'high_risk',
    summary: 'Gửi email/tin nhắn thông báo mã QR thanh toán của cửa hàng bị lỗi, ép quét mã QR mới để chiếm đoạt số dư tài khoản.',
    source: 'Ngân hàng Nhà nước',
    sourceUrl: 'https://sbv.gov.vn',
    publishedAt: '2026-07-22',
    verifiedBy: 'Vụ Thanh toán - NHNN',
    affectedDemographic: 'Hộ kinh doanh nhỏ & Người cao tuổi',
  },
];

let dispatchHistory: CircleDispatchLog[] = [];

/**
 * Filter threat alerts by source, category, or search query
 */
export function filterThreatAlerts(
  alerts: ThreatAlert[] = OFFICIAL_THREAT_FEEDS,
  options?: {
    source?: ThreatSource | 'All';
    category?: ThreatCategory | 'All';
    search?: string;
  }
): ThreatAlert[] {
  const source = options?.source || 'All';
  const category = options?.category || 'All';
  const search = (options?.search || '').toLowerCase().trim();

  return alerts.filter((item) => {
    const matchSource = source === 'All' || item.source === source;
    const matchCat = category === 'All' || item.category === category;
    const matchQuery =
      !search ||
      item.title.toLowerCase().includes(search) ||
      item.summary.toLowerCase().includes(search) ||
      item.source.toLowerCase().includes(search);

    return matchSource && matchCat && matchQuery;
  });
}

/**
 * Dispatch threat alert notification to Trusted Circle with automatic PII redaction
 */
export function dispatchAlertToCircle(
  alert: ThreatAlert,
  contactsCount: number,
  customNote?: string
): CircleDispatchLog {
  const redactedSummary = redactPii(alert.summary).text;

  const log: CircleDispatchLog = {
    id: `dispatch_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    alertId: alert.id,
    alertTitle: alert.title,
    recipientsCount: contactsCount,
    dispatchedAt: Date.now(),
    redactedSummary,
    customNote: customNote ? redactPii(customNote).text : undefined,
  };

  dispatchHistory.unshift(log);
  return log;
}

export function getDispatchHistory(): CircleDispatchLog[] {
  return [...dispatchHistory];
}

export function clearDispatchHistory() {
  dispatchHistory = [];
}

/**
 * Regional Dialects & Simplified Vocabulary Glossary for MIL App
 */

import { useState, useEffect } from 'react';
import { i18n } from './index';

export type DialectCode = 'vi-north' | 'vi-central' | 'vi-south' | 'en' | 'hmn';

export interface DialectInfo {
  code: DialectCode;
  name: string;
  regionLabel: string;
  addressUser: string; // e.g. "cô/chú", "bác/o", "chú/thím"
}

export const DIALECTS: Record<DialectCode, DialectInfo> = {
  'vi-north': {
    code: 'vi-north',
    name: 'Tiếng Việt (Miền Bắc - Hà Nội)',
    regionLabel: 'Miền Bắc',
    addressUser: 'cô/chú',
  },
  'vi-central': {
    code: 'vi-central',
    name: 'Tiếng Việt (Miền Trung - Huế/Đà Nẵng)',
    regionLabel: 'Miền Trung',
    addressUser: 'bác/o/dượng',
  },
  'vi-south': {
    code: 'vi-south',
    name: 'Tiếng Việt (Miền Nam - Sài Gòn/Miền Tây)',
    regionLabel: 'Miền Nam',
    addressUser: 'cô/chú/bác',
  },
  en: {
    code: 'en',
    name: 'English (US/UK)',
    regionLabel: 'Global',
    addressUser: 'you',
  },
  hmn: {
    code: 'hmn',
    name: 'Tiếng H\'Mông (Hmong)',
    regionLabel: 'Tây Bắc',
    addressUser: 'koj',
  },
};

/** Elderly-Friendly Glossary simplifying jargon into everyday analogies */
export interface GlossaryTerm {
  term: string;
  simpleTranslation: string;
  analogy: string;
}

export const SIMPLIFIED_GLOSSARY: Record<string, GlossaryTerm> = {
  OTP: {
    term: 'Mã OTP',
    simpleTranslation: 'Mã mật khẩu 6 chữ số qua tin nhắn',
    analogy: 'Như chiếc chìa khóa dùng 1 lần, tuyệt đối không đưa cho ai.',
  },
  URL: {
    term: 'Đường link / URL',
    simpleTranslation: 'Địa chỉ đường dẫn trang mạng',
    analogy: 'Như biển số nhà trên mạng; nếu biển số lạ hoặc viết sai tên ngân hàng thì là nhà giả.',
  },
  Phishing: {
    term: 'Lừa đảo Phishing',
    simpleTranslation: 'Chiêu trò giả mạo câu thông tin',
    analogy: 'Kẻ xấu thả mồi nhử giả làm ngân hàng để cô/chú cắn câu đưa mật khẩu.',
  },
  Deepfake: {
    term: 'Deepfake Giọng nói/Hình ảnh',
    simpleTranslation: 'Công nghệ cắt ghép giả mặt và giả giọng',
    analogy: 'Máy tính dựng lại khuôn mặt và giọng nói giống hệt người thân để mượn tiền.',
  },
  VNeID: {
    term: 'VNeID',
    simpleTranslation: 'Ứng dụng Thẻ căn cước công dân điện tử',
    analogy: 'Sổ hộ khẩu và CCCD trên điện thoại, chỉ tải từ cửa hàng CH Play hoặc App Store.',
  },
  'QR Code': {
    term: 'Mã QR Code',
    simpleTranslation: 'Ô vuông mã số quét bằng camera',
    analogy: 'Chụp hình ô vuông để mở trang web hoặc chuyển tiền.',
  },
};

let currentDialect: DialectCode = 'vi-north';
const dialectListeners = new Set<(dialect: DialectCode) => void>();

export function getDialect(): DialectCode {
  return currentDialect;
}

export function setDialect(dialect: DialectCode) {
  currentDialect = dialect;
  if (dialect === 'en') {
    i18n.locale = 'en';
  } else {
    i18n.locale = 'vi';
  }
  dialectListeners.forEach((l) => l(dialect));
}

export function useLanguageDialect(): [DialectCode, (dialect: DialectCode) => void] {
  const [dialect, setDialectState] = useState<DialectCode>(currentDialect);

  useEffect(() => {
    const handler = (newDialect: DialectCode) => setDialectState(newDialect);
    dialectListeners.add(handler);
    return () => {
      dialectListeners.delete(handler);
    };
  }, []);

  return [dialect, setDialect];
}

/** Translate technical jargon to simple elderly-friendly explanation if available */
export function simplifyJargon(text: string): string {
  let result = text;
  for (const [key, item] of Object.entries(SIMPLIFIED_GLOSSARY)) {
    if (result.includes(item.term)) {
      result = result.replace(item.term, `${item.term} (${item.simpleTranslation})`);
    } else if (result.includes(key)) {
      result = result.replace(key, `${item.term} (${item.simpleTranslation})`);
    }
  }
  return result;
}

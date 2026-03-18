/**
 * Contact 페이지
 * 연락처 정보를 표시합니다
 * ISR: 3600초마다 재검증
 */

import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { ContactSection } from '@/components/contact/ContactSection';

/** 메타데이터 생성 */
export const metadata: Metadata = {
  title: 'Contact',
  description: '박은혜와 연락할 수 있는 방법들을 소개합니다',
  openGraph: {
    title: `Contact | ${SITE_CONFIG.name}`,
    description: '박은혜와 연락할 수 있는 방법들을 소개합니다',
    type: 'website',
    locale: 'ko_KR',
    url: `${SITE_CONFIG.url}/contact`
  }
};

/** ISR 재검증 주기 (초) */
export const revalidate = 3600;

export default function ContactPage() {
  return (
    <main id="main-content" className="flex-1">
      {/* 연락처 섹션 */}
      <ContactSection />
    </main>
  );
}

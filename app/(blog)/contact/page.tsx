/**
 * Contact 페이지
 * 연락처 정보와 직접 메시지 폼을 표시합니다
 * ISR: 3600초마다 재검증
 */

import type { Metadata } from 'next';
import { SITE_CONFIG, PROFILE_DATA } from '@/lib/constants';
import { ContactSection } from '@/components/contact/ContactSection';
import { ContactForm } from '@/components/contact/ContactForm';
import { Container } from '@/components/layout/Container';

/** 메타데이터 생성 */
export const metadata: Metadata = {
  title: 'Contact',
  description: '박은혜와 연락하기 — 함께 프로젝트를 만들 준비가 되어 있습니다',
  openGraph: {
    title: `Contact | ${SITE_CONFIG.name}`,
    description: '박은혜와 연락하기 — 함께 프로젝트를 만들 준비가 되어 있습니다',
    type: 'website',
    locale: 'ko_KR',
    url: `${SITE_CONFIG.url}/contact`
  }
};

/** ISR 재검증 주기 (초) */
export const revalidate = 3600;

export default function ContactPage() {
  return (
    <>
      {/* 연락처 카드 섹션 */}
      <div className='bg-gradient-to-br from-indigo-50/50 via-blue-50/30 to-transparent dark:from-slate-900/50 dark:via-slate-800/30 dark:to-transparent'>
        <ContactSection />
      </div>

      {/* 직접 메시지 폼 섹션 */}
      <div className='bg-white dark:bg-slate-950'>
        <Container>
          <section className='py-20 lg:py-32' aria-labelledby='contact-form-title'>
            <div className='max-w-2xl mx-auto'>
              <div className='text-center mb-12'>
                <h2 id='contact-form-title' className='text-4xl lg:text-5xl font-bold mb-4'>
                  <span className='text-indigo-600 dark:text-purple-300'>Direct</span> Message
                </h2>
                <p className='text-muted-foreground text-lg'>
                  아래 양식을 통해 직접 연락주세요.
                  <br />
                  빠르게 답변드리겠습니다!
                </p>
              </div>
              <ContactForm formId="contact" />
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}

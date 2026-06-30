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
      {/* 페이지 헤더 */}
      <section className='bg-[#FCFCFC] dark:bg-[#0A0A0A] border-b border-border py-12 lg:py-16'>
        <Container>
          <div>
            <h1 className='text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.2]'>
              Get In Touch
            </h1>
            <p className='mt-3 text-lg text-muted-foreground'>
              새로운 기회나 협업에 대해 이야기 나누고 싶다면 편하게 연락해 주세요.
            </p>
          </div>
        </Container>
      </section>

      {/* 연락처 카드 섹션 */}
      <div className='bg-background'>
        <ContactSection />
      </div>

      {/* 직접 메시지 폼 섹션 */}
      <div className='bg-background py-20 lg:py-32 border-b border-border'>
        <Container>
          <div className='max-w-2xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 id='contact-form-title' className='text-2xl sm:text-3xl font-semibold mb-4'>
                Direct Message
              </h2>
              <p className='text-muted-foreground text-base lg:text-lg'>
                아래 양식을 통해 직접 연락주세요. 빠르게 답변드리겠습니다!
              </p>
            </div>
            <ContactForm formId="contact" />
          </div>
        </Container>
      </div>

      {/* 추가 CTA 섹션 */}
      <div className='bg-[#111111] dark:bg-[#0A0A0A] text-white py-16 lg:py-20'>
        <Container>
          <div className='text-center'>
            <p className='text-lg text-white/70 mb-6'>
              이메일 또는 전화로 더 빠르게 연락할 수 있습니다.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <a
                href={`mailto:${PROFILE_DATA.email}`}
                className='h-[52px] px-6 rounded-full bg-white text-black font-semibold text-base inline-flex items-center justify-center hover:bg-white/90 transition-colors'
              >
                이메일: {PROFILE_DATA.email}
              </a>
              <a
                href={`tel:${PROFILE_DATA.email.replace('@', '')}`}
                className='h-[52px] px-6 rounded-full border border-white/30 text-white font-semibold text-base inline-flex items-center justify-center hover:bg-white/10 transition-colors'
              >
                빠른 상담
              </a>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

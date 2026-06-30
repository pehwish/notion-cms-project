/**
 * About 페이지
 * 프로필 소개, 자기소개, 개발 철학, 기술 스택을 표시합니다
 * ISR: 3600초마다 재검증
 */

import type { Metadata } from 'next';
import { SITE_CONFIG, PROFILE_DATA } from '@/lib/constants';
import { HeroSection } from '@/components/profile/HeroSection';
import { AboutSection } from '@/components/profile/AboutSection';
import { SkillsSection } from '@/components/profile/SkillsSection';
import { Separator } from '@/components/ui/separator';

/** 메타데이터 생성 */
export const metadata: Metadata = {
  title: 'About',
  description: PROFILE_DATA.bio,
  openGraph: {
    title: `About | ${SITE_CONFIG.name}`,
    description: PROFILE_DATA.bio,
    type: 'website',
    locale: 'ko_KR',
    url: `${SITE_CONFIG.url}/about`
  }
};

/** ISR 재검증 주기 (초) */
export const revalidate = 3600;

export default function AboutPage() {
  return (
    <>
      {/* 히어로 섹션: 이름 + 직무 + CTA (깨끗한 배경 + 그리드 라인) */}
      <div className='bg-[#FCFCFC] dark:bg-[#0A0A0A] section-divider-lines'>
        <HeroSection />
      </div>

      {/* 자기소개 + 핵심 역량 넘버드 카드 */}
      <div className='bg-background section-divider-lines'>
        <AboutSection />
      </div>
      <Separator className="my-0" />

      {/* 기술 스택 프로그레스 바 + 그리드 라인 */}
      <div className='bg-[#F7F7F7] dark:bg-slate-900/30 section-divider-lines'>
        <SkillsSection />
      </div>
    </>
  );
}

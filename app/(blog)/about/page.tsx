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
      {/* 히어로 섹션: 이름 + 직무 + CTA */}
      <div className='bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-slate-900/50 dark:to-transparent'>
        <HeroSection />
      </div>

      {/* 자기소개 + 개발 철학 카드 */}
      <div className='bg-gradient-to-br from-blue-50/60 via-indigo-50/30 to-transparent dark:from-slate-900/60 dark:via-slate-800/30 dark:to-transparent'>
        <AboutSection />
      </div>
      <Separator className="my-16" />

      {/* 기술 스택 프로그레스 바 */}
      <div className='bg-gradient-to-b from-transparent to-indigo-50/30 dark:to-slate-900/30'>
        <SkillsSection />
      </div>
    </>
  );
}

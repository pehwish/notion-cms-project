/**
 * 사이트 헤더 컴포넌트
 * 로고, 데스크탑 네비게이션, 모바일 메뉴, 테마 토글을 포함
 * 스크롤 시 배경 처리를 위한 sticky 포지션 사용
 */

'use client';

import { SITE_CONFIG } from '@/lib/constants';

import { ThemeToggle } from '@/components/common/ThemeToggle';
import Link from 'next/link';
import { Container } from './Container';

export function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <Container>
        <div className='flex h-14 items-center justify-between'>
          {/* 로고 */}
          <Link
            href='/'
            className='font-bold text-lg'
            aria-label={`${SITE_CONFIG.name} 홈으로`}
          >
            {SITE_CONFIG.name}
          </Link>

          {/* 테마 토글 */}
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}

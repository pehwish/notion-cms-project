/**
 * 사이트 헤더 컴포넌트
 * 로고, 네비게이션 링크, 테마 토글을 포함
 * 스크롤 시 배경 처리를 위한 sticky 포지션 사용
 */

'use client';

import { SITE_CONFIG, MARKETING_NAV_LINKS } from '@/lib/constants';

import { ThemeToggle } from '@/components/common/ThemeToggle';
import { MobileNav } from '@/components/navigation/mobile-nav';
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

          {/* 오른쪽 항목들 (네비게이션, 모바일 메뉴, 테마 토글) */}
          <div className='flex items-center gap-4'>
            {/* 네비게이션 링크 (데스크탑) */}
            <nav className='hidden sm:flex items-center gap-6'>
              {MARKETING_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='text-sm font-medium transition-colors hover:text-foreground/80'
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* 모바일 메뉴 */}
            <MobileNav />

            {/* 테마 토글 */}
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}

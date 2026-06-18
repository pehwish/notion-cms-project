/**
 * 사이트 푸터 컴포넌트
 * 저작권, 소셜 링크, 서브 네비게이션 포함
 */

import { SITE_CONFIG, PROFILE_DATA, MARKETING_NAV_LINKS } from '@/lib/constants';
import { Container } from './Container';
import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t border-border/40'>
      <Container>
        <div className='py-12 md:py-16'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
            {/* 좌측: 브랜드 및 소개 */}
            <div className='flex flex-col gap-3'>
              <h3 className='font-semibold text-lg'>{SITE_CONFIG.name}</h3>
              <p className='text-sm text-muted-foreground'>
                {SITE_CONFIG.description}
              </p>
            </div>

            {/* 중앙: 빠른 링크 */}
            <div className='flex flex-col gap-3'>
              <h4 className='font-semibold text-sm uppercase tracking-wide'>Quick Links</h4>
              <nav className='flex flex-col gap-2'>
                {MARKETING_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* 우측: 소셜 링크 */}
            <div className='flex flex-col gap-3'>
              <h4 className='font-semibold text-sm uppercase tracking-wide'>Connect</h4>
              <div className='flex gap-3'>
                <a
                  href={PROFILE_DATA.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub 프로필"
                  className='inline-flex items-center justify-center h-10 w-10 rounded-md border border-border hover:bg-accent transition-colors'
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href={PROFILE_DATA.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn 프로필"
                  className='inline-flex items-center justify-center h-10 w-10 rounded-md border border-border hover:bg-accent transition-colors'
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href={`mailto:${PROFILE_DATA.email}`}
                  aria-label="이메일 보내기"
                  className='inline-flex items-center justify-center h-10 w-10 rounded-md border border-border hover:bg-accent transition-colors'
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* 저작권 */}
          <div className='border-t border-border/40 pt-8'>
            <p className='text-sm text-muted-foreground text-center'>
              &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

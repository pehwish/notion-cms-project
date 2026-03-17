/**
 * 사이트 푸터 컴포넌트
 * 저작권, 소셜 링크, 서브 네비게이션 포함
 */

import { SITE_CONFIG } from '@/lib/constants';
import { Container } from './Container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t border-border/40'>
      <Container>
        <div className='py-8'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <p className='text-sm text-muted-foreground'>
              &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { MARKETING_NAV_LINKS } from '@/lib/constants';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';

/**
 * 모바일 네비게이션 컴포넌트
 * Sheet를 사용한 슬라이드 메뉴 (모바일 전용)
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className='sm:hidden p-2 hover:bg-accent rounded-md transition-colors'
          aria-label='메뉴 열기'
        >
          <Menu className='w-5 h-5' />
        </button>
      </SheetTrigger>
      <SheetContent side='left' className='w-[240px] sm:hidden'>
        <nav className='flex flex-col gap-4 mt-8'>
          {MARKETING_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='text-base font-medium px-2 py-2 rounded-md hover:bg-accent transition-colors'
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

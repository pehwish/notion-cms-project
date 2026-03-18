'use client';

import { useTypingAnimation } from '@/hooks/use-typing-animation';
import { PROFILE_DATA } from '@/lib/constants';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Hero 섹션: 프로필 소개 및 CTA 버튼
 * 좌측 프로필 이미지 + 우측 이름/직무/소개 + 버튼 (2열, 모바일 1열)
 */
export function HeroSection() {
  const { displayedText } = useTypingAnimation({
    text: PROFILE_DATA.name,
    speed: 50,
    delay: 300
  });

  return (
    <Section containerClassName="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* 좌측: 프로필 이미지 */}
      <div className="flex justify-center md:justify-start">
        <div className="relative w-full max-w-sm">
          <Image
            src={PROFILE_DATA.imageUrl}
            alt={PROFILE_DATA.name}
            width={400}
            height={400}
            className="rounded-lg float object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* 우측: 텍스트 및 CTA */}
      <div className="flex flex-col gap-6 md:gap-8">
        {/* 이름: 타이핑 애니메이션 */}
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight">
            {displayedText}
          </h1>
        </div>

        {/* 직무 */}
        <h2 className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium">
          {PROFILE_DATA.role}
        </h2>

        {/* 자기소개 */}
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
          {PROFILE_DATA.bio}
        </p>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            asChild
            className="w-full sm:w-auto"
            aria-label="포트폴리오 보기"
          >
            <Link href="/">
              <ArrowRight className="h-4 w-4" />
              <span>View Projects</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto"
            aria-label="연락처 페이지로 이동"
          >
            <Link href="/contact">
              <Mail className="h-4 w-4" />
              <span>Contact Me</span>
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}

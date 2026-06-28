'use client';

import { useTypingAnimation } from '@/hooks/use-typing-animation';
import { PROFILE_DATA, HERO_STATS } from '@/lib/constants';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Github, Linkedin, Download } from 'lucide-react';
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

        {/* 추가 설명 */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
          {PROFILE_DATA.subBio}
        </p>

        {/* 기술 스택 배지 */}
        <div className="flex flex-wrap gap-2 pt-2">
          {['React', 'Next.js', 'TypeScript', 'Tailwind CSS'].map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-background border border-border text-muted-foreground hover:border-foreground/50 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* 소셜 링크 */}
        <div className="flex gap-3 pt-2">
          <a
            href={PROFILE_DATA.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub 프로필"
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border hover:border-foreground/50 hover:bg-foreground/5 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={PROFILE_DATA.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn 프로필"
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border hover:border-foreground/50 hover:bg-foreground/5 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href={`mailto:${PROFILE_DATA.email}`}
            aria-label="이메일 보내기"
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border hover:border-foreground/50 hover:bg-foreground/5 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>

        {/* 주요 지표 카드 */}
        <div className="grid grid-cols-3 gap-3 py-6 border-y border-border">
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA 버튼 - 2026 리디자인: 52px 높이, 풀 라운드 */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <a
            href="/"
            className="h-[52px] px-6 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black font-semibold text-base inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity w-full sm:w-auto"
            aria-label="포트폴리오 보기"
          >
            <ArrowRight className="h-4 w-4" />
            Projects
          </a>
          <a
            href={PROFILE_DATA.resumeUrl}
            download="박은혜이력서.pdf"
            className="h-[52px] px-6 rounded-full border border-current font-semibold text-base inline-flex items-center justify-center gap-2 hover:bg-foreground/5 transition-colors w-full sm:w-auto"
            aria-label="이력서 다운로드"
          >
            <Download className="h-4 w-4" />
            Resume
          </a>
          <a
            href="/contact"
            className="h-[52px] px-6 rounded-full border border-current font-semibold text-base inline-flex items-center justify-center gap-2 hover:bg-foreground/5 transition-colors w-full sm:w-auto"
            aria-label="연락처 페이지로 이동"
          >
            <Mail className="h-4 w-4" />
            Contact
          </a>
        </div>
      </div>
    </Section>
  );
}

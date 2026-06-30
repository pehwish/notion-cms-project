'use client';

import { useTypingAnimation } from '@/hooks/use-typing-animation';
import { PROFILE_DATA, HERO_METRICS } from '@/lib/constants';
import { Section } from '@/components/layout/Section';
import { ArrowRight, Mail, Github, Linkedin, Download } from 'lucide-react';
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
    <Section containerClassName="flex flex-col gap-8 md:gap-10">
      {/* 이름: 타이핑 애니메이션 + 깜빡이는 커서 */}
      {/* 이름: 타이핑 애니메이션 + 깜빡이는 커서 */}
      <div>
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-foreground tracking-tighter leading-[0.95]">
          {displayedText}
          {!false && (
            <span className="inline-block animate-pulse ml-1 text-foreground opacity-70">|</span>
          )}
        </h1>
      </div>

      {/* 직무 */}
      <h2 className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-medium tracking-tight">
        {PROFILE_DATA.role}
      </h2>

      {/* 자기소개 */}
      <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
        {PROFILE_DATA.bio}
      </p>

      {/* 추가 설명 */}
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-8 border-y border-border">
        {HERO_METRICS.map((stat) => (
          <div key={stat.label} className="text-center sm:text-left">
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight tabular-nums">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1.5 uppercase tracking-wide">
              {stat.label}
            </div>
            {stat.sublabel && (
              <div className="text-[10px] text-muted-foreground/70 mt-0.5">
                {stat.sublabel}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA 버튼 - 2026 리디자인: 52px 높이, 풀 라운드 */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Link
          href="/"
          className="h-[52px] px-6 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black font-semibold text-base inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity w-full sm:w-auto"
          aria-label="포트폴리오 보기"
        >
          <ArrowRight className="h-4 w-4" />
          Projects
        </Link>
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
    </Section>
  );
}

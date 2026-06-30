'use client';

import { Code, User, GraduationCap, Zap, Users, Code2, Shield, Layers, LucideIcon } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Card, CardContent } from '@/components/ui/card';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { CORE_STRENGTHS, PROFILE_DATA } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Philosophy } from '@/lib/types';

/** iconName → Lucide 아이콘 컴포넌트 매핑 */
const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Code2,
  User,
  Users,
  GraduationCap,
  Zap,
  Shield,
  Layers
};

// =============================================================================
// NumberedStrengthCard: 넘버드 강점 카드 (개발 철학 → 핵심 역량으로 재설계)
// =============================================================================

interface NumberedStrengthCardProps {
  item: Philosophy;
  index: number;
  /** stagger delay 클래스 (fade-in-delay-N) */
  delayClass: string;
  /** 부모 섹션이 보이는 상태 */
  isVisible: boolean;
}

/**
 * 넘버드 강점 카드 — 투워즈 스타일 "01~04 Process" 패턴 차용
 * - 좌측: 큼직한 번호 (00처럼 패딩됨, 워터마크 톤)
 * - 우측: 아이콘 + 제목 + 부제 + 설명
 * - 호버 시 미세한 배경 변화 (카드 shadow 제거, hairline border 톤 강화)
 */
function NumberedStrengthCard({ item, index, delayClass, isVisible }: NumberedStrengthCardProps) {
  const IconComponent = ICON_MAP[item.iconName] ?? Code;
  const numberedIndex = String(index + 1).padStart(2, '0');

  return (
    <div
      className={cn(
        'group flex flex-col gap-4 border-t border-border/60 py-6 sm:flex-row sm:gap-8 sm:py-8 first:border-t-0',
        'transition-colors duration-300 hover:bg-foreground/[0.02]',
        isVisible ? delayClass : 'opacity-0 translate-y-5'
      )}
    >
      {/* 좌측: 넘버드 인덱스 (작은 라벨) */}
      <div className="shrink-0">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {numberedIndex}
        </span>
      </div>

      {/* 우측: 아이콘 + 제목 + 부제(선택) + 설명 */}
      <div className="flex flex-col gap-2 flex-1">
        {/* 아이콘 + 제목 행 */}
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5 shrink-0 mt-0.5">
            <IconComponent className="h-4.5 w-4.5 text-foreground" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold text-foreground leading-tight">
            {item.title}
          </h3>
        </div>

        {/* 부제 (CORE_STRENGTHS 전용) */}
        {item.subtitle && (
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
            {item.subtitle}
          </span>
        )}

        {/* 설명 */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// AboutSection: 자기소개 + 개발 철학 섹션
// =============================================================================

/** stagger delay 클래스 목록 (카드 순서대로 매핑) — 4개 항목용으로 확장 */
const STAGGER_DELAY_CLASSES = [
  'fade-in-delay-100',
  'fade-in-delay-200',
  'fade-in-delay-300',
  'fade-in-delay-400'
] as const;

/**
 * About 섹션
 * - 좌측: 배경 타이포그래피 "WHO AM I" + 이름 + 직무
 * - 우측: 자기소개 + 개발 철학 카드 3개
 * - 2열 그리드 (모바일 1열, 데스크탑 2열)
 * - 뷰포트 진입 시 카드 fade-in stagger 애니메이션
 */
export function AboutSection() {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <Section
      id="about"
      className="bg-background"
    >
      {/* 2열 그리드: 좌측 타이포그래피 영역 / 우측 소개 + 카드 */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">

        {/* 좌측: 이름/직무 + 위치 */}
        <div className="flex flex-col justify-center gap-2">
          {/* 이름 */}
          <h2
            className={cn(
              'text-2xl font-bold text-foreground sm:text-3xl',
              isVisible ? 'fade-in' : 'opacity-0'
            )}
          >
            {PROFILE_DATA.name}
          </h2>

          {/* 직무 */}
          <p
            className={cn(
              'text-lg font-medium text-primary sm:text-lg',
              isVisible ? 'fade-in-delay-100' : 'opacity-0'
            )}
          >
            {PROFILE_DATA.role}
          </p>

          {/* 위치 */}
          <p
            className={cn(
              'text-sm text-muted-foreground',
              isVisible ? 'fade-in-delay-200' : 'opacity-0'
            )}
          >
            {PROFILE_DATA.location}
          </p>
        </div>

        {/* 우측: 자기소개 + 철학 카드 */}
        {/* ref를 section 진입 트리거로 활용 */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="flex flex-col gap-6"
        >
          {/* 자기소개 텍스트 */}
          <p
            className={cn(
              'text-base leading-relaxed text-muted-foreground sm:text-lg',
              isVisible ? 'fade-in' : 'opacity-0'
            )}
          >
            {PROFILE_DATA.bio}
          </p>

          {/* 핵심 역량 넘버드 카드 4개 (세로 리스트) */}
          <div className="flex flex-col -mx-4 sm:mx-0">
            {CORE_STRENGTHS.map((item, index) => (
              <NumberedStrengthCard
                key={item.title}
                item={item}
                index={index}
                delayClass={STAGGER_DELAY_CLASSES[index % STAGGER_DELAY_CLASSES.length] ?? 'fade-in-delay-100'}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

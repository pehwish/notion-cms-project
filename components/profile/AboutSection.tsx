'use client';

import { Code, User, GraduationCap, LucideIcon } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Card, CardContent } from '@/components/ui/card';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { PHILOSOPHY_DATA, PROFILE_DATA } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Philosophy } from '@/lib/types';

/** iconName → Lucide 아이콘 컴포넌트 매핑 */
const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  User,
  GraduationCap
};

// =============================================================================
// PhilosophyCard: 개발 철학 단일 카드
// =============================================================================

interface PhilosophyCardProps {
  item: Philosophy;
  /** stagger delay 클래스 (fade-in-delay-N) */
  delayClass: string;
  /** 부모 섹션이 보이는 상태 */
  isVisible: boolean;
}

/**
 * 개발 철학 카드
 * - 아이콘 + 제목 + 설명 표시
 * - 호버 시 translateY(-8px) + shadow 확대
 * - isVisible 상태에 따라 fade-in 애니메이션 적용
 */
function PhilosophyCard({ item, delayClass, isVisible }: PhilosophyCardProps) {
  const IconComponent = ICON_MAP[item.iconName] ?? Code;

  return (
    <Card
      className={cn(
        'border border-border bg-card transition-all duration-300',
        'hover:-translate-y-2 hover:shadow-lg',
        'cursor-default',
        /* 보이기 전: 투명 + 살짝 아래, 보인 후: 애니메이션 실행 */
        isVisible ? delayClass : 'opacity-0 translate-y-5'
      )}
    >
      <CardContent className="flex flex-col gap-3 p-5">
        {/* 아이콘 원형 배경 */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <IconComponent
            className="h-5 w-5 text-primary"
            aria-hidden="true"
          />
        </div>

        {/* 제목 */}
        <h3 className="text-base font-semibold text-foreground">
          {item.title}
        </h3>

        {/* 설명 */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// AboutSection: 자기소개 + 개발 철학 섹션
// =============================================================================

/** stagger delay 클래스 목록 (카드 순서대로 매핑) */
const STAGGER_DELAY_CLASSES = [
  'fade-in-delay-100',
  'fade-in-delay-200',
  'fade-in-delay-300'
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
      className="bg-muted/30 dark:bg-muted/10"
    >
      {/* 2열 그리드: 좌측 타이포그래피 영역 / 우측 소개 + 카드 */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">

        {/* 좌측: 배경 타이포그래피 + 이름/직무 */}
        <div className="flex flex-col justify-center">
          {/* 배경 타이포그래피 */}
          <p
            className={cn(
              'select-none text-6xl font-black leading-none tracking-tight',
              'text-foreground/5 dark:text-foreground/5',
              'sm:text-7xl lg:text-8xl',
              isVisible ? 'fade-in' : 'opacity-0'
            )}
            aria-hidden="true"
          >
            WHO AM I
          </p>

          {/* 이름 */}
          <h2
            className={cn(
              '-mt-4 text-3xl font-bold text-foreground sm:text-4xl',
              isVisible ? 'fade-in-delay-100' : 'opacity-0'
            )}
          >
            {PROFILE_DATA.name}
          </h2>

          {/* 직무 */}
          <p
            className={cn(
              'mt-2 text-lg font-medium text-primary sm:text-xl',
              isVisible ? 'fade-in-delay-200' : 'opacity-0'
            )}
          >
            {PROFILE_DATA.role}
          </p>

          {/* 위치 */}
          <p
            className={cn(
              'mt-1 text-sm text-muted-foreground',
              isVisible ? 'fade-in-delay-300' : 'opacity-0'
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

          {/* 개발 철학 카드 3개 */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {PHILOSOPHY_DATA.map((item, index) => (
              <PhilosophyCard
                key={item.title}
                item={item}
                delayClass={STAGGER_DELAY_CLASSES[index] ?? 'fade-in-delay-100'}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

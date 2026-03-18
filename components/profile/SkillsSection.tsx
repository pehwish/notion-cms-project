'use client';

import { useEffect, useState } from 'react';
import { Section } from '@/components/layout/Section';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { SKILLS_DATA } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Skill } from '@/lib/types';

/** 카운트업 애니메이션 duration (ms) */
const COUNT_UP_DURATION = 600;

// =============================================================================
// useSkillAnimation: 숫자 카운트업 + 프로그레스 바 애니메이션
// =============================================================================

interface UseSkillAnimationOptions {
  proficiency: number;
  isVisible: boolean;
}

/**
 * 숫자 카운트업 및 프로그레스 값 상태 관리 훅
 * - isVisible이 true가 될 때 0 → proficiency 로 증가
 * - requestAnimationFrame 기반 부드러운 애니메이션
 */
function useSkillAnimation({ proficiency, isVisible }: UseSkillAnimationOptions) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / COUNT_UP_DURATION, 1);
      /* easeOut 커브: 빠르게 시작 후 서서히 감속 */
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrentValue(Math.round(eased * proficiency));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, proficiency]);

  return currentValue;
}

// =============================================================================
// SkillItem: 단일 기술 행 (이름 + 프로그레스 바 + 퍼센트)
// =============================================================================

interface SkillItemProps {
  skill: Skill;
  isVisible: boolean;
  /** stagger delay (ms) — inline style로 적용 */
  delayMs: number;
}

/**
 * 단일 기술 항목
 * - 기술명 + 프로그레스 바 + 숫자 %
 * - isVisible 진입 시 카운트업 + 바 채움 애니메이션
 */
function SkillItem({ skill, isVisible, delayMs }: SkillItemProps) {
  const currentValue = useSkillAnimation({
    proficiency: skill.proficiency,
    isVisible
  });

  return (
    <div
      className={cn(
        'flex flex-col gap-1.5',
        'transition-all duration-500',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {/* 기술명 + 숫자 % */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {skill.name}
        </span>
        <span
          className="text-xs font-semibold tabular-nums text-primary"
          aria-label={`${skill.name} 숙련도 ${skill.proficiency}%`}
        >
          {currentValue}%
        </span>
      </div>

      {/* 프로그레스 바: color override를 inline style로 지정 */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/10">
        <div
          className={cn('h-full rounded-full transition-all ease-out', skill.color)}
          style={{
            width: `${currentValue}%`,
            transitionDuration: `${COUNT_UP_DURATION}ms`
          }}
          role="progressbar"
          aria-valuenow={currentValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${skill.name} ${currentValue}%`}
        />
      </div>
    </div>
  );
}

// =============================================================================
// SkillCategory: 카테고리 블록 (제목 + 기술 목록 2열)
// =============================================================================

interface SkillCategoryProps {
  category: string;
  skills: readonly Skill[];
  isVisible: boolean;
  /** 카테고리 전체 base delay (ms) */
  baseDelayMs: number;
}

/**
 * 카테고리별 기술 그룹
 * - 카테고리 제목 + 기술 항목 2열 그리드
 */
function SkillCategory({ category, skills, isVisible, baseDelayMs }: SkillCategoryProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 카테고리 제목 */}
      <h3
        className={cn(
          'text-sm font-semibold uppercase tracking-widest text-muted-foreground',
          'border-b border-border pb-2',
          'transition-all duration-500',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        style={{ transitionDelay: `${baseDelayMs}ms` }}
      >
        {category}
      </h3>

      {/* 기술 2열 그리드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {skills.map((skill, index) => (
          <SkillItem
            key={skill.name}
            skill={skill}
            isVisible={isVisible}
            /* 카테고리 base + 항목 순서 stagger */
            delayMs={baseDelayMs + index * 80}
          />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// SkillsSection: 기술 스택 전체 섹션
// =============================================================================

/** SKILLS_DATA를 카테고리별로 그룹핑 */
function groupSkillsByCategory(
  skills: typeof SKILLS_DATA
): Map<string, (typeof SKILLS_DATA)[number][]> {
  const map = new Map<string, (typeof SKILLS_DATA)[number][]>();
  for (const skill of skills) {
    const existing = map.get(skill.category) ?? [];
    map.set(skill.category, [...existing, skill]);
  }
  return map;
}

/**
 * Skills 섹션
 * - "Skills & Tech" 제목 (Skills는 primary, & Tech는 foreground)
 * - 카테고리별 그룹화 후 2열 그리드 배치
 * - 뷰포트 진입 시 순차 카운트업 + 프로그레스 바 애니메이션
 */
export function SkillsSection() {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const groupedSkills = groupSkillsByCategory(SKILLS_DATA);
  const categories = Array.from(groupedSkills.keys());

  return (
    <Section id="skills">
      {/* 섹션 제목 */}
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="mb-10 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="text-primary">Skills</span>
          <span className="text-foreground"> &amp; Tech</span>
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          현재까지 학습하고 사용해온 기술 스택입니다
        </p>
      </div>

      {/* 카테고리 목록 */}
      <div className="flex flex-col gap-10">
        {categories.map((category, categoryIndex) => {
          const skills = groupedSkills.get(category) ?? [];
          return (
            <SkillCategory
              key={category}
              category={category}
              skills={skills}
              isVisible={isVisible}
              /* 카테고리마다 150ms씩 지연 시작 */
              baseDelayMs={categoryIndex * 150}
            />
          );
        })}
      </div>
    </Section>
  );
}

'use client';

import { Section } from '@/components/layout/Section';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { SKILLS_DATA } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Skill } from '@/lib/types';

interface SkillItemProps {
  skill: Skill;
  isVisible: boolean;
  /** stagger delay (ms) — inline style로 적용 */
  delayMs: number;
}

/**
 * 단일 기술 항목
 * - 보더라인으로 구분된 가로 행: 좌측 굵은 기술명 + 우측 카테고리 라벨
 * - 프로그레스 바 대신 타이포그래피 크기/굵기로 존재감을 표현
 */
function SkillItem({ skill, isVisible, delayMs }: SkillItemProps) {
  return (
    <li
      className={cn(
        'group flex flex-col gap-1 border-t border-border/60 py-5',
        'sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:py-6',
        'transition-all duration-500 hover:bg-foreground/[0.02]',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      <span className="text-lg font-semibold tracking-tight text-foreground sm:text-xl md:text-2xl">
        {skill.name}
      </span>
      <span className="shrink-0 text-xs font-medium uppercase tracking-widest text-muted-foreground sm:text-sm">
        {skill.category}
      </span>
    </li>
  );
}

interface SkillCategoryProps {
  category: string;
  skills: readonly Skill[];
  isVisible: boolean;
  /** 카테고리 전체 base delay (ms) */
  baseDelayMs: number;
}

/**
 * 카테고리별 기술 그룹
 * - 카테고리 제목 + 기술 항목 세로 스택
 */
function SkillCategory({ category, skills, isVisible, baseDelayMs }: SkillCategoryProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3
        className={cn(
          'text-sm font-semibold uppercase tracking-widest text-muted-foreground',
          'transition-all duration-500',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        style={{ transitionDelay: `${baseDelayMs}ms` }}
      >
        {category}
      </h3>

      <ul className="flex flex-col">
        {skills.map((skill, index) => (
          <SkillItem
            key={skill.name}
            skill={skill}
            isVisible={isVisible}
            /* 카테고리 base + 항목 순서 stagger */
            delayMs={baseDelayMs + index * 80}
          />
        ))}
      </ul>
    </div>
  );
}

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
 * - "Skills & Tech" 제목
 * - 카테고리별 그룹화 후 세로 스택 배치
 * - 뷰포트 진입 시 순차 fade-in 애니메이션
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
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Skills &amp; Tech
        </h2>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
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

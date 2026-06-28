'use client';

import { useRef, useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * Skills & Career Timeline 섹션
 * - 기술 역량 분류 (Frontend, Architecture, Performance, Leadership)
 * - 숙련도 프로그레스 바
 * - 경력 타임라인
 * - 스크롤 기반 애니메이션
 */

interface Skill {
  name: string;
  proficiency: number; // 0-100
  category: 'Frontend' | 'Architecture' | 'Performance' | 'Leadership';
  yearsOfExperience?: number;
}

interface TimelineEvent {
  year: string;
  title: string;
  company?: string;
  description: string;
  achievements: string[];
}

const skills: Skill[] = [
  // Frontend
  { name: 'React & Next.js', proficiency: 95, category: 'Frontend', yearsOfExperience: 8 },
  { name: 'TypeScript', proficiency: 92, category: 'Frontend', yearsOfExperience: 6 },
  { name: 'CSS & Tailwind', proficiency: 90, category: 'Frontend', yearsOfExperience: 10 },
  { name: 'Web Components', proficiency: 85, category: 'Frontend', yearsOfExperience: 4 },

  // Architecture
  { name: 'System Design', proficiency: 88, category: 'Architecture', yearsOfExperience: 7 },
  { name: 'Micro-frontends', proficiency: 82, category: 'Architecture', yearsOfExperience: 5 },
  { name: 'Module Federation', proficiency: 80, category: 'Architecture', yearsOfExperience: 3 },
  { name: 'State Management', proficiency: 90, category: 'Architecture', yearsOfExperience: 8 },

  // Performance
  { name: 'Core Web Vitals', proficiency: 95, category: 'Performance', yearsOfExperience: 6 },
  { name: 'Code Splitting', proficiency: 88, category: 'Performance', yearsOfExperience: 6 },
  { name: 'Bundle Optimization', proficiency: 90, category: 'Performance', yearsOfExperience: 7 },
  { name: 'Performance Monitoring', proficiency: 85, category: 'Performance', yearsOfExperience: 5 },

  // Leadership
  { name: 'Technical Leadership', proficiency: 90, category: 'Leadership', yearsOfExperience: 5 },
  { name: 'Code Review & Mentoring', proficiency: 92, category: 'Leadership', yearsOfExperience: 6 },
  { name: 'Architecture Decisions', proficiency: 88, category: 'Leadership', yearsOfExperience: 5 },
  { name: 'Team Communication', proficiency: 92, category: 'Leadership', yearsOfExperience: 8 },
];

const timeline: TimelineEvent[] = [
  {
    year: '2024 – Present',
    title: 'Senior Frontend Architect',
    company: 'Enterprise Tech Company',
    description: 'Next-generation platform 개발 리더십. 마이크로프론트엔드 아키텍처 도입으로 팀 생산성 40% 향상.',
    achievements: [
      'Next.js 15 App Router 아키텍처 설계 및 구현',
      '성능 최적화로 Core Web Vitals 개선 (75% 이상)',
      '5명 개발팀의 기술 리더십 담당',
    ],
  },
  {
    year: '2022 – 2024',
    title: 'Frontend Tech Lead',
    company: 'Mid-scale SaaS',
    description: '디자인 시스템 아키텍트로서 150+ 컴포넌트 라이브러리 구축. 팀 표준화로 개발 속도 35% 증가.',
    achievements: [
      '엔터프라이즈급 디자인 시스템 설계 및 구현',
      'Figma + 자동화로 개발자 경험 향상',
      '8개 팀에 디자인 시스템 보급 (채택률 92%)',
    ],
  },
  {
    year: '2020 – 2022',
    title: 'Full Stack Developer',
    description: '성능 최적화 주도. 레거시 애플리케이션의 번들 크기 45% 감소 및 TTI 67% 개선.',
    achievements: [
      '번들 크기 45% 감소 (Webpack 최적화)',
      'Core Web Vitals 달성 (LCP < 2.5s)',
      '모놀리식 → 마이크로프론트엔드 마이그레이션',
    ],
  },
  {
    year: '2018 – 2020',
    title: 'Frontend Developer',
    description: 'React 생태계에 깊게 몰입. 성능과 접근성을 중심으로 한 컴포넌트 개발.',
    achievements: [
      'React 컴포넌트 라이브러리 구축',
      'WCAG 2.1 AA 접근성 준수',
      '팀 내 React 전문가로 성장',
    ],
  },
];

function SkillCategory({ category, categorySkills }: { category: string; categorySkills: Skill[] }) {
  const [isVisible, setIsVisible] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (categoryRef.current) {
      observer.observe(categoryRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={categoryRef}
      className={`space-y-6 ${isVisible ? 'fade-in' : 'opacity-0'} transition-all duration-300`}
    >
      <h3 className="text-xl font-bold text-slate-200">{category}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categorySkills.map((skill) => (
          <div key={skill.name} className="space-y-2">
            {/* 스킬명 + 경험 년수 */}
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-300">{skill.name}</p>
              {skill.yearsOfExperience && (
                <span className="text-xs font-medium text-slate-500">
                  {skill.yearsOfExperience}y
                </span>
              )}
            </div>

            {/* 프로그레스 바 */}
            <div className="relative h-2 rounded-full bg-slate-700/50 overflow-hidden">
              <div
                className={`
                  h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400
                  transition-all duration-1000 ease-out
                  ${isVisible ? 'w-full' : 'w-0'}
                `}
                style={{
                  width: isVisible ? `${skill.proficiency}%` : '0%',
                }}
              />
            </div>

            {/* 퍼센티지 표시 */}
            <p className="text-xs text-slate-500">{skill.proficiency}% Proficiency</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={itemRef}
      className={`relative pl-8 pb-12 ${isVisible ? 'fade-in' : 'opacity-0'} transition-all duration-300`}
    >
      {/* 타임라인 점 */}
      <div className="absolute left-0 top-0 h-4 w-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 border-4 border-slate-900" />

      {/* 연결선 (마지막 항목 제외) */}
      {index < 3 && (
        <div className="absolute left-1.5 top-4 -bottom-12 w-0.5 bg-gradient-to-b from-slate-600 to-transparent" />
      )}

      {/* 내용 */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-blue-400">{event.year}</p>
        <h4 className="text-xl font-bold text-slate-100">{event.title}</h4>
        {event.company && <p className="text-slate-400">{event.company}</p>}
        <p className="text-slate-400 leading-relaxed">{event.description}</p>

        {/* 성과 목록 */}
        <ul className="space-y-2 pt-3">
          {event.achievements.map((achievement, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-slate-400">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-400 flex-shrink-0" />
              <span>{achievement}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SkillsTimeline() {
  // 카테고리별로 스킬 그룹화
  const skillsByCategory = {
    Frontend: skills.filter((s) => s.category === 'Frontend'),
    Architecture: skills.filter((s) => s.category === 'Architecture'),
    Performance: skills.filter((s) => s.category === 'Performance'),
    Leadership: skills.filter((s) => s.category === 'Leadership'),
  };

  return (
    <section className="relative py-24 md:py-32 px-6 md:px-12">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* 좌측: 스킬 */}
          <div className="space-y-12">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-slate-100">Skills & Expertise</h2>
              <p className="text-slate-400">
                10년간 축적한 기술 역량과 리더십 경험
              </p>
            </div>

            {/* 스킬 카테고리별 표시 */}
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <SkillCategory key={category} category={category} categorySkills={categorySkills} />
            ))}
          </div>

          {/* 우측: 경력 타임라인 */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-slate-100">Career Timeline</h2>
              <p className="text-slate-400">
                성장의 과정과 주요 성과
              </p>
            </div>

            {/* 타임라인 */}
            <div className="space-y-2">
              {timeline.map((event, idx) => (
                <TimelineItem key={event.year} event={event} index={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

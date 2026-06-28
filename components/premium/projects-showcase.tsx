'use client';

import { useRef, useEffect, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';

/**
 * 프로젝트 쇼케이스 섹션
 * - 카드 호버 시 스케일업 + 보더 글로우
 * - 기술 스택 뱃지 표시
 * - 성과 메트릭 강조
 * - 스크롤 기반 fade-in 애니메이션
 */

interface ProjectCard {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  role: string;
  period: string;
  metrics: { label: string; value: string }[];
  links: { label: string; href: string; icon: string }[];
}

const projects: ProjectCard[] = [
  {
    id: 'nextjs-saas',
    title: 'Enterprise SaaS Platform',
    description: 'Next.js 15 App Router 기반 멀티테넌트 SaaS. ISR과 Edge Functions로 글로벌 성능 최적화.',
    technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    role: 'Frontend Architect',
    period: '2024 – Present',
    metrics: [
      { label: 'LCP', value: '1.8s' },
      { label: 'Users', value: '50K+' },
      { label: 'Uptime', value: '99.98%' },
    ],
    links: [
      { label: 'View Project', href: '#', icon: 'external' },
      { label: 'Repository', href: '#', icon: 'github' },
    ],
  },
  {
    id: 'design-system',
    title: 'Scalable Design System',
    description: '150개 이상의 컴포넌트를 포함한 엔터프라이즈급 디자인 시스템. Figma와 자동 동기화.',
    technologies: ['React', 'Storybook', 'TypeScript', 'CSS-in-JS', 'Figma API'],
    role: 'Design System Lead',
    period: '2023 – 2024',
    metrics: [
      { label: 'Components', value: '150+' },
      { label: 'Teams Using', value: '8' },
      { label: 'Adoption', value: '92%' },
    ],
    links: [
      { label: 'View Project', href: '#', icon: 'external' },
    ],
  },
  {
    id: 'performance-audit',
    title: 'Performance Optimization Initiative',
    description: '레거시 애플리케이션 성능 개선. 번들 크기 45% 감소, 초기 로드 시간 3배 개선.',
    technologies: ['Performance Monitoring', 'Webpack', 'React Suspense', 'Code Splitting'],
    role: 'Performance Engineer',
    period: '2023',
    metrics: [
      { label: 'Bundle Size', value: '-45%' },
      { label: 'Load Time', value: '-67%' },
      { label: 'TTI', value: '2.3s' },
    ],
    links: [
      { label: 'Case Study', href: '#', icon: 'external' },
    ],
  },
];

function ProjectCardComponent({ project }: { project: ProjectCard }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`
        group relative
        ${isVisible ? 'fade-in' : 'opacity-0'}
        transition-all duration-300
      `}
    >
      {/* 카드 배경 */}
      <div
        className={`
          relative h-full p-6 md:p-8 rounded-2xl border
          border-slate-700/50 hover:border-blue-400/50
          bg-gradient-to-br from-slate-800/30 to-slate-900/30
          backdrop-blur-xl
          transition-all duration-500
          hover:shadow-[0_0_60px_rgba(59,130,246,0.15)]
          group-hover:scale-105 group-hover:-translate-y-2
        `}
      >
        {/* 내부 그래디언트 오버레이 */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 bg-gradient-to-br from-white to-transparent transition-opacity duration-500" />

        {/* 콘텐츠 */}
        <div className="relative z-10 space-y-4">
          {/* 헤더: 제목 + 기간 */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-slate-100 group-hover:text-white transition-colors">
                {project.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500 group-hover:text-slate-400">
                {project.period} • {project.role}
              </p>
            </div>
          </div>

          {/* 설명 */}
          <p className="text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
            {project.description}
          </p>

          {/* 메트릭스 */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-700/50">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <p className="text-lg font-bold text-blue-400">{metric.value}</p>
                <p className="text-xs text-slate-500">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* 기술 스택 */}
          <div className="flex flex-wrap gap-2 pt-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* 링크 */}
          <div className="flex gap-3 pt-4">
            {project.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 border border-slate-600/50 hover:border-blue-400/50 hover:text-blue-300 hover:bg-blue-400/5 transition-all"
              >
                {link.icon === 'external' ? (
                  <ExternalLink className="h-4 w-4" />
                ) : (
                  <Github className="h-4 w-4" />
                )}
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsShowcase() {
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-12">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100">
            Featured Projects
          </h2>
          <p className="text-lg text-slate-400">
            대규모 팀과의 협업으로 완성한 엔터프라이즈급 프로젝트와 성능 최적화 사례
          </p>
        </div>

        {/* 프로젝트 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCardComponent key={project.id} project={project} />
          ))}
        </div>

        {/* 더 보기 링크 */}
        <div className="mt-16 text-center">
          <Link
            href="#"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-slate-200 border border-slate-600 hover:border-blue-400 hover:text-blue-300 hover:bg-blue-400/5 transition-all"
          >
            View All Projects
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

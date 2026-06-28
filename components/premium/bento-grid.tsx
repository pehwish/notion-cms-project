'use client';

import { useRef, useEffect, useState } from 'react';
import { Code2, Zap, Shield, Award } from 'lucide-react';

/**
 * Bento Grid 레이아웃 컴포넌트
 * - 비대칭 배치로 시각적 흥미 유발
 * - 각 타일에 glassmorphism 효과 + 호버 애니메이션
 * - 스크롤 기반 Fade-in 애니메이션
 * - 반응형: 모바일(1열) → 태블릿(2열) → 데스크탑(4열)
 */

type TileVariant = 'large' | 'medium' | 'small';

interface BentoTile {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  variant: TileVariant;
  category: 'project' | 'skill' | 'achievement';
  metrics?: { label: string; value: string }[];
  color: 'blue' | 'cyan' | 'purple' | 'green';
}

const tiles: BentoTile[] = [
  {
    id: 'performance',
    title: 'Performance Excellence',
    description: 'Core Web Vitals 최적화로 LCP < 2.5s, CLS < 0.1 달성. 번들 크기 40% 감소 및 렌더링 성능 3배 개선.',
    icon: <Zap className="h-8 w-8" />,
    variant: 'large',
    category: 'achievement',
    metrics: [
      { label: 'LCP Improvement', value: '65%' },
      { label: 'Bundle Size', value: '-40%' },
    ],
    color: 'blue',
  },
  {
    id: 'architecture',
    title: 'System Architecture',
    description: '마이크로프론트엔드, 모놀리식, 하이브리드 아키텍처 설계 및 구축. 대규모 팀 협업을 위한 스케일 가능한 구조 제공.',
    icon: <Code2 className="h-8 w-8" />,
    variant: 'medium',
    category: 'skill',
    color: 'cyan',
  },
  {
    id: 'accessibility',
    title: 'Web Accessibility',
    description: 'WCAG 2.1 AA 준수. 스크린 리더, 키보드 네비게이션, 포커스 관리를 통한 모든 사용자를 위한 인터페이스.',
    icon: <Shield className="h-8 w-8" />,
    variant: 'medium',
    category: 'achievement',
    color: 'green',
  },
  {
    id: 'leadership',
    title: 'Technical Leadership',
    description: '5명 이상 팀 규모의 기술 리더십. 코드 리뷰, 멘토링, 아키텍처 의사결정 및 성능 최적화 주도.',
    icon: <Award className="h-8 w-8" />,
    variant: 'small',
    category: 'skill',
    color: 'purple',
  },
];

function BentoTileComponent({ tile }: { tile: BentoTile }) {
  const [isVisible, setIsVisible] = useState(false);
  const tileRef = useRef<HTMLDivElement>(null);

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

    if (tileRef.current) {
      observer.observe(tileRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const colorClasses = {
    blue: {
      border: 'border-blue-500/20 hover:border-blue-400/50',
      bg: 'bg-blue-500/5 hover:bg-blue-500/10',
      icon: 'text-blue-400',
      glow: 'group-hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]',
    },
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-400/50',
      bg: 'bg-cyan-500/5 hover:bg-cyan-500/10',
      icon: 'text-cyan-400',
      glow: 'group-hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]',
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-400/50',
      bg: 'bg-purple-500/5 hover:bg-purple-500/10',
      icon: 'text-purple-400',
      glow: 'group-hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]',
    },
    green: {
      border: 'border-green-500/20 hover:border-green-400/50',
      bg: 'bg-green-500/5 hover:bg-green-500/10',
      icon: 'text-green-400',
      glow: 'group-hover:shadow-[0_0_40px_rgba(34,197,94,0.15)]',
    },
  };

  const variantClasses = {
    large: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-2',
    medium: 'col-span-1 md:col-span-1 lg:col-span-1 row-span-1',
    small: 'col-span-1 md:col-span-1 lg:col-span-1 row-span-1',
  };

  const colors = colorClasses[tile.color];

  return (
    <div
      ref={tileRef}
      className={`
        group relative ${variantClasses[tile.variant]}
        ${isVisible ? 'fade-in' : 'opacity-0'}
        transition-all duration-300
      `}
    >
      {/* 타일 배경 + 글래스모피즘 */}
      <div
        className={`
          relative h-full p-6 md:p-8 rounded-2xl
          border backdrop-blur-xl
          ${colors.border} ${colors.bg}
          transition-all duration-500
          ${colors.glow}
        `}
      >
        {/* 배경 그래디언트 오버레이 */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 bg-gradient-to-br from-white to-transparent transition-opacity duration-500" />

        {/* 내용 */}
        <div className="relative z-10 flex flex-col h-full">
          {/* 아이콘 */}
          <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 ${colors.icon}`}>
            {tile.icon}
          </div>

          {/* 제목 */}
          <h3 className="mb-3 text-xl font-bold text-slate-100 group-hover:text-white transition-colors">
            {tile.title}
          </h3>

          {/* 설명 */}
          <p className="mb-6 text-sm leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors flex-1">
            {tile.description}
          </p>

          {/* 메트릭스 (있으면 표시) */}
          {tile.metrics && tile.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-700/50">
              {tile.metrics.map((metric) => (
                <div key={metric.label} className="space-y-1">
                  <p className="text-xs font-semibold text-slate-300">{metric.value}</p>
                  <p className="text-xs text-slate-500">{metric.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BentoGrid() {
  return (
    <section id="projects" className="relative py-24 md:py-32 px-6 md:px-12">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Crect%20width=%2260%22%20height=%2260%22%20fill=%22none%22%20stroke=%22white%22%20stroke-width=%220.5%22%20opacity=%220.5%22/%3E%3C/svg%3E')] bg-repeat" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100">
            Core Competencies & Impact
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            기술적 리더십과 성능 최적화를 통해 창출한 비즈니스 가치와 기술적 성과
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[300px] lg:auto-rows-[320px]">
          {tiles.map((tile) => (
            <BentoTileComponent key={tile.id} tile={tile} />
          ))}
        </div>
      </div>
    </section>
  );
}

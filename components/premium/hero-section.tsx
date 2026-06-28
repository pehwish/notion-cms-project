'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

/**
 * 프리미엄 포트폴리오 Hero 섹션
 * - 대형 타이포그래피로 강렬한 첫인상 전달
 * - "Frontend Architect" 직무명 강조
 * - 다크모드 최적화
 * - 마이크로 인터랙션: 호버 시 테두리 글로우 + 아이콘 애니메이션
 */
export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 배경 그래디언트 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />

      {/* 배경 애니메이션: 미세한 움직임 패턴 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="1" fill="white"/></svg>')] bg-repeat" />
      </div>

      {/* 콘텐츠 컨테이너 */}
      <div className="relative z-10 max-w-5xl px-6 md:px-12 text-center">
        {/* 배지: "Open to Opportunities" */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/5 px-4 py-2 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-300">
            Senior Frontend Architect • Open to Opportunities
          </span>
        </div>

        {/* 주 제목: 초대형 타이포그래피 */}
        <h1 className="mb-6 text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tighter">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-blue-200 to-slate-100">
            10+ Years of
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400">
            Frontend Excellence
          </span>
        </h1>

        {/* 부제: 설명 */}
        <p className="mx-auto mb-10 max-w-3xl text-lg sm:text-xl text-slate-300 leading-relaxed">
          시스템 아키텍처 설계부터 성능 최적화까지.
          <span className="block sm:inline"> 웹 표준과 사용자 경험을 중심으로 스케일 가능한 솔루션을 구축합니다.</span>
        </p>

        {/* CTA 버튼 그룹 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Primary CTA */}
          <Link
            href="#projects"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 overflow-hidden"
          >
            {/* 배경: 그래디언트 + 호버 글로우 */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg" />
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-400 to-blue-500 blur-lg" />

            {/* 콘텐츠 */}
            <span className="relative flex items-center gap-2">
              View My Work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Secondary CTA */}
          <Link
            href="#about"
            className="group relative inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold text-slate-200 transition-all duration-300 border border-slate-600 hover:border-blue-400 hover:text-blue-300 hover:bg-blue-400/5"
          >
            Learn More
          </Link>
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="mt-16 flex justify-center">
          <div className="animate-bounce">
            <div className="flex flex-col items-center gap-2 text-slate-400 text-sm">
              <span>Scroll to explore</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 우측 데코레이션: 추상 형태 */}
      <div className="absolute -right-32 -top-32 h-96 w-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute -left-32 bottom-0 h-96 w-96 bg-gradient-to-tr from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />
    </section>
  );
}

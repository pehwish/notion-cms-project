'use client';

import { ArrowRight, Mail, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

/**
 * CTA (Call-to-Action) 섹션
 * - 연락처 정보 강조
 * - 소셜 링크
 * - 마지막 강력한 액션 유도
 * - Glassmorphism 배경
 */

export function CTASection() {
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-12">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 via-slate-950 to-slate-900" />

      {/* 배경 글로우 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
        {/* 제목 */}
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100">
            Ready to collaborate?
          </h2>
          <p className="text-lg text-slate-400">
            새로운 프로젝트나 기술적 협업에 관심이 있다면 편하게 연락주세요.
          </p>
        </div>

        {/* 연락처 옵션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
          {/* 이메일 */}
          <Link
            href="mailto:pehwish@gmail.com"
            className="group relative p-6 rounded-2xl border border-slate-700/50 hover:border-blue-400/50 bg-slate-800/30 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">Email</p>
                <p className="text-sm text-slate-400">pehwish@gmail.com</p>
              </div>
            </div>
          </Link>

          {/* Github */}
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-6 rounded-2xl border border-slate-700/50 hover:border-blue-400/50 bg-slate-800/30 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Github className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">GitHub</p>
                <p className="text-sm text-slate-400">View my code</p>
              </div>
            </div>
          </Link>

          {/* LinkedIn */}
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-6 rounded-2xl border border-slate-700/50 hover:border-blue-400/50 bg-slate-800/30 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Linkedin className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">LinkedIn</p>
                <p className="text-sm text-slate-400">Connect with me</p>
              </div>
            </div>
          </Link>
        </div>

        {/* 주요 CTA 버튼 */}
        <div className="pt-8">
          <a
            href="mailto:pehwish@gmail.com?subject=Let%27s%20collaborate&body=Hi%20Eunhye%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20you."
            className="group relative inline-flex items-center justify-center gap-2 px-10 py-4 rounded-lg font-semibold text-white transition-all duration-300 overflow-hidden"
          >
            {/* 배경: 그래디언트 + 호버 글로우 */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 rounded-lg" />
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 blur-lg" />

            {/* 콘텐츠 */}
            <span className="relative flex items-center gap-2">
              Send me an email
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </div>

        {/* 하단 텍스트 */}
        <p className="text-slate-500 text-sm pt-8">
          또는{' '}
          <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
            이력서 다운로드
          </Link>{' '}
          하기
        </p>
      </div>
    </section>
  );
}

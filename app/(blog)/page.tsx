/**
 * 포트폴리오 홈 페이지 - 리디자인 2026
 * Hero + Core Strength + Featured Projects + Contact CTA
 *
 * 변경: 채용 관점 강점 강화
 * - "무엇을 했는가" → "어떤 가치를 만드는 사람인가"로 전환
 * - 11년 경력 + 4개 핵심 역량 강조
 * - 대표작 4개만 홈 페이지에 표시
 * - 전체 목록은 /projects 분리
 */

import { Container } from '@/components/layout/Container';
import type { Metadata } from 'next';
import type { Post } from '@/lib/types';
import { PostCard } from '@/components/blog/PostCard';
import { SITE_CONFIG, PROFILE_DATA, HERO_METRICS } from "@/lib/constants";
import { fetchPublishedPosts } from '@/lib/notion';
import { CoreStrengthSection } from '@/components/home/CoreStrengthSection';
import { ContactCTASection } from '@/components/home/ContactCTASection';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home',
  description: SITE_CONFIG.description,
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description
  }
};

export const revalidate = 3600;

export default async function BlogHomePage() {
  /* Notion API에서 발행된 글 목록 조회 */
  let allPosts: Post[] = [];
  try {
    allPosts = await fetchPublishedPosts();
  } catch (error) {
    console.error('홈 페이지 글 목록 조회 실패:', error);
  }

  /* Featured Projects: 최신 4개 프로젝트 */
  const displayPosts = allPosts.slice(0, 4);

  return (
    <div>
      {/* ── Hero 섹션: 11년 경력 강조 ────────────────────────── */}
      <section
        aria-labelledby="portfolio-hero-title"
        className="relative min-h-[90vh] flex items-center justify-center bg-[#FCFCFC] dark:bg-[#0A0A0A]"
      >
        <Container>
          <div className="py-24 lg:py-32 text-center">
            {/* 경력 배지 */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 backdrop-blur-sm px-4 py-1.5 text-sm text-muted-foreground mb-8">
              Frontend Engineer · 금융 · 공공 · 커머스
            </div>

            {/* H1: 미니멀 타이포 */}
            <h1
              id="portfolio-hero-title"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-foreground max-w-5xl mx-auto"
            >
              Frontend Engineer
              <br />
              11년의 경험
            </h1>

            {/* 부제 */}
            <p className="mt-6 max-w-2xl mx-auto text-base lg:text-lg leading-[1.7] text-muted-foreground">
              금융·공공·커머스 도메인에서 13개 이상의 서비스를 구축하고 운영했습니다.
              React, Vue, React Native 기반의 프론트엔드 개발과 웹 접근성, 협업, 서비스 운영을 통해
              사용자와 비즈니스 모두에게 가치 있는 경험을 만듭니다.
            </p>

            {/* CTA 버튼 */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#featured-projects"
                className="h-[52px] px-6 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black font-semibold text-base inline-flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                대표 프로젝트 보기
              </a>
              <a
                href={PROFILE_DATA.resumeUrl}
                className="h-[52px] px-6 rounded-full border border-current font-semibold text-base inline-flex items-center justify-center hover:bg-foreground/5 transition-colors"
              >
                이력서 다운로드
              </a>
            </div>

            {/* 핵심 지표 4개 카드 */}
            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {HERO_METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-border/80 bg-background p-6 text-center hover:border-foreground/30 transition-colors"
                >
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-sm font-semibold mt-1">{metric.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{metric.sublabel}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Core Strength 섹션 ────────────────────────────── */}
      <CoreStrengthSection />

      {/* ── Featured Projects 섹션 ──────────────────────── */}
      <section
        id="featured-projects"
        aria-labelledby="featured-projects-title"
        className="py-20 lg:py-28 bg-[#F7F7F7] dark:bg-slate-900/30"
      >
        <Container>
          <div className="flex items-end justify-between mb-12 flex-col sm:flex-row gap-4">
            <div>
              <h2
                id="featured-projects-title"
                className="text-2xl sm:text-3xl font-semibold"
              >
                Featured Projects
              </h2>
              <p className="mt-3 text-muted-foreground text-base lg:text-lg">
                금융·공공·커머스 도메인의 대표 프로젝트
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 text-sm font-medium hover:underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              모든 프로젝트 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 2열 그리드, 최대 4개 */}
          {displayPosts.length > 0 ? (
            <ul
              className="grid grid-cols-1 sm:grid-cols-2 gap-8"
              aria-label="대표 프로젝트 목록"
            >
              {displayPosts.map((post) => (
                <li key={post.id ?? post.slug}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>프로젝트를 불러올 수 없습니다.</p>
            </div>
          )}

          {/* 모바일용 "전체 보기" 링크 */}
          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 font-medium underline underline-offset-4"
            >
              모든 프로젝트 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ── Contact CTA 섹션 ────────────────────────────── */}
      <ContactCTASection />
    </div>
  );
}

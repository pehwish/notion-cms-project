/**
 * 블로그 홈 페이지 - 글 목록
 * 발행된 모든 블로그 글을 최신 순서로 표시
 * F-01: Notion API 연동으로 글 목록 조회
 */

import type { Metadata } from "next";
import Link from "next/link";
import { PenLine } from "lucide-react";
import { Container } from "@/components/layout/container";
import { PostList } from "@/components/blog/post-list";
import { CategoryFilter } from "@/components/blog/category-filter";
import { SearchBar } from "@/components/blog/search-bar";
import { Separator } from "@/components/ui/separator";
import { SITE_CONFIG } from "@/lib/constants";
import { fetchPublishedPosts } from "@/lib/notion";
import type { Post } from "@/lib/types";

export const metadata: Metadata = {
  title: "블로그",
  description: `${SITE_CONFIG.description} — 모든 글 목록`,
  openGraph: {
    title: `블로그 | ${SITE_CONFIG.name}`,
    description: `${SITE_CONFIG.description} — 모든 글 목록`,
  },
};

/**
 * ISR: 3600초(1시간) 주기로 페이지 재검증
 * 변수 대신 리터럴로 명시 (Next.js 정적 분석 호환성)
 */
export const revalidate = 3600;

/** 홈 페이지 검색 파라미터 타입 */
interface BlogHomePageProps {
  searchParams: Promise<{
    /** 카테고리 필터: /?category=React */
    category?: string;
    /** 키워드 검색: /?q=typescript */
    q?: string;
  }>;
}

export default async function BlogHomePage({
  searchParams,
}: BlogHomePageProps) {
  const { category, q } = await searchParams;

  // Notion API에서 발행된 글 목록 조회 (에러 시 빈 배열 반환)
  let allPosts: Post[] = [];
  try {
    allPosts = await fetchPublishedPosts();
  } catch (error) {
    console.error("홈 페이지 글 목록 조회 실패:", error);
  }

  // 카테고리 목록 추출 (중복 제거, 빈 값 제외)
  const categories = Array.from(
    new Set(allPosts.map((p) => p.category).filter((c): c is string => Boolean(c)))
  );

  // 필터링 로직: category, q 쿼리 파라미터 적용
  let posts: Post[] = allPosts;

  if (category) {
    posts = posts.filter((p) => p.category === category);
  }

  if (q) {
    const keyword = q.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(keyword) ||
        p.tags?.some((t) => t.toLowerCase().includes(keyword))
    );
  }

  return (
    <div className="py-10 sm:py-14 lg:py-16">
      <Container>
        {/* 페이지 헤더 영역: section + header 구조로 명시적 레이블 지정 */}
        <section aria-labelledby="blog-page-title" className="mb-10">
          <header>
            <h1
              id="blog-page-title"
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              블로그
            </h1>
            <p className="mt-2 text-muted-foreground text-base sm:text-lg">
              개발 경험과 지식을 기록하고 공유합니다.
            </p>
          </header>
        </section>

        {/* 검색 및 필터 영역 */}
        <section
          className="mb-8 space-y-4"
          aria-label="글 검색 및 카테고리 필터"
        >
          {/* 검색바 */}
          <SearchBar defaultValue={q} />

          {/* 카테고리 필터: 카테고리가 있을 때만 표시 */}
          {categories.length > 0 && (
            <>
              <Separator />
              <CategoryFilter
                categories={categories}
                selectedCategory={category}
              />
            </>
          )}

          {/* 활성 필터 상태 표시 */}
          {(category || q) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {q && (
                  <>
                    <span className="font-medium text-foreground">
                      &ldquo;{q}&rdquo;
                    </span>{" "}
                    검색 결과
                  </>
                )}
                {q && category && " · "}
                {category && (
                  <>
                    카테고리:{" "}
                    <span className="font-medium text-foreground">
                      {category}
                    </span>
                  </>
                )}
              </span>
              {/* TODO (Phase 4): 필터 초기화 링크 구현 */}
              <Link
                href="/"
                aria-label="검색 필터 초기화"
                className="ml-auto text-xs underline-offset-4 hover:underline"
              >
                필터 초기화
              </Link>
            </div>
          )}
        </section>

        <Separator className="mb-8" />

        {/* 글 목록 영역 */}
        <section aria-label="블로그 글 목록">
          {posts.length > 0 ? (
            <PostList posts={posts} />
          ) : (
            /* Phase 3 이전 빈 상태 안내 플레이스홀더 */
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-20 text-center">
              <PenLine
                className="mb-4 h-10 w-10 text-muted-foreground"
                aria-hidden="true"
              />
              <h2 className="text-lg font-semibold">아직 글이 없습니다</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {q || category
                  ? "검색 조건에 맞는 글을 찾지 못했습니다. 다른 조건으로 검색해 보세요."
                  : "Notion에서 글을 작성하고 발행하면 여기에 표시됩니다."}
              </p>
            </div>
          )}
        </section>
      </Container>
    </div>
  );
}

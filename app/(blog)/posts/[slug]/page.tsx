/**
 * 블로그 글 상세 페이지
 * Notion API에서 글 데이터를 조회하여 렌더링 (F-02: 개별 글 상세 페이지)
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, FolderOpen } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SITE_CONFIG } from "@/lib/constants";
import { fetchPublishedPosts, fetchPostBySlug, fetchPageBlocks } from "@/lib/notion";
import { PostContent } from "@/components/blog/post-content";
import { type NotionBlock } from "@/lib/notion-blocks";

/**
 * ISR: 3600초(1시간) 주기로 페이지 재검증
 * 변수 대신 리터럴로 명시 (Next.js 정적 분석 호환성)
 */
export const revalidate = 3600;

/**
 * generateStaticParams에 없는 slug도 요청 시 동적으로 생성 허용
 * Phase 3 전까지는 빈 배열이므로 true로 설정하여 모든 slug를 허용
 */
export const dynamicParams = true;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * 동적 메타데이터 생성
 * Notion API에서 글 정보를 조회하여 title, description, openGraph 생성
 */
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await fetchPostBySlug(slug);

    if (!post) {
      return { title: "글을 찾을 수 없습니다" };
    }

    return {
      title: post.title,
      description: post.description,
      openGraph: {
        title: `${post.title} | ${SITE_CONFIG.name}`,
        description: post.description,
        type: "article",
        // lastEditedAt은 Notion 마지막 수정일 (ISO 8601 형식)
        publishedTime: post.lastEditedAt
          ? new Date(post.lastEditedAt).toISOString()
          : undefined,
      },
    };
  } catch {
    return { title: "글을 찾을 수 없습니다" };
  }
}

/**
 * 정적 경로 사전 생성
 * 빌드 시 발행된 글의 slug를 모두 조회하여 정적 페이지 미리 생성
 * 에러 발생 시 빈 배열을 반환하여 빌드 실패 방지 (dynamicParams=true로 런타임 생성)
 */
export async function generateStaticParams() {
  try {
    const posts = await fetchPublishedPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error("정적 경로 생성 실패:", error);
    return [];
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  // slug로 글 조회 (없으면 404)
  let post;
  try {
    post = await fetchPostBySlug(slug);
  } catch (error) {
    console.error(`글 조회 실패 (slug: ${slug}):`, error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  // Notion 페이지 블록 조회 (본문 렌더링용)
  let blocks: NotionBlock[] = [];
  try {
    if (post.id) {
      const rawBlocks = await fetchPageBlocks(post.id);
      // fetchPageBlocks는 unknown[] 반환 → NotionBlock[]으로 캐스팅
      blocks = rawBlocks as NotionBlock[];
    }
  } catch (error) {
    // 블록 조회 실패 시 빈 배열로 처리 (PostContent가 빈 상태 UI 표시)
    console.error(`블록 조회 실패 (pageId: ${post.id}):`, error);
  }

  // 투입 기간 레이블 (포트폴리오 프로젝트인 경우)
  const periodLabel = post.period || null;

  // JSON-LD Article 스키마 (SEO 최적화)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description || post.title,
    datePublished: post.lastEditedAt
      ? new Date(post.lastEditedAt).toISOString()
      : new Date().toISOString(),
    dateModified: post.lastEditedAt
      ? new Date(post.lastEditedAt).toISOString()
      : new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: SITE_CONFIG.name,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
    },
    image: post.imageUrl || `${SITE_CONFIG.url}/og-image.png`,
    url: `${SITE_CONFIG.url}/posts/${post.slug}`,
  };

  return (
    <div className="py-10 sm:py-14">
      {/* JSON-LD 구조화된 데이터 (Google Search Console 및 검색 엔진 최적화) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Container>
        {/* 뒤로 가기 네비게이션 */}
        <nav className="mb-8" aria-label="페이지 네비게이션">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>블로그로 돌아가기</span>
          </Link>
        </nav>

        {/* 글 콘텐츠 영역: 최대 너비를 제한하여 가독성 향상 */}
        <div className="mx-auto max-w-3xl">
          {/* 글 헤더: 제목 + 메타정보 */}
          <header className="mb-8">
            {/* 카테고리 */}
            {post.category && (
              <div className="mb-4 flex items-center gap-2">
                <FolderOpen
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="text-sm text-muted-foreground">
                  {post.category}
                </span>
              </div>
            )}

            {/* 글 제목 */}
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {/* 투입 기간 */}
            {periodLabel && (
              <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>{periodLabel}</span>
              </div>
            )}

            {/* 태그 목록 */}
            {post.tags && post.tags.length > 0 && (
              <div
                className="mt-4 flex flex-wrap items-center gap-2"
                aria-label="글 태그"
              >
                <Tag
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          <Separator className="mb-10" />

          {/* 글 본문 영역 */}
          <PostContent blocks={blocks} />

          <Separator className="mt-12 mb-8" />

          {/* 하단 네비게이션 */}
          <nav
            className="flex items-center justify-center"
            aria-label="글 목록 네비게이션"
          >
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              목록으로
            </Link>
          </nav>
        </div>
      </Container>
    </div>
  );
}

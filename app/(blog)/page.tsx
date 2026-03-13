/**
 * 블로그 홈 페이지 - Hero + 탭 필터 + 카드 그리드 레이아웃
 * F-01: Notion API 연동으로 글 목록 조회
 * F-03: 카테고리 탭 필터링 (/?category=name)
 * F-04: 키워드 검색 (/?q=keyword)
 */

import { Container } from '@/components/layout/Container';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PenLine } from 'lucide-react';
import type { Post } from '@/lib/types';
import { PostCard } from '@/components/blog/PostCard';
import { SITE_CONFIG } from '@/lib/constants';
import { fetchPublishedPosts } from '@/lib/notion';

export const metadata: Metadata = {
  title: '블로그',
  description: `${SITE_CONFIG.description} — 모든 글 목록`,
  openGraph: {
    title: `블로그 | ${SITE_CONFIG.name}`,
    description: `${SITE_CONFIG.description} — 모든 글 목록`
  }
};

/**
 * ISR: 3600초(1시간) 주기로 페이지 재검증
 * 변수 대신 리터럴로 명시 (Next.js 정적 분석 호환성)
 */
export const revalidate = 3600;

/** 홈 페이지 검색 파라미터 타입 */
interface BlogHomePageProps {
  searchParams: Promise<{
    /** 기술 스택 필터: /?category=React */
    category?: string;
    /** 키워드 검색: /?q=typescript */
    q?: string;
  }>;
}

/**
 * 한글 역할을 영어로 변환하는 매핑 함수
 */
function translateRoleToEnglish(role: string): string {
  const roleMap: Record<string, string> = {
    '프론트엔드': 'Frontend',
    '프론트엔드 개발자': 'Frontend Developer',
    '웹 퍼블리셔': 'Web Publisher',
    '백엔드': 'Backend',
    '백엔드 개발자': 'Backend Developer',
    '풀스택': 'Full Stack',
    '풀스택 개발자': 'Full Stack Developer',
    'PM': 'PM',
    '제품 관리자': 'Product Manager',
    '디자이너': 'Designer',
    'UI/UX 디자이너': 'UI/UX Designer',
    '마케팅': 'Marketing',
    '마케팅 담당자': 'Marketing Manager',
    '개발팀': 'Developer',
    '리더': 'Lead',
    '팀장': 'Team Lead',
  };
  return roleMap[role] ?? role; // 매핑이 없으면 원본 반환
}

/**
 * 탭 아이템 스타일 헬퍼 함수
 * 활성 탭: 중간 굵기 텍스트 + 하단 언더라인, 비활성 탭: 흐린 텍스트
 */
function getTabClassName(isActive: boolean): string {
  const base =
    'inline-block whitespace-nowrap px-4 py-3 text-sm font-medium transition-all duration-150';
  if (isActive) {
    return `${base} text-foreground border-b-2 border-foreground`;
  }
  return `${base} text-muted-foreground hover:text-foreground`;
}

export default async function BlogHomePage({
  searchParams
}: BlogHomePageProps) {
  const { category, q } = await searchParams;

  /* Notion API에서 발행된 글 목록 조회 (에러 시 빈 배열 반환) */
  let allPosts: Post[] = [];
  try {
    allPosts = await fetchPublishedPosts();
  } catch (error) {
    console.error('홈 페이지 글 목록 조회 실패:', error);
  }

  /* 역할 목록 추출 (중복 제거, 빈 값 제외, 사용 횟수로 내림차순 정렬) */
  const roleCountMap = new Map<string, number>();
  allPosts.forEach(p => {
    p.roles?.forEach(role => {
      roleCountMap.set(role, (roleCountMap.get(role) ?? 0) + 1);
    });
  });

  const roles = Array.from(roleCountMap)
    .sort((a, b) => b[1] - a[1]) // 카운트 많은 순서로 정렬
    .map(([role]) => role);

  /* 필터링 로직: category(역할), q 쿼리 파라미터 적용 */
  let posts: Post[] = allPosts;

  if (category) {
    posts = posts.filter(p =>
      p.roles?.some(r => r === category)
    );
  }

  if (q) {
    const keyword = q.toLowerCase();
    posts = posts.filter(
      p =>
        p.title.toLowerCase().includes(keyword) ||
        p.tags?.some(t => t.toLowerCase().includes(keyword))
    );
  }

  return (
    <div>
      {/* ── Hero 섹션 ─────────────────────────────────────────────── */}
      <section
        aria-labelledby='blog-hero-title'
        className='border-b border-border'
      >
        <Container>
          <div className='grid grid-cols-1 gap-12 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24'>
            {/* 좌측: 대형 타이틀 */}
            <div className='flex flex-col justify-center'>
              <h1
                id='blog-hero-title'
                className='text-6xl font-bold leading-none tracking-tight sm:text-7xl lg:text-8xl'
              >
                블로그
              </h1>
              <p className='mt-6 max-w-sm text-lg leading-relaxed text-muted-foreground'>
                개발 경험과 지식을 기록하고 공유합니다. 실무에서 배운 것들을
                솔직하게 써내려갑니다.
              </p>
              {/* 총 글 수 표시 */}
              {allPosts.length > 0 && (
                <p className='mt-4 text-sm text-muted-foreground'>
                  총{' '}
                  <span className='font-semibold text-foreground'>
                    {allPosts.length}
                  </span>
                  편의 글
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ── 탭 필터 + 검색 바 ──────────────────────────────────────── */}
      <div className='border-b border-border bg-background'>
        <Container>
          <div className='flex items-stretch gap-4'>
            {/* 역할 탭 목록: 가로 스크롤 지원 */}
            <nav
              aria-label='역할 필터'
              className='min-w-0 flex-1 overflow-x-auto'
            >
              <ul className='flex' role='list'>
                {/* View all 탭 */}
                <li>
                  <Link
                    href={q ? `/?q=${encodeURIComponent(q)}` : '/'}
                    aria-current={!category ? 'page' : undefined}
                    className={getTabClassName(!category)}
                  >
                    View all
                  </Link>
                </li>

                {/* 개별 역할 탭 */}
                {roles.map(role => {
                  const isActive = category === role;
                  const href = q
                    ? `/?category=${encodeURIComponent(role)}&q=${encodeURIComponent(q)}`
                    : `/?category=${encodeURIComponent(role)}`;
                  const displayRole = translateRoleToEnglish(role);
                  return (
                    <li key={role}>
                      <Link
                        href={href}
                        aria-current={isActive ? 'page' : undefined}
                        className={getTabClassName(isActive)}
                      >
                        {displayRole}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* 검색 입력: 데스크탑에서만 탭 오른쪽에 표시 */}
            <div
              className='hidden shrink-0 items-center sm:flex'
              aria-label='글 검색'
            >
              {/* TODO: 검색 로직 구현 필요 (form action으로 q 파라미터 전달) */}
              <form action='/' method='get' role='search'>
                {/* category 필터 유지를 위한 hidden input */}
                {category && (
                  <input type='hidden' name='category' value={category} />
                )}
                <Input
                  type='search'
                  name='q'
                  placeholder='검색...'
                  defaultValue={q ?? ''}
                  className='h-8 w-44 text-sm lg:w-56'
                  aria-label='글 검색'
                />
              </form>
            </div>
          </div>
        </Container>
      </div>

      {/* ── 글 목록 영역 ───────────────────────────────────────────── */}
      <Container>
        <section className='py-10 lg:py-14' aria-label='블로그 글 목록'>
          {/* 활성 필터 상태 표시 */}
          {(category || q) && (
            <div className='mb-8 flex items-center gap-2 text-sm text-muted-foreground'>
              <span>
                {q && (
                  <>
                    <span className='font-medium text-foreground'>
                      &ldquo;{q}&rdquo;
                    </span>{' '}
                    검색 결과
                  </>
                )}
                {q && category && ' · '}
                {category && (
                  <>
                    Role:{' '}
                    <span className='font-medium text-foreground'>
                      {translateRoleToEnglish(category)}
                    </span>
                  </>
                )}{' '}
                <span className='text-muted-foreground'>
                  ({posts.length}편)
                </span>
              </span>
              <Link
                href='/'
                aria-label='검색 필터 초기화'
                className='ml-auto text-xs underline-offset-4 hover:underline'
              >
                필터 초기화
              </Link>
            </div>
          )}

          {/* 글 카드 그리드: 모바일 1열 / sm 이상 2열 */}
          {posts.length > 0 ? (
            <ul
              className='grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8'
              aria-label='블로그 글 목록'
            >
              {posts.map(post => (
                <li key={post.id ?? post.slug}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          ) : (
            /* 검색/필터 결과가 없거나 글이 없는 경우 빈 상태 안내 */
            <div
              role='status'
              aria-live='polite'
              className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-24 text-center'
            >
              <PenLine
                className='mb-4 h-10 w-10 text-muted-foreground'
                aria-hidden='true'
              />
              <h2 className='text-lg font-semibold'>아직 글이 없습니다</h2>
              <p className='mt-2 max-w-sm text-sm text-muted-foreground'>
                {q || category
                  ? '검색/필터 조건에 맞는 프로젝트를 찾지 못했습니다. 다른 조건으로 검색해 보세요.'
                  : 'Notion에서 포트폴리오를 추가하면 여기에 표시됩니다.'}
              </p>
              {(q || category) && (
                <Link
                  href='/'
                  className='mt-4 text-sm font-medium text-primary underline-offset-4 hover:underline'
                >
                  전체 글 보기
                </Link>
              )}
            </div>
          )}
        </section>
      </Container>
    </div>
  );
}

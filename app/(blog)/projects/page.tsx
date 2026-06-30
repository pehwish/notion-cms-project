/**
 * 전체 프로젝트 목록 페이지
 * 기존 홈 페이지의 탭 필터 + 전체 목록 영역을 분리
 */

import { Container } from '@/components/layout/Container';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PenLine } from 'lucide-react';
import type { Post } from '@/lib/types';
import { PostCard } from '@/components/blog/PostCard';
import { SITE_CONFIG, PROFILE_DATA } from "@/lib/constants";
import { translateRoleToEnglish as translateRole } from "@/lib/utils";
import { fetchPublishedPosts } from '@/lib/notion';

export const metadata: Metadata = {
  title: '모든 프로젝트',
  description: `${SITE_CONFIG.description} — 전체 포트폴리오`,
  openGraph: {
    title: `모든 프로젝트 | ${SITE_CONFIG.name}`,
    description: `${SITE_CONFIG.description} — 전체 포트폴리오`
  }
};

export const revalidate = 3600;

interface ProjectsPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
}

function getTabClassName(isActive: boolean): string {
  const base =
    'inline-block whitespace-nowrap px-4 py-3 text-sm font-medium transition-all duration-150';
  if (isActive) {
    return `${base} text-foreground border-b-2 border-foreground`;
  }
  return `${base} text-muted-foreground hover:text-foreground`;
}

export default async function ProjectsPage({
  searchParams
}: ProjectsPageProps) {
  const { category, q } = await searchParams;

  let allPosts: Post[] = [];
  try {
    allPosts = await fetchPublishedPosts();
  } catch (error) {
    console.error('프로젝트 목록 조회 실패:', error);
  }

  /* 역할 목록 추출 */
  const roleCountMap = new Map<string, number>();
  allPosts.forEach(p => {
    p.roles?.forEach(role => {
      roleCountMap.set(role, (roleCountMap.get(role) ?? 0) + 1);
    });
  });

  const roles = Array.from(roleCountMap)
    .sort((a, b) => b[1] - a[1])
    .map(([role]) => role);

  /* 필터링 */
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
      {/* 헤더 섹션 */}
      <section className='border-b border-border bg-background py-12 lg:py-16'>
        <Container>
          <div>
            <h1 className='text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.95]'>
              모든 프로젝트
            </h1>
            <p className='mt-3 text-lg text-muted-foreground'>
              11년간 구축하고 운영한 전체 포트폴리오
            </p>
          </div>
        </Container>
      </section>

      {/* 탭 필터 + 검색 바 */}
      <div className='border-b border-border bg-background'>
        <Container>
          <div className='flex items-stretch gap-4'>
            {/* 역할 탭 목록 */}
            <nav
              aria-label='역할 필터'
              className='min-w-0 flex-1 overflow-x-auto'
            >
              <ul className='flex' role='list'>
                {/* View all 탭 */}
                <li>
                  <Link
                    href={q ? `/?q=${encodeURIComponent(q)}` : '/projects'}
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
                    ? `/projects?category=${encodeURIComponent(role)}&q=${encodeURIComponent(q)}`
                    : `/projects?category=${encodeURIComponent(role)}`;
                  const displayRole = translateRole(role);
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

            {/* 검색 입력 */}
            <div
              className='hidden shrink-0 items-center sm:flex'
              aria-label='프로젝트 검색'
            >
              <form action='/projects' method='get' role='search'>
                {category && (
                  <input type='hidden' name='category' value={category} />
                )}
                <Input
                  type='search'
                  name='q'
                  placeholder='검색...'
                  defaultValue={q ?? ''}
                  className='h-8 w-44 text-sm lg:w-56'
                  aria-label='프로젝트 검색'
                />
              </form>
            </div>
          </div>
        </Container>
      </div>

      {/* 프로젝트 목록 */}
      <Container>
        <section className='py-20 lg:py-32' aria-label='프로젝트 목록'>
          {/* 활성 필터 상태 표시 */}
          {(category || q) && (
            <div className='mb-10 flex items-center gap-2 text-sm text-muted-foreground'>
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
                      {translateRole(category)}
                    </span>
                  </>
                )}{' '}
                <span className='text-muted-foreground'>
                  ({posts.length}개)
                </span>
              </span>
              <Link
                href='/projects'
                aria-label='검색 필터 초기화'
                className='ml-auto text-xs underline-offset-4 hover:underline'
              >
                필터 초기화
              </Link>
            </div>
          )}

          {/* 프로젝트 카드 그리드 */}
          {posts.length > 0 ? (
            <ul
              className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 sm:gap-10'
              aria-label='프로젝트 목록'
            >
              {posts.map((post, index) => (
                <li key={post.id ?? post.slug}>
                  <PostCard post={post} priority={index < 3} />
                </li>
              ))}
            </ul>
          ) : (
            /* 검색/필터 결과가 없는 경우 */
            <div
              role='status'
              aria-live='polite'
              className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-24 text-center'
            >
              <PenLine
                className='mb-4 h-10 w-10 text-muted-foreground'
                aria-hidden='true'
              />
              <h2 className='text-lg font-semibold'>결과를 찾지 못했습니다</h2>
              <p className='mt-2 max-w-sm text-sm text-muted-foreground'>
                다른 조건으로 검색해 보세요.
              </p>
              <Link
                href='/projects'
                className='mt-4 text-sm font-medium text-indigo-600 dark:text-purple-300 underline-offset-4 hover:underline'
              >
                필터 초기화
              </Link>
            </div>
          )}
        </section>
      </Container>
    </div>
  );
}

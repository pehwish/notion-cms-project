/**
 * 블로그 글 카드 컴포넌트
 * 글 목록 그리드에서 개별 글을 카드 형식으로 시각화
 * Phase 3에서 실제 Notion 데이터와 연동 예정
 */

'use client';

import { Card, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

/**
 * 기술별 상징 색상 매핑
 * 각 기술을 고유한 색상으로 표시하여 시각적 구분 강화
 */
const TECH_COLORS: Record<string, string> = {
  React:
    'bg-cyan-500/20 text-cyan-700 border-cyan-300 dark:text-cyan-300 dark:border-cyan-600',
  TypeScript:
    'bg-blue-500/20 text-blue-700 border-blue-300 dark:text-blue-300 dark:border-blue-600',
  JavaScript:
    'bg-yellow-400/20 text-yellow-700 border-yellow-300 dark:text-yellow-300 dark:border-yellow-600',
  'Next.js':
    'bg-slate-800/20 text-slate-700 border-slate-400 dark:text-slate-300 dark:border-slate-600',
  'Node.js':
    'bg-green-500/20 text-green-700 border-green-300 dark:text-green-300 dark:border-green-600',
  Vue: 'bg-emerald-500/20 text-emerald-700 border-emerald-300 dark:text-emerald-300 dark:border-emerald-600',
  CSS: 'bg-blue-500/20 text-blue-700 border-blue-300 dark:text-blue-300 dark:border-blue-600',
  HTML: 'bg-orange-600/20 text-orange-700 border-orange-300 dark:text-orange-300 dark:border-orange-600',
  Redux:
    'bg-purple-600/20 text-purple-700 border-purple-300 dark:text-purple-300 dark:border-purple-600',
  Scss: 'bg-pink-600/20 text-pink-700 border-pink-300 dark:text-pink-300 dark:border-pink-600',
  반응형웹:
    'bg-indigo-500/20 text-indigo-700 border-indigo-300 dark:text-indigo-300 dark:border-indigo-600',
  Responsive:
    'bg-indigo-500/20 text-indigo-700 border-indigo-300 dark:text-indigo-300 dark:border-indigo-600',
  'REST API':
    'bg-rose-500/20 text-rose-700 border-rose-300 dark:text-rose-300 dark:border-rose-600',
  Git: 'bg-orange-700/20 text-orange-800 border-orange-400 dark:text-orange-300 dark:border-orange-600',
  GitHub:
    'bg-slate-700/20 text-slate-800 border-slate-400 dark:text-slate-300 dark:border-slate-600',
  VueJs:
    'bg-emerald-500/20 text-emerald-700 border-emerald-300 dark:text-emerald-300 dark:border-emerald-600',
  'Vue.js':
    'bg-emerald-500/20 text-emerald-700 border-emerald-300 dark:text-emerald-300 dark:border-emerald-600',
  CSS3: 'bg-blue-500/20 text-blue-700 border-blue-300 dark:text-blue-300 dark:border-blue-600',
  JQuery:
    'bg-amber-600/20 text-amber-700 border-amber-300 dark:text-amber-300 dark:border-amber-600',
  gulp: 'bg-red-600/20 text-red-700 border-red-300 dark:text-red-300 dark:border-red-600',
  'Styled-Component':
    'bg-yellow-600/20 text-yellow-700 border-yellow-300 dark:text-yellow-300 dark:border-yellow-600',
  'React Native':
    'bg-cyan-600/20 text-cyan-700 border-cyan-300 dark:text-cyan-300 dark:border-cyan-600',
  NextJs:
    'bg-slate-800/20 text-slate-700 border-slate-400 dark:text-slate-300 dark:border-slate-600'
};

/**
 * 기술의 상징 색상 가져오기
 * 정의되지 않은 기술은 기본 secondary 색상 사용
 * dark: 클래스는 제거하여 라이트 모드 색상을 다크 모드에서도 유지
 */
function getTechColor(tech: string): string {
  const color = TECH_COLORS[tech] || '';
  // dark: 클래스 제거 (라이트 모드 색상 유지)
  return color.replace(/\s*dark:[^\s]*/g, '');
}

interface PostCardProps {
  post: Post;
}

/**
 * 블로그 글 목록에서 개별 글을 카드 형식으로 표시
 * 카테고리 배지, 제목, 설명, 날짜, 태그를 포함
 */
export function PostCard({ post }: PostCardProps) {
  const { theme, systemTheme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  return (
    <article>
      <Link
        href={`/posts/${post.slug}`}
        className='group block h-full'
        aria-label={`${post.title} 글 읽기`}
      >
        <Card className='flex h-full flex-col overflow-hidden transition-shadow duration-200 hover:shadow-md group-hover:shadow-lg relative rounded-none border-none pt-0 bg-white dark:bg-white'>
          {/* 카드 상단: 썸네일 이미지 오버레이 영역 */}
          <figure className='relative m-0 h-56 sm:h-72 lg:h-80 w-full overflow-hidden bg-muted'>
            {/* 이미지 또는 폴백 배경 */}
            {post.imageUrl ? (
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className='object-cover transition-transform duration-300 group-hover:scale-105'
                sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
              />
            ) : (
              /* 이미지가 없을 때: 그라데이션 폴백 배경 */
              <div
                className='h-full w-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900'
                aria-hidden='true'
              />
            )}

            {/* 하단 그라데이션 오버레이: 텍스트 가독성 확보 */}
            <div
              className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent'
              aria-hidden='true'
            />

            {/* 호버 시 우측 상단 dog-ear 접힘 효과 */}
            <div
              className='absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'
              style={
                {
                  width: '0px !important',
                  height: '0px !important',
                  borderLeft: `20px solid ${isDark ? '#ffffff' : '#1f2937'}`,
                  borderBottom: `20px solid ${isDark ? '#ffffff' : '#1f2937'}`,
                  borderTop: `20px solid ${isDark ? '#1f2937' : '#fff'}`,
                  borderRight: `20px solid ${isDark ? '#1f2937' : '#fff'}`
                } as React.CSSProperties
              }
              aria-hidden='true'
            />

            {/* figcaption: 글래스 효과 오버레이 */}
            <figcaption className='absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-5 bg-white/15 backdrop-blur-[10px] border-t border-t-white/20'>
              {/* 좌측: 제목 + 날짜 */}
              <div className='flex flex-col gap-0.5'>
                <span className='line-clamp-1 text-base font-bold text-white'>
                  {post.title}
                </span>
                {post.period && (
                  <time className='text-sm text-white/90 leading-none'>
                    {post.period}
                  </time>
                )}
              </div>
              {/* 우측: 역할 */}
              {post.roles && post.roles.length > 0 && (
                <span className='text-sm font-medium text-white/90 leading-none whitespace-nowrap ml-2'>
                  {post.roles[0]}
                </span>
              )}
            </figcaption>
          </figure>

          <CardFooter className='flex flex-col items-start gap-2 bg-white dark:bg-white text-slate-900 dark:text-slate-900'>
            {/* 기술 스택 표시 (포트폴리오) 또는 태그 (블로그) */}
            {post.technologies && post.technologies.length > 0 ? (
              <div className='flex flex-wrap gap-1.5' aria-label='사용 기술'>
                {post.technologies.map(tech => (
                  <Badge
                    key={tech}
                    variant='secondary'
                    className={`text-xs font-medium ${getTechColor(tech)}`}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            ) : post.tags && post.tags.length > 0 ? (
              <div className='flex flex-wrap gap-1.5' aria-label='태그'>
                {post.tags.map(tag => (
                  <Badge
                    key={tag}
                    variant='secondary'
                    className={`text-xs font-medium ${getTechColor(tag)}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}

            {/* 더 읽기 링크 힌트: 시각적 장식 요소이므로 스크린 리더 숨김 처리 */}
            <div
              className='flex items-center gap-1 text-xs font-medium text-slate-900 dark:text-slate-900 mt-1'
              aria-hidden='true'
            >
              <span>Read post</span>
              <ArrowUpRight className='h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
            </div>
          </CardFooter>
        </Card>
      </Link>
    </article>
  );
}

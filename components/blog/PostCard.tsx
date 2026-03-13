/**
 * 블로그 글 카드 컴포넌트
 * 글 목록 그리드에서 개별 글을 카드 형식으로 시각화
 * Phase 3에서 실제 Notion 데이터와 연동 예정
 */

import { ArrowUpRight, Calendar, FolderOpen, Tag } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

interface PostCardProps {
  post: Post;
}

/**
 * 블로그 글 목록에서 개별 글을 카드 형식으로 표시
 * 카테고리 배지, 제목, 설명, 날짜, 태그를 포함
 */
export function PostCard({ post }: PostCardProps) {
  return (
    <article>
      <Link
        href={`/posts/${post.slug}`}
        className='group block h-full'
        aria-label={`${post.title} 글 읽기`}
      >
        <Card className='flex h-full flex-col overflow-hidden transition-shadow duration-200 hover:shadow-md'>
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
              className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent'
              aria-hidden='true'
            />

            {/* figcaption: 이미지 위 텍스트 오버레이 영역 */}
            <figcaption className='absolute inset-x-0 bottom-0 flex items-end justify-between px-3 pb-3'>
              {/* 좌측 하단: 제목 + 날짜 */}
              <div className='flex flex-col gap-0.5 min-w-0 pr-2'>
                {/* 이미지 위 제목: 흰색 bold */}
                <span className='line-clamp-1 text-sm font-bold text-white drop-shadow-sm'>
                  {post.title}
                </span>
                {/* 날짜: period (포트폴리오) 또는 publishedAt (블로그) */}
                {(post.period ?? post.lastEditedAt) && (
                  <div className='flex items-center gap-1'>
                    <Calendar
                      className='h-3 w-3 shrink-0 text-white/70'
                      aria-hidden='true'
                    />
                    <time className='text-[11px] text-white/70 leading-none'>
                      {post.period ?? post.lastEditedAt}
                    </time>
                  </div>
                )}
              </div>

              {/* 우측 하단: 카테고리 */}
              {post.category && (
                <div className='flex shrink-0 items-center gap-1 rounded-sm bg-black/40 px-1.5 py-0.5 backdrop-blur-sm'>
                  <Tag
                    className='h-2.5 w-2.5 text-white/80'
                    aria-hidden='true'
                  />
                  <span className='text-[11px] font-medium text-white/90 leading-none whitespace-nowrap'>
                    {post.category}
                  </span>
                </div>
              )}
            </figcaption>
          </figure>

          <CardHeader className='pb-2'>
            {/* 카테고리 배지 */}
            {post.category && (
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <FolderOpen className='h-3.5 w-3.5' aria-hidden='true' />
                <Badge variant='secondary' className='px-1.5 py-0 text-xs'>
                  {post.category}
                </Badge>
              </div>
            )}

            {/* 글 제목 */}
            <h2 className='text-lg font-bold leading-tight tracking-tight group-hover:text-primary transition-colors duration-150'>
              {post.title}
            </h2>
          </CardHeader>

          <CardContent className='flex-1 pb-3'>
            {/* 글 요약: 최대 2줄 표시 */}
            {post.description && (
              <p className='line-clamp-2 text-sm text-muted-foreground leading-relaxed'>
                {post.description}
              </p>
            )}
          </CardContent>

          <Separator />

          <CardFooter className='flex flex-col items-start gap-2 pt-3'>
            {/* 기간 표시 (포트폴리오) 또는 발행일 (블로그) */}
            {post.period && (
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <Calendar className='h-3.5 w-3.5' aria-hidden='true' />
                <time>{post.period}</time>
              </div>
            )}

            {/* 기술 스택 표시 (포트폴리오) 또는 태그 (블로그) */}
            {post.technologies && post.technologies.length > 0 ? (
              <div className='flex flex-wrap gap-1.5' aria-label='사용 기술'>
                {post.technologies.map(tech => (
                  <Badge
                    key={tech}
                    variant='secondary'
                    className='text-xs font-medium'
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
                    className='text-xs font-medium'
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}

            {/* 더 읽기 링크 힌트: 시각적 장식 요소이므로 스크린 리더 숨김 처리 */}
            <div
              className='flex items-center gap-1 text-xs font-medium text-primary mt-1'
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

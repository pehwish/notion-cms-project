/**
 * 블로그 글 카드 컴포넌트
 * 글 목록 그리드에서 개별 글을 카드 형식으로 시각화
 * Phase 3에서 실제 Notion 데이터와 연동 예정
 */

import Link from "next/link";
import Image from "next/image";
import { Calendar, FolderOpen, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Post } from "@/lib/types";

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
        className="group block h-full"
        aria-label={`${post.title} 글 읽기`}
      >
        <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-200 hover:shadow-md">
          {/* 카드 상단: 썸네일 이미지 또는 배경 */}
          <div className="relative h-48 w-full overflow-hidden bg-muted">
            {post.imageUrl ? (
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div
                className="h-full w-full bg-gradient-to-br from-muted to-muted/50 transition-colors duration-200 group-hover:from-muted/70"
                aria-hidden="true"
              />
            )}
          </div>

          <CardHeader className="pb-2">
            {/* 카테고리 배지 */}
            {post.category && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FolderOpen className="h-3.5 w-3.5" aria-hidden="true" />
                <Badge variant="secondary" className="px-1.5 py-0 text-xs">
                  {post.category}
                </Badge>
              </div>
            )}

            {/* 글 제목 */}
            <h2 className="text-lg font-bold leading-tight tracking-tight group-hover:text-primary transition-colors duration-150">
              {post.title}
            </h2>
          </CardHeader>

          <CardContent className="flex-1 pb-3">
            {/* 글 요약: 최대 2줄 표시 */}
            {post.description && (
              <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                {post.description}
              </p>
            )}
          </CardContent>

          <Separator />

          <CardFooter className="flex flex-col items-start gap-2 pt-3">
            {/* 기간 표시 (포트폴리오) 또는 발행일 (블로그) */}
            {post.period && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                <time>{post.period}</time>
              </div>
            )}

            {/* 기술 스택 표시 (포트폴리오) 또는 태그 (블로그) */}
            {post.technologies && post.technologies.length > 0 ? (
              <div className="flex flex-wrap gap-1.5" aria-label="사용 기술">
                {post.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="text-xs font-medium"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            ) : post.tags && post.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5" aria-label="태그">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs font-medium"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}

            {/* 더 읽기 링크 힌트 */}
            <div className="flex items-center gap-1 text-xs font-medium text-primary mt-1">
              <span>읽기</span>
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </div>
          </CardFooter>
        </Card>
      </Link>
    </article>
  );
}

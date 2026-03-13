/**
 * 카테고리 필터 컴포넌트
 * 카테고리 버튼 목록으로 글 필터링 UI 제공 (F-03: 카테고리별 필터링)
 * Phase 4에서 실제 쿼리 스트링 라우팅 구현 예정
 */

"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface CategoryFilterProps {
  /** 표시할 카테고리 이름 목록 */
  categories: string[];
  /** 현재 선택된 카테고리 (URL 쿼리 스트링에서 전달) */
  selectedCategory?: string;
}

/**
 * 카테고리별 글 필터링 버튼 목록
 * 활성 카테고리는 default 배지, 비활성은 outline 배지로 구분
 * TODO (Phase 4): useRouter로 쿼리 스트링 직접 조작하는 방식으로 전환
 */
export function CategoryFilter({
  categories,
  selectedCategory,
}: CategoryFilterProps) {
  return (
    <nav aria-label="카테고리 필터">
      <ul className="flex flex-wrap gap-2" role="list">
        {/* 전체 보기 버튼 */}
        <li>
          <Link
            href="/"
            aria-current={!selectedCategory ? "page" : undefined}
            aria-label="모든 카테고리 보기"
          >
            <Badge
              variant={!selectedCategory ? "default" : "outline"}
              className="cursor-pointer px-3 py-1 text-sm font-medium transition-colors"
            >
              전체
            </Badge>
          </Link>
        </li>

        {/* 개별 카테고리 버튼 */}
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <li key={category}>
              <Link
                href={`/?category=${encodeURIComponent(category)}`}
                aria-current={isActive ? "page" : undefined}
                aria-label={`${category} 카테고리 보기`}
              >
                <Badge
                  variant={isActive ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1 text-sm font-medium transition-colors"
                >
                  {category}
                </Badge>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

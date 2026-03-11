/**
 * 검색바 컴포넌트
 * 키워드 검색 입력 UI (F-04: 키워드 검색)
 * Phase 4에서 실제 쿼리 스트링 연동 및 디바운스 로직 구현 예정
 */

"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  /** 초기 검색어 (URL 쿼리 스트링에서 전달) */
  defaultValue?: string;
}

/**
 * 블로그 글 키워드 검색 입력 UI
 * 폼 제출 시 /?q=keyword 형식으로 이동
 * TODO (Phase 4): useRouter + 디바운스로 실시간 검색 구현
 */
export function SearchBar({ defaultValue }: SearchBarProps) {
  return (
    <form
      role="search"
      aria-label="블로그 글 검색"
      action="/"
      method="get"
      className="relative"
    >
      {/* 검색 아이콘: 입력 필드 왼쪽 장식 */}
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
        aria-hidden="true"
      />

      {/* 검색 입력 필드 */}
      <Input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="글을 검색해보세요..."
        aria-label="검색어 입력"
        className="pl-9 pr-24"
      />

      {/* 검색어 초기화 버튼: 현재 검색어가 있을 때만 표시 */}
      {defaultValue && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="검색어 초기화"
          className="absolute right-16 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full p-0 text-muted-foreground hover:text-foreground"
          onClick={() => {}}
          /* TODO (Phase 4): 검색어 초기화 후 홈으로 라우팅 */
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      )}

      {/* 검색 제출 버튼 */}
      <Button
        type="submit"
        size="sm"
        className="absolute right-1.5 top-1/2 h-7 -translate-y-1/2"
      >
        검색
      </Button>
    </form>
  );
}

/**
 * 블로그 글 본문 렌더러
 * Notion 페이지 블록을 HTML로 변환하여 렌더링
 * F-02: Notion 블록 변환 로직 연동 완료
 */

import {
  type NotionBlock,
  blocksToHtml,
} from "@/lib/notion-blocks";

interface PostContentProps {
  /** Notion API에서 가져온 페이지 블록 배열 */
  blocks: NotionBlock[];
}

/**
 * Notion 페이지 블록을 HTML로 변환하여 렌더링
 * blocksToHtml()로 HTML 문자열 변환 후 dangerouslySetInnerHTML로 주입
 * prose 클래스로 마크다운 스타일 적용 (다크모드 지원)
 *
 * 보안 고려사항:
 * - convertRichText() 내부에서 escapeHtml()로 특수문자 이스케이프
 * - isSafeUrl()로 http/https URL만 허용 (XSS 방지)
 */
export function PostContent({ blocks }: PostContentProps) {
  // 블록이 없는 경우 빈 상태 표시
  if (!blocks || blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
        <p className="text-sm text-muted-foreground">콘텐츠가 없습니다.</p>
      </div>
    );
  }

  // 블록 배열을 HTML 문자열로 변환
  const htmlContent = blocksToHtml(blocks);

  return (
    <article
      // prose: globals.css에 직접 정의된 커스텀 타이포그래피 스타일
      // prose-invert: 다크모드에서 색상 반전 적용
      // max-w-none: 부모 컨테이너(max-w-3xl)가 너비를 제어하므로 prose 자체 너비 제한 해제
      className="prose prose-invert max-w-none"
      // 보안: isSafeUrl + escapeHtml로 XSS 위험 최소화 후 주입
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

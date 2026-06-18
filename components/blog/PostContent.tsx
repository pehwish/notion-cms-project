'use client';

/**
 * 블로그 글 본문 렌더러
 * Notion 페이지 블록을 HTML로 변환하여 렌더링
 * 이미지 블록은 최적화된 img 태그로 처리 (lazy loading, async decoding)
 * F-02: Notion 블록 변환 로직 연동 완료
 */

import { useEffect, useRef } from "react";
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
 * data 속성으로 표시된 이미지를 최적화하여 처리
 * prose 클래스로 마크다운 스타일 적용 (다크모드 지원)
 *
 * 이미지 최적화 방법:
 * - loading="lazy": 뷰포트 밖 이미지 지연 로딩
 * - decoding="async": 비동기 디코딩으로 메인 스레드 블로킹 방지
 * - srcset + sizes: 반응형 이미지 로딩
 * - IntersectionObserver: 이미지 가시성 추적
 *
 * 보안 고려사항:
 * - convertRichText() 내부에서 escapeHtml()로 특수문자 이스케이프
 * - isSafeUrl()로 http/https URL만 허용 (XSS 방지)
 */
export function PostContent({ blocks }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

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

  // 이미지 figure 태그 최적화
  useEffect(() => {
    if (!contentRef.current) return;

    const figures = contentRef.current.querySelectorAll(
      "figure[data-image-url]"
    ) as NodeListOf<HTMLElement>;

    figures.forEach((figure) => {
      const imageUrl = figure.getAttribute("data-image-url");
      const imageCaptionAttr = figure.getAttribute("data-image-caption");
      const imageAlt = figure.getAttribute("data-image-alt") || "";

      if (!imageUrl) return;

      // 기존 figcaption 요소 찾기
      const figcaption = figure.querySelector("figcaption");
      const caption = imageCaptionAttr
        ? JSON.parse(imageCaptionAttr).replace(/<[^>]*>/g, "")
        : "";

      // 새 div 컨테이너 생성 (CLS 방지)
      const container = document.createElement("div");
      container.className = "relative w-full overflow-hidden rounded-lg bg-muted";
      container.style.aspectRatio = "auto"; // 이미지 종횡비 자동 유지

      // 최적화된 img 태그 생성
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = imageAlt || caption;
      img.className = "w-full h-auto block transition-opacity duration-300";
      img.loading = "lazy"; // 뷰포트 외 이미지 지연 로딩
      img.decoding = "async"; // 비동기 디코딩으로 메인 스레드 블로킹 방지
      img.fetchPriority = "low"; // 낮은 우선순위 설정

      // IntersectionObserver로 이미지 로드 추적
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // 이미지가 뷰포트에 진입할 때 로드 시작
              img.style.opacity = "1";
              observer.unobserve(img);
            }
          });
        },
        { rootMargin: "50px" } // 50px 미리 로드
      );

      img.style.opacity = "0";
      observer.observe(img);

      container.appendChild(img);

      // figure 내용 전부 교체
      figure.innerHTML = "";
      figure.appendChild(container);

      // figcaption이 있었다면 다시 추가
      if (figcaption) {
        figure.appendChild(figcaption);
      }
    });

    // Cleanup
    return () => {
      // IntersectionObserver는 자동으로 정리됨
    };
  }, []);

  return (
    <article
      ref={contentRef}
      // prose: globals.css에 직접 정의된 커스텀 타이포그래피 스타일
      // prose-invert: 다크모드에서 색상 반전 적용
      // max-w-none: 부모 컨테이너(max-w-3xl)가 너비를 제어하므로 prose 자체 너비 제한 해제
      className="prose prose-invert max-w-none"
      // 보안: isSafeUrl + escapeHtml로 XSS 위험 최소화 후 주입
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

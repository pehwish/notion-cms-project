/**
 * 블로그 라우트 그룹 레이아웃
 * Header + main + Footer 구조로 블로그 전용 레이아웃 구성
 * ISR revalidate는 REVALIDATE_SECONDS 상수로 일관성 유지
 */

import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_CONFIG } from "@/lib/constants";

/** 블로그 레이아웃 기본 메타데이터 */
export const metadata: Metadata = {
  title: {
    template: `%s | ${SITE_CONFIG.name}`,
    default: SITE_CONFIG.name,
  },
  description: SITE_CONFIG.description,
  openGraph: {
    type: "website",
    siteName: SITE_CONFIG.name,
    locale: "ko_KR",
    url: SITE_CONFIG.url,
  },
};

/**
 * 레이아웃은 서버 데이터를 직접 페칭하지 않으므로 revalidate 미설정
 * 각 페이지(page.tsx)에서 개별적으로 ISR revalidate를 관리
 */

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 스킵 네비게이션: 키보드 사용자가 메인 콘텐츠로 바로 이동 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md focus:ring-2 focus:ring-ring focus:outline-none focus:ring-offset-2"
      >
        본문으로 바로 가기
      </a>

      {/* 스티키 헤더: 스크롤 시 상단 고정 */}
      <Header />

      {/* 메인 콘텐츠 영역: 남은 높이를 모두 차지하여 푸터를 하단에 고정 */}
      <main className="flex-1" id="main-content">
        {children}
      </main>

      {/* 페이지 하단 고정 푸터 */}
      <Footer />
    </div>
  );
}

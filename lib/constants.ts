/**
 * 애플리케이션 전역 상수 정의
 */

export const SITE_CONFIG = {
  name: 'Easy Code',
  description:
    '사용자가 원하는 경험을 만들어내는 프론트엔드 개발자 박은혜의 포트폴리오',
  url: 'https://example.com'
} as const;

/** 블로그 헤더 네비게이션 링크 */
export const MARKETING_NAV_LINKS = [{ label: 'Portfolio', href: '/' }] as const;

/** Docs 사이드바 링크 (스타터킷 문서용 - 필요시 제거 가능) */
export const DOCS_NAV_LINKS = [
  { label: 'Getting Started', href: '/docs' }
] as const;

/** 반응형 브레이크포인트 (PRD F-05 기준) */
export const BREAKPOINTS = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)'
} as const;

/** 블로그 ISR 재검증 주기 (초) */
export const REVALIDATE_SECONDS = 3600 as const;

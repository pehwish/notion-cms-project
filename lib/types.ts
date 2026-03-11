/**
 * 애플리케이션 공통 타입 정의
 */

export interface NavLink {
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
}

export interface PageMeta {
  title: string;
  description: string;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
}

// =============================================================================
// 블로그 타입 정의 (PRD §5 Notion 데이터베이스 스키마 기반)
// Phase 2에서 상세 구현 예정
// =============================================================================

/** Notion 포트폴리오 데이터베이스의 프로젝트 타입 */
export interface Post {
  /** Notion 페이지 ID */
  id?: string;
  /** 프로젝트명/회사명 (고유 이름) */
  title: string;
  /** 프로젝트 URL */
  url: string;
  /** 사용 기술 배열 (쉼표로 구분된 문자열을 파싱) */
  technologies: string[];
  /** 담당 역할/포지션 배열 (쉼표로 구분된 문자열을 파싱) */
  roles: string[];
  /** 투입 기간 (원본 문자열: "2021/03/09 → 2021/05/25" 또는 "2023/12/09") */
  period: string;
  /** 투입 기간 파싱됨 */
  periodParsed?: {
    startDate: string; // YYYY/MM/DD
    endDate?: string; // YYYY/MM/DD
  };
  /** Notion 마지막 수정일 */
  lastEditedAt?: string;
  /** 슬러그 (URL에 사용, 프로젝트명을 kebab-case로 변환) */
  slug?: string;
  /** 설명/요약 */
  description?: string;
  /** 상태 (포트폴리오는 항상 "발행됨") */
  status?: PostStatus;
  /** 카테고리 (선택사항) */
  category?: string;
  /** 태그 (선택사항) */
  tags?: string[];
  /** 글 본문 (선택사항) */
  content?: string;
  /** 썸네일/커버 이미지 URL */
  imageUrl?: string;
}

/** 블로그 글 발행 상태 */
export type PostStatus = "초안" | "발행됨";

/** 카테고리 정보 */
export interface Category {
  name: string;
  count?: number;
}

/** 태그 정보 */
export interface Tag {
  name: string;
  count?: number;
}

/** 담당 역할 정보 */
export interface Role {
  name: string;
}

/** 사용 기술 정보 */
export interface Technology {
  name: string;
}

/** 프로젝트 기간 정보 */
export interface Period {
  /** 프로젝트 시작일 */
  startDate: string;
  /** 프로젝트 종료일 (진행중이면 선택사항) */
  endDate?: string;
  /** 진행 중 여부 */
  isOngoing?: boolean;
}

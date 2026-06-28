/**
 * 애플리케이션 전역 상수 정의
 */

export const SITE_CONFIG = {
  name: 'Easy Code',
  description:
    '사용자가 원하는 경험을 만들어내는 프론트엔드 개발자 박은혜의 포트폴리오',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://eunhyeportfolio.vercel.app'
} as const;

/** 블로그 헤더 네비게이션 링크 */
export const MARKETING_NAV_LINKS = [
  { label: 'Portfolio', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
] as const;

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

// =============================================================================
// Phase 11: 색상 시스템 강화 (Task 001)
// =============================================================================

/** 브랜드 컬러 팔레트 */
export const BRAND_COLORS = {
  primary: '#4F46E5', // 인디고 블루 (메인 색상)
  secondary: '#7C3AED', // 보라색 (포인트)
  accent: '#10B981', // 에메랄드 그린 (보조 강조)
  light: {
    bg: '#DDD6FE', // 연한 라벤더 (배경)
    border: '#C7D2FE', // 라벤더 (테두리)
    text: '#4F46E5', // 인디고 (텍스트 강조)
  },
  dark: {
    bg: '#111827', // 거의 검정 (다크모드 배경)
    surface: '#1F2937', // 다크그레이 (다크모드 카드)
    border: '#374151', // 라이트 그레이 (다크모드 테두리)
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    600: '#4B5563',
    700: '#374151',
    900: '#111827',
  },
} as const;

// =============================================================================
// Phase 6: About/Contact 페이지 정적 콘텐츠 (Task 001)
// =============================================================================

/** 프로필 정보 */
export const PROFILE_DATA = {
  name: 'Eunhye Park',
  role: 'Frontend Developer',
  bio: 'React · Next.js · TypeScript로 사용자 경험을 설계하는 프론트엔드 개발자',
  subBio: 'ISR 기반 Headless CMS 설계부터 WCAG 2.1 AA 접근성 구현까지, 성능과 UX를 함께 고민합니다.',
  location: 'Seoul, Korea',
  imageUrl: '/assets/images/hero-developer.png',
  github: 'https://github.com/pehwish',
  linkedin: 'https://www.linkedin.com/in/%EC%9D%80%ED%98%9C-%EB%B0%95-633096252',
  email: 'pehwish@gmail.com',
  resumeUrl: '/resume.pdf',
  careerStartYear: 2015
} as const;

/** 기술 스택 데이터 */
export const SKILLS_DATA = [
  // Frontend Core
  { name: 'HTML', category: 'Frontend', proficiency: 95, color: 'bg-orange-400' },
  { name: 'CSS', category: 'Frontend', proficiency: 90, color: 'bg-blue-400' },
  { name: 'JavaScript', category: 'Frontend', proficiency: 85, color: 'bg-yellow-400' },

  // Frontend Frameworks
  { name: 'React', category: 'Frontend', proficiency: 85, color: 'bg-cyan-400' },
  { name: 'TypeScript', category: 'Frontend', proficiency: 80, color: 'bg-indigo-400' },
  { name: 'Vue.js', category: 'Frontend', proficiency: 75, color: 'bg-green-400' },
  { name: 'Next.js', category: 'Frontend', proficiency: 85, color: 'bg-gray-700' },
  { name: 'Tailwind CSS', category: 'Frontend', proficiency: 88, color: 'bg-cyan-400' },

  // Tools & Others
  { name: 'Git', category: 'Tools', proficiency: 90, color: 'bg-red-500' },
  { name: 'Web Accessibility', category: 'Tools', proficiency: 80, color: 'bg-purple-400' }
] as const;

/** 연락처 정보 */
export const CONTACT_DATA = [
  {
    type: 'Phone',
    label: 'Phone',
    value: '010-7997-3104',
    url: 'tel:01079973104',
    iconName: 'Phone'
  },
  {
    type: 'Email',
    label: 'Email',
    value: 'pehwish@gmail.com',
    url: 'mailto:pehwish@gmail.com',
    iconName: 'Mail'
  }
] as const;

/** 개발 철학 (구체적 경험 기반) */
export const PHILOSOPHY_DATA = [
  {
    title: '성능 최적화 경험',
    description: 'ISR + 인메모리 캐싱으로 Notion API 응답을 최적화하여 LCP 2.1s 달성. 번들 분석으로 불필요한 의존성을 제거한 경험이 있습니다.',
    iconName: 'Zap'
  },
  {
    title: 'UX 중심 개발',
    description: 'WCAG 2.1 AA 접근성을 모든 컴포넌트에 적용. 스크린 리더 테스트와 키보드 네비게이션을 직접 검증하며 모든 사용자를 고려합니다.',
    iconName: 'Users'
  },
  {
    title: '유지보수 가능한 코드',
    description: '상수 기반 데이터 주도 UI로 콘텐츠 추가 시 코드 수정 최소화. 커스텀 훅으로 관심사를 분리하여 팀 협업을 고려한 코드를 작성합니다.',
    iconName: 'Code2'
  }
] as const;

/** Hero 섹션 주요 지표 */
export const HERO_STATS = [
  { label: '경력', value: '10년+' },
  { label: '프로젝트', value: '14개+' },
  { label: '핵심 기술', value: 'React / Next.js' }
] as const;

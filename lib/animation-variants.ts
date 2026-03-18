/**
 * 애니메이션 CSS 클래스명 및 transition 상수
 * Phase 7-10 UI 섹션 구현에서 재사용할 공통 애니메이션 정의
 */

/** Fade-in 애니메이션 클래스명 */
export const ANIMATION_CLASSES = {
  fadeIn: 'fade-in',
  fadeInDelay100: 'fade-in-delay-100',
  fadeInDelay200: 'fade-in-delay-200',
  fadeInDelay300: 'fade-in-delay-300',
  fadeInDelay400: 'fade-in-delay-400',
  fadeInDelay500: 'fade-in-delay-500',
  typing: 'typing-cursor',
  float: 'float'
} as const;

/** Transition 기본값 */
export const TRANSITION_DEFAULTS = {
  duration: 'duration-300',
  easing: 'ease-in-out',
  all: 'transition-all duration-300 ease-in-out'
} as const;

/** Opacity 기본값 */
export const OPACITY_DEFAULTS = {
  visible: 'opacity-100',
  hidden: 'opacity-0'
} as const;

/** Transform 기본값 */
export const TRANSFORM_DEFAULTS = {
  translateY: 'translate-y-0',
  translateYUp: '-translate-y-5',
  translateYDown: 'translate-y-5'
} as const;

/** 애니메이션 시간 설정 (밀리초) */
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800
} as const;

/** Stagger delay 값 (밀리초) */
export const STAGGER_DELAY = {
  item1: 100,
  item2: 200,
  item3: 300,
  item4: 400,
  item5: 500
} as const;

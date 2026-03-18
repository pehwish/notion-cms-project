'use client';

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  /** 관찰자의 루트 요소 (기본값: viewport) */
  root?: Element | null;
  /** 루트 주변의 여백 (기본값: '0px') */
  rootMargin?: string;
  /** 가시성 임계값 (기본값: [0, 0.5, 1]) */
  threshold?: number | number[];
  /** 요소가 보일 때 한 번만 애니메이션 실행 (기본값: true) */
  triggerOnce?: boolean;
  /** 요소가 보일 때 콜백 함수 */
  onIntersect?: () => void;
}

/**
 * IntersectionObserver를 사용한 fade-in 애니메이션 훅
 * 요소가 뷰포트에 진입할 때 애니메이션을 트리거합니다
 * @param options - IntersectionObserver 옵션
 * @returns ref - 관찰할 요소에 전달할 ref, isVisible - 요소가 보이는 상태
 */
export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const {
    root = null,
    rootMargin = '0px',
    threshold = [0, 0.5, 1],
    triggerOnce = true,
    onIntersect
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasTriggered || !triggerOnce) {
            setIsVisible(true);
            setHasTriggered(true);
            onIntersect?.();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        root,
        rootMargin,
        threshold
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, triggerOnce, hasTriggered, onIntersect]);

  return { ref, isVisible };
}

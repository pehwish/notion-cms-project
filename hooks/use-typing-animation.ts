'use client';

import { useEffect, useState } from 'react';

interface UseTypingAnimationOptions {
  /** 표시할 텍스트 */
  text: string;
  /** 타이핑 속도 (ms, 기본값: 50) */
  speed?: number;
  /** 루프 여부 (기본값: false) */
  loop?: boolean;
  /** 애니메이션 완료 콜백 */
  onComplete?: () => void;
  /** 지연 시간 (ms, 기본값: 0) */
  delay?: number;
}

/**
 * 타이핑 효과 애니메이션 훅
 * 텍스트를 한 글자씩 나타내는 애니메이션을 구현합니다
 * @param options - 애니메이션 옵션
 * @returns displayedText - 현재 표시할 텍스트, isComplete - 애니메이션 완료 여부
 */
export function useTypingAnimation(options: UseTypingAnimationOptions) {
  const {
    text,
    speed = 50,
    loop = false,
    onComplete,
    delay = 0
  } = options;

  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // delay 후 애니메이션 시작
    const delayTimer = setTimeout(() => {
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayedText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, speed);

        return () => clearTimeout(timer);
      } else if (currentIndex >= text.length) {
        setIsComplete(true);
        onComplete?.();

        // loop 모드에서는 애니메이션 재시작
        if (loop) {
          const restartTimer = setTimeout(() => {
            setDisplayedText('');
            setCurrentIndex(0);
            setIsComplete(false);
          }, speed * 2);

          return () => clearTimeout(restartTimer);
        }
      }
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [currentIndex, text, speed, loop, onComplete, delay]);

  return { displayedText, isComplete };
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { useMounted } from '@/hooks/use-mounted';

export function CustomCursor() {
  const mounted = useMounted();
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const MAGNIFIER_SIZE = 150;
  const ZOOM_LEVEL = 2.2;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = MAGNIFIER_SIZE;
        canvas.height = MAGNIFIER_SIZE;

        const radius = MAGNIFIER_SIZE / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // SVG 기반 배경을 렌더링 (간단한 그래디언트)
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(96, 165, 250, 0.1)');
        gradient.addColorStop(0.5, 'rgba(167, 139, 250, 0.05)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.08)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 스크린 콘텐츠 캡처 시뮬레이션 - 페이지 배경색 표시
        ctx.fillStyle = getComputedStyle(document.documentElement).backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 테두리 그리기
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 1, 0, Math.PI * 2);
        ctx.stroke();

        // 내부 글로우 효과
        ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // 초기 렌더링
    handleMouseMove({ clientX: 0, clientY: 0 } as MouseEvent);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.left = `${mousePosition.x}px`;
      cursorRef.current.style.top = `${mousePosition.y}px`;
    }
  }, [mousePosition]);

  if (!mounted) return null;

  return (
    <div
      ref={cursorRef}
      className={`pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        zIndex: 9999,
        width: `${MAGNIFIER_SIZE}px`,
        height: `${MAGNIFIER_SIZE}px`,
      }}
    >
      {/* 돋보기 렌즈 - Canvas로 렌더링 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 rounded-full shadow-2xl"
        style={{
          filter: 'drop-shadow(0 0 20px rgba(96, 165, 250, 0.4)) drop-shadow(0 0 40px rgba(59, 130, 246, 0.2))',
        }}
      />

      {/* 글래스모피즘 오버레이 */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, transparent 50%, rgba(59, 130, 246, 0.05) 100%)',
          backdropFilter: 'blur(1px)',
        }}
      />

      {/* 중앙 십자선 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {/* 세로선 */}
        <div
          style={{
            position: 'absolute',
            width: '1.5px',
            height: '32px',
            background: 'linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.9), transparent)',
            left: '-0.75px',
            top: '-16px',
          }}
        />
        {/* 가로선 */}
        <div
          style={{
            position: 'absolute',
            width: '32px',
            height: '1.5px',
            background: 'linear-gradient(to right, transparent, rgba(59, 130, 246, 0.9), transparent)',
            left: '-16px',
            top: '-0.75px',
          }}
        />
      </div>
    </div>
  );
}

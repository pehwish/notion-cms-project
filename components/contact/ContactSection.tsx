'use client';

import { Phone, Mail, type LucideIcon } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import { Card, CardContent } from '@/components/ui/card';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { CONTACT_DATA } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { ContactInfo } from '@/lib/types';

/** iconName → Lucide 아이콘 컴포넌트 매핑 */
const ICON_MAP: Record<string, LucideIcon> = {
  Phone,
  Mail
};

/** stagger delay 클래스 목록 (카드 순서대로 매핑) */
const STAGGER_DELAY_CLASSES = [
  'fade-in-delay-100',
  'fade-in-delay-200'
] as const;

// =============================================================================
// ContactCard: 연락처 단일 카드
// =============================================================================

interface ContactCardProps {
  /** 연락처 정보 */
  item: ContactInfo;
  /** stagger delay 클래스 (fade-in-delay-N) */
  delayClass: string;
  /** 부모 섹션이 보이는 상태 */
  isVisible: boolean;
}

/**
 * 연락처 카드 컴포넌트
 * - 원형 배경 아이콘(bg-primary) + 타입 제목 + 연락처 값 표시
 * - 호버 시 translateY(-8px) + shadow 확대
 * - isVisible 상태에 따라 fade-in 애니메이션 적용
 * - 클릭 시 tel: 또는 mailto: 링크로 이동
 */
function ContactCard({ item, delayClass, isVisible }: ContactCardProps) {
  const IconComponent = ICON_MAP[item.iconName] ?? Phone;

  return (
    <a
      href={item.url}
      aria-label={`${item.label}: ${item.value}`}
      className={cn(
        'block transition-all duration-300',
        'hover:-translate-y-2 hover:shadow-lg',
        isVisible ? delayClass : 'opacity-0 translate-y-5'
      )}
    >
      <Card className="h-full border border-border bg-white dark:bg-slate-950">
        <CardContent className="flex flex-col items-center gap-5 p-8 text-center">
          {/* 원형 아이콘 배경: 파란색 계열 */}
          <div
            className="flex size-20 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500"
            aria-hidden="true"
          >
            <IconComponent className="size-9 text-white" />
          </div>

          {/* 연락처 타입 제목 */}
          <h3 className="text-xl font-semibold text-foreground">
            {item.label}
          </h3>

          {/* 연락처 값 */}
          <p className="text-base text-muted-foreground">
            {item.value}
          </p>
        </CardContent>
      </Card>
    </a>
  );
}

// =============================================================================
// ContactSection: 연락처 섹션
// =============================================================================

/**
 * Contact 섹션
 * - 제목: "Contact Me" (Contact = text-primary, Me = text-foreground)
 * - 설명 텍스트
 * - 연락처 카드 2개 (2열 그리드)
 * - 모바일 1열 → lg:grid-cols-2 2열 반응형 레이아웃
 * - 뷰포트 진입 시 카드 fade-in stagger 애니메이션
 */
export function ContactSection() {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <Section id="contact">
      {/* 섹션 헤더 */}
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="mb-12 text-center"
      >
        {/* 섹션 제목: "Contact" = 파란색, "Me" = 기본 텍스트 색상 */}
        <h2 className="text-4xl font-bold sm:text-5xl">
          <span className="text-blue-600 dark:text-blue-400">Contact</span>
          {' '}
          <span className="text-foreground">Me</span>
        </h2>

        {/* 섹션 설명 */}
        <p
          className={cn(
            'mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg',
            isVisible ? 'fade-in-delay-100' : 'opacity-0'
          )}
        >
          Feel free to reach out anytime. Whether it&apos;s a collaboration or
          a question, I&apos;d love to hear from you.
        </p>
      </div>

      {/* 연락처 카드 그리드 */}
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 lg:grid-cols-2">
        {CONTACT_DATA.map((item, index) => (
          <ContactCard
            key={item.type}
            item={item}
            delayClass={STAGGER_DELAY_CLASSES[index] ?? 'fade-in-delay-100'}
            isVisible={isVisible}
          />
        ))}
      </div>
    </Section>
  );
}

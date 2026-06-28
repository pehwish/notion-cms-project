import { PROFILE_DATA } from '@/lib/constants';
import { Container } from '@/components/layout/Container';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';

export function ContactCTASection() {
  return (
    <section
      aria-label="연락처 CTA"
      className="py-20 lg:py-28 bg-[#111111] dark:bg-[#0A0A0A] text-white"
    >
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight mb-4">
            함께 만들어가요
          </h2>
          <p className="text-lg text-white/70 mb-8 leading-relaxed">
            새로운 기회나 협업에 대해 이야기 나누고 싶다면 편하게 연락해 주세요.
          </p>

          {/* CTA 버튼 그룹 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`mailto:${PROFILE_DATA.email}`}
              className="h-[52px] px-6 rounded-full bg-white text-black font-semibold text-base inline-flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
            >
              <Mail className="h-4 w-4" />
              이메일 보내기
            </a>
            <a
              href={PROFILE_DATA.resumeUrl}
              className="h-[52px] px-6 rounded-full border border-white/30 text-white font-semibold text-base inline-flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
            >
              이력서 다운로드
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

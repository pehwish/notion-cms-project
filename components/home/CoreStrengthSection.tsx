import { CORE_STRENGTHS } from '@/lib/constants';
import { Container } from '@/components/layout/Container';
import {
  Shield,
  Layers,
  Users,
  Zap
} from 'lucide-react';

function StrengthIcon({ name }: { name: string }) {
  const iconProps = { className: 'h-6 w-6' };
  const iconMap: Record<string, React.ReactNode> = {
    Shield: <Shield {...iconProps} />,
    Layers: <Layers {...iconProps} />,
    Users: <Users {...iconProps} />,
    Zap: <Zap {...iconProps} />
  };
  return iconMap[name] || <Shield {...iconProps} />;
}

export function CoreStrengthSection() {
  return (
    <section
      aria-labelledby="core-strength-title"
      className="py-20 lg:py-28 bg-background"
    >
      <Container>
        <h2
          id="core-strength-title"
          className="text-3xl lg:text-4xl font-bold text-center leading-tight tracking-tight mb-4"
        >
          Core Strength
        </h2>
        <p className="text-center text-muted-foreground text-base lg:text-lg mb-12">
          11년의 경험이 만들어낸 4가지 핵심 역량
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_STRENGTHS.map((strength) => (
            <div
              key={strength.title}
              className="group rounded-3xl border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-slate-950 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
            >
              {/* 아이콘 */}
              <div className="mb-4 h-10 w-10 rounded-lg bg-foreground/5 dark:bg-foreground/10 flex items-center justify-center text-foreground">
                <StrengthIcon name={strength.iconName} />
              </div>

              {/* 제목 */}
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {strength.title}
              </h3>

              {/* 부제목 */}
              <p className="text-sm font-medium text-muted-foreground mb-3">
                {strength.subtitle}
              </p>

              {/* 설명 */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {strength.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

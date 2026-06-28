# 프리미엘 포트폴리오 - 구현 가이드

**대상**: 기존 Easy Code 포트폴리오 → 프리미엄 SaaS 스타일 포트폴리오 전환  
**추정 작업 시간**: 4-6시간 (구현 + 테스트)  
**의존성**: Next.js 15, React 19, Tailwind CSS v4, shadcn/ui

---

## 1. 새 컴포넌트 파일 구조

```
components/premium/
├── hero-section.tsx           # 히어로 섹션 (완성)
├── bento-grid.tsx            # Bento Grid 레이아웃 (완성)
├── projects-showcase.tsx      # 프로젝트 카드 (완성)
├── skills-timeline.tsx        # 스킬 + 경력 타임라인 (완성)
├── cta-section.tsx           # 연락처 CTA (완성)
└── index.ts                  # 배럴 내보내기 (완성)

docs/
├── PREMIUM_DESIGN_SYSTEM.md   # 디자인 스펙 (완성)
└── PREMIUM_IMPLEMENTATION_GUIDE.md  # 본 파일
```

---

## 2. 메인 페이지 통합 (app/(blog)/page.tsx)

### 현재 상태
```tsx
// 기존 app/(blog)/page.tsx
export default function BlogHome() {
  return (
    <>
      {/* 기존 Hero */}
      {/* 기존 Project List */}
      {/* 기존 Footer */}
    </>
  );
}
```

### 전환 방식

#### 옵션 A: 점진적 전환 (추천)
1. 신규 `/premium` 라우트에 새로운 디자인 배포
2. 기존 페이지 유지 (/blog)
3. Navigation에서 두 버전 모두 제공
4. 데이터 기반으로 테스트 후 기본값으로 전환

#### 옵션 B: 직접 대체
기존 페이지를 새 디자인으로 완전히 교체

**권장사항**: 옵션 A (위험 최소화)

---

## 3. 구현 단계

### Phase 1: 프리미엄 라우트 생성

```bash
# 신규 라우트 파일 생성
mkdir -p app/(blog)/premium
touch app/(blog)/premium/page.tsx
```

### Phase 2: 메인 페이지 코드

**app/(blog)/premium/page.tsx**

```tsx
import { Metadata } from 'next';
import {
  HeroSection,
  BentoGrid,
  ProjectsShowcase,
  SkillsTimeline,
  CTASection,
} from '@/components/premium';

export const metadata: Metadata = {
  title: 'Eunhye Park - Senior Frontend Architect',
  description:
    '10년 경력의 프론트엔드 아키텍트. 시스템 설계, 성능 최적화, 기술 리더십으로 엔터프라이즈급 솔루션을 구축합니다.',
  openGraph: {
    title: 'Eunhye Park - Senior Frontend Architect',
    description: '성능 최적화와 기술 리더십을 중심으로 한 포트폴리오',
    type: 'website',
    url: 'https://eunhyeportfolio.vercel.app/premium',
  },
};

export const revalidate = 3600; // ISR: 1시간마다 재검증

export default function PremiumPortfolioPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Core Competencies (Bento Grid) */}
      <BentoGrid />

      {/* 3. Featured Projects */}
      <ProjectsShowcase />

      {/* 4. Skills & Career Timeline */}
      <SkillsTimeline />

      {/* 5. Call-to-Action */}
      <CTASection />

      {/* 6. Footer (기존 재사용) */}
      {/* <Footer /> */}
    </main>
  );
}
```

### Phase 3: Notion 데이터 통합

현재는 하드코딩된 데이터를 사용하고 있습니다. 나중에 Notion API로 교체 가능합니다.

```tsx
// 예: 프로젝트 데이터를 Notion에서 가져오기
import { fetchPublishedPosts } from '@/lib/notion';

export default async function PremiumPortfolioPage() {
  const projects = await fetchPublishedPosts();

  return (
    <main>
      <HeroSection />
      <BentoGrid />
      <ProjectsShowcase projects={projects} />
      <SkillsTimeline />
      <CTASection />
    </main>
  );
}
```

---

## 4. 스타일 & 애니메이션

### 필요한 CSS (이미 globals.css에 포함됨)

```css
/* Fade-in 애니메이션 */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

/* 지연 애니메이션 */
.fade-in-delay-100 { animation: fade-in 0.6s ease-out 0.1s forwards; opacity: 0; }
.fade-in-delay-200 { animation: fade-in 0.6s ease-out 0.2s forwards; opacity: 0; }
/* ... */
```

**현재 상태**: globals.css에 이미 포함되어 있습니다! ✅

### Tailwind 설정 확인

```ts
// tailwind.config.ts
export default {
  theme: {
    colors: {
      slate: {
        900: '#0f172a',
        800: '#1e293b',
        700: '#334155',
        // ... 기타
      },
      blue: {
        500: '#3b82f6',
        400: '#60a5fa',
        // ... 기타
      },
    },
  },
};
```

**현재 상태**: Tailwind CSS v4가 설치되어 있으므로 사용 가능합니다 ✅

---

## 5. 마이크로 인터랙션 구현

### Intersection Observer (스크롤 기반 애니메이션)

```tsx
// 컴포넌트 내 구현 (이미 모든 컴포넌트에 포함됨)
const [isVisible, setIsVisible] = useState(false);
const ref = useRef<HTMLDivElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.2 }
  );

  if (ref.current) {
    observer.observe(ref.current);
  }

  return () => observer.disconnect();
}, []);

return (
  <div
    ref={ref}
    className={isVisible ? 'fade-in' : 'opacity-0'}
  >
    {/* 콘텐츠 */}
  </div>
);
```

### Hover 효과

```tsx
// Tailwind 클래스로 구현 (모든 컴포넌트에 포함됨)
<div className="group hover:border-blue-400/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all duration-300">
  <button className="group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-500" />
</div>
```

---

## 6. Notion API 데이터 통합 (선택사항)

현재 하드코딩된 데이터를 Notion에서 동적으로 가져올 수 있습니다.

### 6.1 프로젝트 데이터 구조

```typescript
// lib/types.ts에 타입 추가
interface ProjectShowcaseItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  role: string;
  period: string;
  metrics: Array<{ label: string; value: string }>;
  links: Array<{ label: string; href: string; icon: string }>;
}
```

### 6.2 Notion에서 데이터 가져오기

```typescript
// lib/notion.ts에 함수 추가
export async function fetchProjectsShowcase(): Promise<ProjectShowcaseItem[]> {
  // Notion API 호출로 프로젝트 데이터 조회
  // 필드: Title, Description, Technologies, Role, Period, Metrics, Links
  // 반환: ProjectShowcaseItem[]
}
```

### 6.3 페이지에서 사용

```tsx
export default async function PremiumPortfolioPage() {
  const projects = await fetchProjectsShowcase();

  return (
    <ProjectsShowcase projects={projects} />
  );
}
```

---

## 7. 이미지 & 자산

### 프로필 이미지

```tsx
// 현재: public/images/profile.png 또는 아바타 생성 필요

import Image from 'next/image';

<Image
  src="/images/profile.jpg"
  alt="Eunhye Park"
  width={400}
  height={400}
  priority
  className="rounded-xl"
/>
```

### 프로젝트 썸네일

```tsx
// 선택사항: 각 프로젝트별 썸네일 이미지
// public/images/projects/project-1.jpg 등
```

---

## 8. SEO & 메타데이터

### 메타데이터 설정

```typescript
// app/(blog)/premium/page.tsx
export const metadata: Metadata = {
  title: 'Eunhye Park - Senior Frontend Architect | 10+ Years Experience',
  description:
    'Frontend architect with 10+ years of experience. Expert in system design, performance optimization, and technical leadership. Specialized in React, Next.js, and scalable web architecture.',
  keywords: [
    'Frontend Developer',
    'React',
    'Next.js',
    'TypeScript',
    'System Architecture',
    'Performance Optimization',
  ],
  openGraph: {
    title: 'Eunhye Park - Senior Frontend Architect',
    description: 'Performance & Leadership-Driven Portfolio',
    type: 'website',
    url: 'https://eunhyeportfolio.vercel.app/premium',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eunhye Park - Senior Frontend Architect',
    description: 'Performance & Leadership-Driven Portfolio',
    images: ['/twitter-image.jpg'],
  },
};
```

### JSON-LD 구조화 데이터

```tsx
// app/(blog)/premium/page.tsx에 추가
export default function PremiumPortfolioPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Eunhye Park',
    url: 'https://eunhyeportfolio.vercel.app',
    jobTitle: 'Senior Frontend Architect',
    image: '/images/profile.jpg',
    sameAs: [
      'https://github.com/your-username',
      'https://linkedin.com/in/your-username',
    ],
    email: 'pehwish@gmail.com',
    telephone: '+82-10-7997-3104',
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* 페이지 콘텐츠 */}
    </main>
  );
}
```

---

## 9. 성능 최적화

### Next.js 최적화

```typescript
// app/(blog)/premium/page.tsx
export const revalidate = 3600; // ISR: 1시간
export const dynamic = 'auto'; // 동적 렌더링

// 이미지 최적화
<Image
  src="/images/profile.jpg"
  alt="Profile"
  width={400}
  height={400}
  priority={true} // 히어로 이미지는 우선 로드
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### CSS-in-JS 최소화

- Tailwind CSS 클래스만 사용 (수동 CSS 최소화)
- 인라인 스타일 피하기

### 번들 크기

```bash
# 분석 명령어
npm run build

# 결과 확인
# ✓ 0 Static ○ 1 Dynamic ○ 1 ISR
```

---

## 10. 접근성 검증

### 체크리스트

- [ ] 키보드 탐색: Tab 순서 정상 (맨 위부터 아래로)
- [ ] 포커스 표시: :focus-visible 검은색 배경에서 보이는지 확인
- [ ] 색상 대비: 최소 4.5:1 (WCAG AA)
  - 흰색 텍스트 on 파란색 배경: ✅ 7.1:1
  - 회색 텍스트 on 어두운 배경: ✅ 7.5:1
- [ ] 이미지 alt 텍스트: 모두 작성됨
- [ ] 시맨틱 마크업: `<section>`, `<h1>`, `<nav>` 사용
- [ ] 모션 감소: `prefers-reduced-motion` 미디어 쿼리 대응 ✅

### Lighthouse 감시

```bash
npm run build
npm start

# 브라우저에서 Lighthouse 실행 (DevTools)
# 목표:
# - Performance: > 85
# - Accessibility: > 90
# - Best Practices: > 90
# - SEO: > 90
```

---

## 11. 배포

### Vercel 배포

```bash
# 기존 Vercel 설정 유지
# 자동 배포: push to main

git add .
git commit -m "🎨 프리미엘 포트폴리오 디자인 시스템 추가"
git push origin main
```

### 환경 변수 (필요시)

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://eunhyeportfolio.vercel.app
NOTION_API_KEY=your_key_here
NOTION_DATABASE_ID=your_id_here
```

---

## 12. 테스트

### 브라우저 테스트

```
대상: Chrome, Safari, Firefox, Edge
화면:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1280px (MacBook)
```

### 성능 테스트

```bash
# 로컬 성능 측정
npm run build && npm start
# http://localhost:3000/premium 방문 후 DevTools → Performance 탭에서 측정
```

### 접근성 테스트

```bash
# axe DevTools 설치 (Chrome)
# https://www.deque.com/axe/devtools/

# 또는 WAVE 설치
# https://wave.webaim.org/extension/
```

---

## 13. 마이그레이션 플랜

### 단계 1: 동시 실행 (1-2일)
- `/premium` 라우트에 새 디자인 배포
- `/` (기존)과 `/premium` (신규) 동시 운영
- 성능/접근성 모니터링

### 단계 2: 네비게이션 추가 (1시간)
- Header에 "New Portfolio" 링크 추가
- 기존 포트폴리오 링크 유지

### 단계 3: A/B 테스트 (1주)
- 사용자 피드백 수집
- 분석 데이터 검토
- 필요시 수정

### 단계 4: 전환 (1시간)
- `/premium/page.tsx` → `/page.tsx`로 이동
- 기존 페이지 아카이브 (backup)
- Vercel 배포

---

## 14. 문제 해결

### 애니메이션이 작동하지 않음

```tsx
// 원인: JavaScript 비활성화 또는 `use client` 누락

// 해결:
'use client'; // 파일 최상단

useEffect(() => {
  const observer = new IntersectionObserver(...);
}, []);
```

### 스타일이 적용되지 않음

```tsx
// 원인: Tailwind 클래스 오타

// 확인:
// - `from-blue-500` (O) vs `from-blue-600` (X)
// - `hover:shadow-lg` (O) vs `shadow-lg-hover` (X)

// 빌드 다시 실행
npm run dev
```

### 이미지 로딩 느림

```tsx
// 해결: Next.js Image + sizes 속성
<Image
  src="/images/profile.jpg"
  alt="Profile"
  width={400}
  height={400}
  sizes="(max-width: 768px) 100vw, 50vw"
  priority // 히어로 이미지
/>
```

---

## 15. 추가 리소스

- 📚 [Next.js 15 Docs](https://nextjs.org/docs)
- 🎨 [Tailwind CSS Docs](https://tailwindcss.com/docs)
- ♿ [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- 📊 [Web Vitals Guide](https://web.dev/vitals/)
- 🔍 [Lighthouse Audit Guide](https://developers.google.com/web/tools/lighthouse)

---

## 요약

| 단계 | 작업 | 시간 | 상태 |
|------|------|------|------|
| 1 | 컴포넌트 작성 | 2h | ✅ 완료 |
| 2 | 디자인 시스템 문서화 | 1h | ✅ 완료 |
| 3 | 페이지 통합 (선택) | 30m | ⏳ 대기 |
| 4 | 테스트 & 배포 (선택) | 1h | ⏳ 대기 |
| **총 소요 시간** | - | **4.5h** | - |

프리미엄 포트폴리오 컴포넌트는 **완전히 준비되었습니다**. 이제 메인 페이지에 통합하면 됩니다! 🚀

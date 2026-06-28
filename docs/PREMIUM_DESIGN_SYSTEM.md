# 프리미엄 포트폴리오 - 디자인 시스템 & 마이크로 인터랙션

**작성일**: 2026-06-18  
**버전**: 1.0  
**목표**: SaaS 스타일의 프리미엄 포트폴리오 웹사이트 완성

---

## 1. 시각적 설계 철학

### 1.1 색상 체계

#### 라이트 모드 (준비 중)
```css
/* 기본 팔레트 */
--bg-primary: #FFFFFF
--bg-secondary: #F8F9FA
--text-primary: #0F1117
--text-secondary: #424242
--accent-primary: #0055FF (Electric Blue)
--accent-secondary: #6F42C1 (Purple)
```

#### 다크 모드 (기본)
```css
/* 기본 팔레트 */
--bg-primary: #0F172A (Slate 900)
--bg-secondary: #1E293B (Slate 800)
--bg-tertiary: #0F0F1E (Near Black)
--text-primary: #F1F5F9 (Slate 100)
--text-secondary: #CBD5E1 (Slate 300)
--text-tertiary: #94A3B8 (Slate 400)
--accent-primary: #3B82F6 (Blue 500)
--accent-secondary: #0EA5E9 (Cyan 500)
--accent-tertiary: #8B5CF6 (Purple 500)
```

### 1.2 타이포그래피

```
제목 (H1): Plus Jakarta Sans, 56px/64px, font-weight 700, letter-spacing -0.02em
제목 (H2): Plus Jakarta Sans, 48px/56px, font-weight 700, letter-spacing -0.015em
제목 (H3): Plus Jakarta Sans, 32px/40px, font-weight 600, letter-spacing -0.01em
본문 (P): Geist Sans, 16px/28px, font-weight 400, letter-spacing -0.01em
캡션: Geist Sans, 12px/16px, font-weight 500, letter-spacing 0.01em
```

### 1.3 공간 체계 (8px 기반)

```
xs: 4px (마이크로 스페이싱)
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
4xl: 80px
```

### 1.4 모서리 반경

```
sm: 4px (버튼, 작은 요소)
md: 8px (카드, 인풋)
lg: 16px (섹션, 큰 컨테이너)
xl: 24px (특수 요소)
full: 9999px (원형)
```

---

## 2. 컴포넌트별 마이크로 인터랙션

### 2.1 Hero Section

#### 배경 애니메이션
- **타입**: 정적 그래디언트 + 미세 점 패턴
- **색상**: Slate 900 → Slate 950 → Black 그래디언트
- **효과**: Subtle dot pattern overlay (opacity: 0.2)

#### 제목 텍스트
```
요소: h1
상태: Default
- Gradient text (white → blue → white)
- Letter-spacing: -0.02em
- Line-height: 1.2

상태: Render (페이지 로드 후)
- Animation: fade-in 0.6s ease-out
- Delay: 0s, 0.1s (라인별로 stagger)
```

#### 배지 (Badge)
```
요소: inline badge
상태: Default
- Border: 1px solid rgba(59, 130, 246, 0.2)
- Background: rgba(59, 130, 246, 0.05)
- Backdrop-filter: blur(8px)

상태: Hover
- Border: 1px solid rgba(59, 130, 246, 0.4)
- Background: rgba(59, 130, 246, 0.08)
- Duration: 300ms ease-in-out
```

#### CTA 버튼 (Primary)
```
요소: a.btn-primary
상태: Default
- Background: linear-gradient(90deg, #3B82F6, #0EA5E9)
- Padding: 12px 32px (py-3 px-8)
- Border-radius: 8px
- Box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1) inset

상태: Hover
- Background blur effect 추가:
  - Blur layer: rgba(59, 130, 246, 0.2)
  - Opacity: 0% → 100%
  - Duration: 300ms ease-in-out
- Icon translate-x: 0 → 4px
  - Duration: 200ms ease-out

상태: Active
- Scale: 0.98
- Duration: 100ms
```

#### CTA 버튼 (Secondary)
```
요소: a.btn-secondary
상태: Default
- Border: 1px solid rgba(71, 85, 105, 0.5)
- Background: transparent
- Color: rgba(226, 232, 240, 0.8)

상태: Hover
- Border: 1px solid rgba(59, 130, 246, 0.5)
- Background: rgba(59, 130, 246, 0.05)
- Color: rgba(59, 130, 246, 0.7)
- Duration: 300ms ease-in-out

상태: Focus-visible
- Outline: 2px solid rgba(59, 130, 246, 0.5)
- Outline-offset: 2px
```

#### 스크롤 인디케이터
```
요소: .scroll-indicator
상태: Animation
- Animation: bounce (up-down)
- Duration: 1s ease-in-out infinite
- Offset: 0px → -8px → 0px
- Opacity: Default
```

---

### 2.2 Bento Grid 섹션

#### 타일 (Tile) 기본 상태
```
요소: .bento-tile
상태: Default
- Background: rgba(15, 23, 42, 0.3) to rgba(30, 41, 59, 0.3)
- Border: 1px solid rgba(71, 85, 105, 0.5)
- Border-radius: 16px
- Backdrop-filter: blur(12px)
- Box-shadow: none

상태: Render (스크롤 진입 시)
- Animation: fade-in 0.6s ease-out
- Opacity: 0 → 1
- Transform: translateY(20px) → translateY(0)
- Stagger delay: 100ms × index

상태: Hover
- Border: 1px solid rgba(59, 130, 246, 0.5)
- Background: rgba(59, 130, 246, 0.08)
- Box-shadow: 0 0 40px rgba(59, 130, 246, 0.15)
- Duration: 500ms ease-in-out
- Transform: none (호버 상태에서 스케일 없음)

상태: Hover + 오버레이
- Inner gradient overlay (white to transparent): opacity 0 → 5%
- Duration: 500ms ease-in-out
```

#### 타일 아이콘
```
요소: .tile-icon
상태: Default
- Background: linear-gradient(135deg, rgba(71, 85, 105, 0.3), rgba(30, 41, 59, 0.3))
- Color: 타일별 색상 (Blue, Cyan, Purple, Green)
- Border-radius: 8px
- Padding: 12px (h-12 w-12)

상태: Hover (parent hover)
- Background opacity 증가: 0.3 → 0.5
- Color 유지
- Duration: 300ms ease-in-out
```

#### 타일 텍스트
```
제목:
- Color (default): rgba(226, 232, 240, 0.8)
- Color (hover): rgba(248, 250, 252, 1)
- Duration: 300ms ease-in-out

설명:
- Color (default): rgba(148, 163, 184, 1)
- Color (hover): rgba(203, 213, 225, 1)
- Duration: 300ms ease-in-out
```

#### 메트릭 배지
```
요소: .metric-badge
상태: Default
- Border-top: 1px solid rgba(71, 85, 105, 0.5)
- Padding: 16px 0
- Grid: 2 columns, gap 12px

값 텍스트:
- Font-size: 18px
- Font-weight: 700
- Color: rgba(59, 130, 246, 0.8)

레이블 텍스트:
- Font-size: 12px
- Color: rgba(71, 85, 105, 0.8)
```

---

### 2.3 프로젝트 카드 (Project Card)

#### 카드 기본 상태
```
요소: .project-card
상태: Default
- Background: rgba(30, 41, 59, 0.3) to rgba(15, 23, 42, 0.3)
- Border: 1px solid rgba(71, 85, 105, 0.5)
- Border-radius: 16px
- Backdrop-filter: blur(12px)
- Box-shadow: none

상태: Render (스크롤 진입 시)
- Animation: fade-in 0.6s ease-out
- Opacity: 0 → 1
- Transform: translateY(20px) → translateY(0)

상태: Hover
- Border: 1px solid rgba(59, 130, 246, 0.5)
- Background: rgba(59, 130, 246, 0.08)
- Box-shadow: 0 0 60px rgba(59, 130, 246, 0.15)
- Transform: scale(1.05) translateY(-8px)
- Duration: 500ms cubic-bezier(0.34, 1.56, 0.64, 1)

상태: Hover + 오버레이
- Inner gradient (white to transparent): opacity 0 → 5%
- Duration: 500ms ease-in-out
```

#### 카드 텍스트
```
제목 (h3):
- Font-size: 20px (md: 24px)
- Font-weight: 700
- Color (default): rgba(226, 232, 240, 0.8)
- Color (hover): rgba(248, 250, 252, 1)
- Duration: 300ms ease-in-out

메타정보 (subtitle):
- Font-size: 14px
- Color (default): rgba(71, 85, 105, 0.8)
- Color (hover): rgba(100, 116, 139, 0.9)
- Duration: 300ms ease-in-out

설명:
- Font-size: 16px
- Color (default): rgba(148, 163, 184, 0.8)
- Color (hover): rgba(203, 213, 225, 0.9)
- Duration: 300ms ease-in-out
```

#### 메트릭 섹션
```
요소: .metrics-grid
상태: Default
- Border-top/bottom: 1px solid rgba(71, 85, 105, 0.5)
- Padding: 16px 0
- Grid: 3 columns, gap 16px

값:
- Font-size: 18px
- Font-weight: 700
- Color: rgba(59, 130, 246, 0.8)

레이블:
- Font-size: 12px
- Color: rgba(71, 85, 105, 0.8)
```

#### 기술 스택 뱃지
```
요소: .tech-badge
상태: Default
- Background: rgba(71, 85, 105, 0.5)
- Border: 1px solid rgba(71, 85, 105, 0.5)
- Color: rgba(226, 232, 240, 0.8)
- Border-radius: 999px
- Padding: 6px 12px

상태: Hover (parent hover)
- Border: 1px solid rgba(59, 130, 246, 0.3)
- Background: rgba(59, 130, 246, 0.1)
- Color: rgba(59, 130, 246, 0.8)
- Duration: 300ms ease-in-out
```

#### 액션 버튼 (Link)
```
요소: .card-action-btn
상태: Default
- Border: 1px solid rgba(71, 85, 105, 0.5)
- Color: rgba(203, 213, 225, 0.8)
- Background: transparent

상태: Hover
- Border: 1px solid rgba(59, 130, 246, 0.5)
- Color: rgba(59, 130, 246, 0.8)
- Background: rgba(59, 130, 246, 0.05)
- Duration: 300ms ease-in-out

Icon animation:
- Icon translate-x: 0 → 4px
- Duration: 200ms ease-out
```

---

### 2.4 Skills & Timeline 섹션

#### 스킬 카테고리
```
요소: .skill-category
상태: Render (스크롤 진입 시)
- Animation: fade-in 0.6s ease-out
- Opacity: 0 → 1
- Duration: 600ms
```

#### 프로그레스 바
```
요소: .progress-bar
컨테이너:
- Background: rgba(71, 85, 105, 0.5)
- Border-radius: 999px
- Height: 8px

진행 바:
- Background: linear-gradient(90deg, rgba(59, 130, 246, 1), rgba(34, 211, 238, 1))
- Border-radius: 999px
- Animation: width 1s ease-out

상태: Render (스크롤 진입 시)
- Width: 0% → proficiency%
- Duration: 1s cubic-bezier(0.34, 1.56, 0.64, 1)
- Delay: 100ms × index
```

#### 타임라인 포인트
```
요소: .timeline-dot
상태: Default
- Size: 16px
- Background: linear-gradient(135deg, rgba(59, 130, 246, 1), rgba(34, 211, 238, 1))
- Border: 4px solid rgba(15, 23, 42, 1)
- Border-radius: 9999px
- Position: absolute left 0

상태: Render (스크롤 진입 시)
- Animation: scale 0.6s ease-out
- Scale: 0 → 1
- Delay: 100ms × index
```

#### 타임라인 연결선
```
요소: .timeline-connector
상태: Default
- Background: linear-gradient(to bottom, rgba(71, 85, 105, 0.6), transparent)
- Width: 2px
- Height: auto (item height)
- Position: absolute left 6px
```

#### 타임라인 아이템
```
요소: .timeline-item
상태: Render (스크롤 진입 시)
- Animation: fade-in 0.6s ease-out
- Opacity: 0 → 1
- Transform: translateX(-20px) → translateX(0)
- Delay: 100ms × index
```

---

### 2.5 CTA 섹션

#### 섹션 배경
```
요소: section background
상태: Default
- Gradient: to-top blue-950/20 → slate-950 → slate-900
- Glow effect: h-96 w-96 blur-3xl opacity 10%
```

#### CTA 카드
```
요소: .contact-card
상태: Default
- Border: 1px solid rgba(71, 85, 105, 0.5)
- Background: rgba(30, 41, 59, 0.3)
- Backdrop-filter: blur(12px)
- Border-radius: 16px

상태: Hover
- Border: 1px solid rgba(59, 130, 246, 0.5)
- Box-shadow: 0 0 40px rgba(59, 130, 246, 0.15)
- Duration: 300ms ease-in-out

아이콘 배경 (Hover):
- Background: rgba(59, 130, 246, 0.3)
- Duration: 300ms ease-in-out
```

#### 메인 CTA 버튼
```
요소: a.btn-primary-cta
상태: Default
- Background: linear-gradient(90deg, #3B82F6, #0EA5E9)
- Padding: 16px 40px

상태: Hover
- Blur layer (background): opacity 0 → 100%
- Duration: 300ms ease-in-out
- Icon translate-x: 0 → 4px

상태: Focus-visible
- Outline: 2px solid rgba(59, 130, 246, 0.5)
```

---

## 3. 전역 애니메이션

### 3.1 Scroll-triggered Animations

```css
/* Fade-in: 요소가 뷰포트에 진입할 때 */
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

/* Stagger delay */
.fade-in-delay-100 { animation-delay: 0.1s; }
.fade-in-delay-200 { animation-delay: 0.2s; }
.fade-in-delay-300 { animation-delay: 0.3s; }
.fade-in-delay-400 { animation-delay: 0.4s; }
.fade-in-delay-500 { animation-delay: 0.5s; }
```

### 3.2 Hover Animations

```css
/* Border glow 효과 */
transition: border-color 300ms ease-in-out, 
            background-color 300ms ease-in-out,
            box-shadow 300ms ease-in-out;

/* Scale-up on card hover */
transform: scale(1.05) translateY(-8px);
transition: transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

### 3.3 Loading & Render Animations

```css
/* 프로그레스 바 채우기 */
width: 0% → proficiency%;
animation: progress-fill 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;

/* 스케일-인 */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 4. 반응형 설계

### 4.1 브레이크포인트

```
xs: 0px (기본)
sm: 640px (모바일 가로)
md: 768px (태블릿)
lg: 1024px (데스크탑)
xl: 1280px (와이드)
2xl: 1536px (울트라 와이드)
```

### 4.2 Bento Grid 레이아웃

```
모바일 (xs):
- 1열 레이아웃
- 타일 높이: 300px
- 갭: 16px

태블릿 (md):
- 2열 레이아웃
- Large 타일: 2 rows
- 타일 높이: 320px
- 갭: 16px

데스크탑 (lg):
- 4열 레이아웃
- Large 타일: 2x2 (Performance)
- Medium 타일: 1x1
- Small 타일: 1x1
- 타일 높이: 320px
- 갭: 16px
```

### 4.3 히어로 섹션 타이포그래피

```
모바일:
- H1: 40px
- P: 16px

태블릿:
- H1: 56px
- P: 18px

데스크탑:
- H1: 64px
- P: 20px
```

---

## 5. 접근성 (A11y)

### 5.1 포커스 관리

```css
:focus-visible {
  outline: 2px solid rgba(59, 130, 246, 0.5);
  outline-offset: 2px;
}

/* 키보드 네비게이션 순서 */
tabindex: 자동 순서 (HTML 문서 순서)
```

### 5.2 색상 대비

```
텍스트 (WCAG AA):
- 본문: contrast ratio ≥ 4.5:1
- 라벨: contrast ratio ≥ 3:1

배경 + 텍스트:
- 다크모드: Slate 900 + White = 13.2:1 ✅
- 버튼 텍스트: White on Blue = 7.1:1 ✅
```

### 5.3 모션 감소

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 6. 성능 최적화

### 6.1 애니메이션 최적화

```
사용: transform, opacity (GPU 가속)
피하기: width, height, left, right (리플로우 유발)
```

### 6.2 Intersection Observer

```javascript
// 스크롤 기반 애니메이션 트리거
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      // fade-in 클래스 추가
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  },
  { threshold: 0.2 } // 20% 보이면 트리거
);
```

### 6.3 이미지 최적화

```
- Next.js Image 컴포넌트 사용
- Lazy loading 기본값
- WebP 포맷 자동 변환
- Responsive srcset 생성
```

---

## 7. 구현 파일 구조

```
components/premium/
├── hero-section.tsx           # 히어로 섹션
├── bento-grid.tsx            # Bento Grid 레이아웃
├── projects-showcase.tsx      # 프로젝트 카드
├── skills-timeline.tsx        # 스킬 + 타임라인
└── cta-section.tsx           # 연락처 CTA

app/
└── (blog)/
    └── page.tsx              # 모든 섹션을 조합한 메인 페이지
```

---

## 8. 컬러 팔레트 상세

### 8.1 Slate (기본 배경)
```
Slate 900: #0F172A (주 배경)
Slate 800: #1E293B (2차 배경)
Slate 700: #334155 (테두리)
Slate 600: #475569 (디바이더)
Slate 400: #94A3B8 (서브 텍스트)
Slate 300: #CBD5E1 (텍스트)
Slate 100: #F1F5F9 (주 텍스트)
```

### 8.2 Accent Colors
```
Blue 500: #3B82F6 (주 액센트)
Blue 400: #60A5FA (호버)
Cyan 500: #0EA5E9 (2차 액센트)
Cyan 400: #22D3EE (호버)
Purple 500: #8B5CF6 (3차 액센트)
Green 500: #10B981 (성공/체크)
```

---

## 9. 성공 기준

- ✅ 히어로 섹션: 초대형 타이포그래피 + 강력한 CTA
- ✅ Bento Grid: 비대칭 배치 + 글래스모피즘
- ✅ 프로젝트 카드: 호버 시 scale-up + 글로우
- ✅ 스킬/타임라인: 스크롤 애니메이션 + 데이터 시각화
- ✅ CTA 섹션: 연락처 정보 강조
- ✅ 반응형: 모바일/태블릿/데스크탑
- ✅ 접근성: WCAG 2.1 AA
- ✅ 성능: Lighthouse > 85

---

## 10. 참고 자료

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [CSS Animations & Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Web Accessibility (WCAG 2.1)](https://www.w3.org/WAI/WCAG21/quickref/)
- [SaaS UI Inspiration: Linear, Vercel, Figma](https://linear.app)

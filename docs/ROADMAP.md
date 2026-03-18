# Easy Code Portfolio 고도화 개발 로드맵

Notion CMS 기반 포트폴리오 사이트에 정적 콘텐츠 기반의 About, Skills, Contact 섹션을 추가하여 완성도 높은 개인 포트폴리오로 확장

## 개요

Easy Code Portfolio는 프론트엔드 개발자를 위한 포트폴리오 사이트로, 다음 고도화 기능을 제공합니다:

- **프로필 소개**: About 페이지에서 자기소개, 개발 철학, 경력 정보를 정적 콘텐츠로 표시
- **기술 스택 시각화**: Skills 섹션에서 JavaScript 배열 기반 데이터를 프로그레스 바와 배지로 표현
- **모던 UI/UX**: Fade-in 스크롤 애니메이션, 타이핑 효과, 호버 인터랙션으로 사용자 경험 향상
- **연락처 통합**: Contact 페이지에서 상수 기반 연락처 데이터를 카드 형태로 표시

## MVP 완료 상황 (Phase 1-5)

> 이전 로드맵: `/docs/roadmaps/ROADMAP_v1.md` 참고

- Phase 1: 프로젝트 골격 (구조, 환경 설정) -- 완료
- Phase 2: 공통 모듈 (Notion API, 컴포넌트) -- 완료
- Phase 3: 핵심 기능 (포트폴리오 목록/상세) -- 완료
- Phase 4: 추가 기능 (필터링, 검색, SEO) -- 완료
- Phase 5: 최적화 및 Vercel 배포 -- 완료
- 배포 URL: https://eunhyeportfolio.vercel.app

---

## 개발 워크플로우

1. **작업 계획**

   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-about-page-skeleton.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - 비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함
   - 초기 상태의 샘플로 `/tasks/000-sample.md` 참조

3. **작업 구현**

   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - Playwright MCP로 UI 렌더링 및 반응형 테스트 수행
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

   - 로드맵에서 완료된 작업을 완료 표시로 변경

---

## 핵심 전략: 정적 콘텐츠 중심

이번 고도화는 Notion 데이터베이스 연동 없이 정적 콘텐츠만 사용합니다:

- **Notion 연동 범위**: 기존 Portfolio 데이터베이스만 유지 (변경 없음)
- **About/Contact 데이터**: `lib/constants.ts`에 JavaScript 상수로 정의
- **기술 스택 데이터**: JavaScript 배열로 정의 (이름, 숙련도, 카테고리, 색상)
- **프로필 정보**: 페이지 컴포넌트에 직접 작성 (하드코딩)
- **스타일 참고**: `/Users/mac/workspace/my-profile-site` 디자인 패턴 활용

---

## 개발 단계

### Phase 6: About/Contact 페이지 골격 및 상수 정의 (2-3일)

**목표**: About/Contact 라우트 생성, 상수 데이터 정의, 공통 애니메이션 훅 구현

**왜 이 순서인가?**
모든 후속 UI 작업이 라우트 구조와 데이터 형태에 의존한다. 먼저 페이지 골격과 상수를 확정해야 UI 구현 시 데이터 형태를 미리 알 수 있고, 애니메이션 훅은 여러 섹션에서 공통으로 사용하므로 먼저 만들어야 한다.

- **Task 001: About/Contact 라우트 및 상수 데이터 정의** ✅ - 완료
  - ✅ `app/(blog)/about/page.tsx` 빈 페이지 생성 (서버 컴포넌트)
  - ✅ `app/(blog)/contact/page.tsx` 빈 페이지 생성 (서버 컴포넌트)
  - `components/profile/` 디렉토리 구조 생성 (빈 컴포넌트 파일)
  - `components/contact/` 디렉토리 구조 생성 (빈 컴포넌트 파일)
  - ✅ Header 네비게이션에 About, Contact 링크 추가 (`lib/constants.ts`)
  - ✅ `lib/constants.ts`에 정적 데이터 상수 추가:
    - ✅ `SKILLS_DATA`: 기술 스택 배열 (name, category, proficiency, color)
    - ✅ `CONTACT_DATA`: 연락처 배열 (type, label, value, url, iconName)
    - ✅ `PROFILE_DATA`: 프로필 정보 (name, role, bio, location)
    - ✅ `PHILOSOPHY_DATA`: 개발 철학 배열 (title, description, iconName)
  - 각 페이지에 `generateMetadata()` 기본 메타데이터 생성

- **Task 002: 타입 정의 및 공통 애니메이션 훅 생성** ✅ - 완료
  - ✅ `lib/types.ts` 확장: `Skill`, `ContactInfo`, `ProfileInfo`, `Philosophy` 인터페이스 추가
  - ✅ `hooks/use-intersection-observer.ts`: IntersectionObserver 커스텀 훅 (fade-in 애니메이션용)
  - ✅ `hooks/use-typing-animation.ts`: 타이핑 효과 커스텀 훅
  - ✅ `lib/animation-variants.ts`: 공통 애니메이션 CSS 클래스 및 transition 상수 정의
  - ✅ `app/globals.css`에 fade-in, typing, float 키프레임 애니메이션 추가

### Phase 7: About 페이지 UI 완성 (2-3일)

**목표**: About 페이지의 모든 섹션 UI를 상수 데이터 기반으로 완성, 반응형 디자인 적용

**왜 이 순서인가?**
Phase 6에서 골격과 상수 데이터가 준비되었으므로 바로 UI를 구현한다. 정적 데이터를 사용하기 때문에 API 연동 없이 즉시 완성된 결과를 확인할 수 있다.

- **Task 003: Hero 섹션 컴포넌트 구현** ✅ - 완료
  - ✅ `components/profile/hero-section.tsx`: 히어로 섹션 (프로필 이미지 + 이름 + 직무 + 한 줄 소개)
  - ✅ 타이핑 애니메이션 적용 (`use-typing-animation` 훅 활용)
  - ✅ CTA 버튼 2개: "View Projects" (포트폴리오 링크), "Contact Me" (연락처 링크)
  - ✅ 프로필 이미지 float 애니메이션 적용
  - ✅ 반응형: 모바일 1열 세로 배치, 데스크탑 2열 가로 배치
  - ✅ `PROFILE_DATA` 상수에서 데이터 참조

- **Task 004: About 소개 섹션 및 개발 철학 카드 구현** ✅ - 완료
  - ✅ `components/profile/about-section.tsx`: 자기소개 섹션
  - ✅ 왼쪽: 대형 배경 타이포그래피 ("WHO AM I") + 이름/직무/위치 표시
  - ✅ 오른쪽: 자기소개 텍스트 + 철학 카드 3개
    - ✅ Clean Code (lucide Code 아이콘)
    - ✅ User-Centered (lucide User 아이콘)
    - ✅ Always Growing (lucide GraduationCap 아이콘)
  - ✅ Fade-in 스크롤 애니메이션 적용 (`use-intersection-observer` 훅 활용)
  - ✅ 반응형: 모바일 1열, 데스크탑 2열 그리드
  - ✅ `PHILOSOPHY_DATA` 상수에서 데이터 참조

- **Task 005: Skills 섹션 컴포넌트 구현** ✅ - 완료
  - ✅ `components/profile/skills-section.tsx`: 기술 스택 섹션
  - ✅ 프로그레스 바 UI: 기술명 + 숙련도(%) + 애니메이션 바
  - ✅ 카테고리별 그룹화 (Frontend, Tools)
  - ✅ 스크롤 진입 시 프로그레스 바 채워지는 애니메이션 (useSkillAnimation + requestAnimationFrame)
  - ✅ 숫자 카운트업 애니메이션 (0% -> 목표%, easeOut 커브)
  - ✅ 반응형: 모바일 1열, 데스크탑 2열 그리드
  - ✅ `SKILLS_DATA` 상수에서 데이터 참조
  - ✅ 10개 기술: HTML(95%), CSS(90%), JavaScript(85%), React(85%), TypeScript(80%), Vue.js(75%), Next.js(85%), Tailwind(88%), Git(90%), Web Accessibility(80%)

- **Task 006: About 페이지 섹션 조합 및 전체 플로우 검증** ✅ - 완료
  - ✅ `app/(blog)/about/page.tsx`: Hero + Separator + About + Separator + Skills 섹션 조합
  - ✅ 섹션 간 Separator로 시각적 구분
  - ✅ 전체 페이지 플로우 검증 (데스크탑/태블릿/모바일)
  - ✅ Playwright MCP로 About 페이지 렌더링 테스트 ✅

### Phase 8: Contact 페이지 및 네비게이션 완성 (2-3일)

**목표**: Contact 페이지 UI 완성, 모바일 네비게이션 재구현, 페이지 간 연결 완성

**왜 이 순서인가?**
About 페이지가 완성된 후 Contact 페이지를 구현하면 공통 스타일과 애니메이션 패턴을 재사용할 수 있다. 네비게이션은 모든 페이지가 존재해야 완성할 수 있으므로 마지막에 배치한다.

- **Task 007: Contact 페이지 컴포넌트 구현** ✅ - 완료
  - ✅ `components/contact/contact-section.tsx`: 연락처 섹션
  - ✅ 연락처 카드 UI: 원형 아이콘 배경(blue-600) + 타입(Phone/Email) + 값
  - ✅ 카드 호버 효과: 그림자 확대 + Y축 -8px 이동
  - ✅ Fade-in 스크롤 애니메이션 적용
  - ✅ 반응형: 모바일 1열, 데스크탑 2열 그리드
  - ✅ `CONTACT_DATA` 상수에서 데이터 참조
  - ✅ 연락처: Phone(010-7997-3104), Email(pehwish@gmail.com)

- **Task 008: Contact 페이지 조합 및 네비게이션 완성** ✅ - 완료
  - `app/(blog)/contact/page.tsx`: Contact 섹션 배치 + 메타데이터 설정
  - ✅ 모바일 햄버거 메뉴 재구현 (About, Portfolio, Contact 링크)
    - ✅ Sheet(슬라이드) 방식 모바일 메뉴 (shadcn/ui Sheet 컴포넌트 활용)
  - ✅ Header 네비게이션 최종 검증 (About, Portfolio, Contact)
  - 페이지 간 링크 연결 확인 (Hero CTA -> Portfolio, Contact)
  - Playwright MCP로 Contact 페이지 및 전체 네비게이션 테스트

### Phase 9: 애니메이션 및 UI/UX 개선 (2-3일)

**목표**: 다크테마 강화, 스크롤 애니메이션 정교화, 호버 효과 통일, 전반적 시각 완성도 향상

**왜 이 순서인가?**
모든 페이지와 컴포넌트가 완성된 후 시각적 완성도를 높이는 작업을 진행한다. 기능이 안정된 상태에서 애니메이션을 추가해야 성능 영향을 정확히 측정할 수 있고, 불필요한 재작업을 방지할 수 있다.

- **Task 009: 다크테마 강화 및 색상 시스템 개선** ✅ - 완료
  - ✅ `app/globals.css`: 다크모드 CSS 변수 설정 (oklch 색상 시스템)
  - ✅ 카드 컴포넌트 다크모드 스타일 (bg-slate-950, border-border)
  - ✅ 프로그레스 바 다크모드 색상 조정
  - ✅ 배경 패턴 다크모드 대응
  - ✅ 전체 페이지 다크/라이트 모드 전환 시 부드러운 transition

- **Task 010: 스크롤 애니메이션 및 호버 인터랙션 통일** ✅ - 완료
  - ✅ Fade-in 스크롤 애니메이션 전체 적용 (staggered delay 100/200/300/400/500ms)
  - ✅ 카드 호버 효과 통일: translateY(-8px) + hover:shadow-lg
  - ✅ Hero 섹션 프로필 이미지 float 애니메이션 (3s ease-in-out infinite)
  - ✅ Skills 프로그레스 바 스크롤 진입 시 채워지는 애니메이션 (useSkillAnimation)
  - ✅ Contact 카드 원형 배경 호버 효과
  - ✅ `prefers-reduced-motion` 미디어 쿼리 대응 (접근성) ✅

### Phase 10: 최적화 및 배포 (1-2일)

**목표**: 성능 최적화, 접근성 검증, SEO 확장, 최종 배포

**왜 이 순서인가?**
모든 기능과 UI가 완성된 후 성능 최적화를 진행해야 실제 병목을 측정하고 개선할 수 있다. 미완성 기능에 최적화를 적용하면 이후 코드 변경 시 무용지물이 된다.

- **Task 011: SEO 및 메타데이터 확장** ✅ - 완료
  - ✅ `app/sitemap.ts` 업데이트: About, Contact 페이지 포함
  - ⏳ About 페이지 JSON-LD 구조화 데이터 (Person 스키마)
  - ⏳ Contact 페이지 JSON-LD 구조화 데이터 (ContactPoint 스키마)
  - ✅ Open Graph 메타데이터 완성 (About, Contact 페이지용)
  - ⏳ robots.txt 업데이트 (새 페이지 포함)
  - ⏳ 각 페이지 canonical URL 설정

- **Task 012: 성능 최적화 및 접근성 감사** ✅ - 완료
  - ✅ Build 에러 수정: revalidate 리터럴화
  - ✅ 프로덕션 빌드 성공 (npm run build)
  - ✅ 프로덕션 서버 정상 작동 확인 (npm start)
  - ✅ 모든 페이지 정상 렌더링 확인 (/, /about, /contact)
  - ⏳ Next.js Image 컴포넌트로 프로필 이미지 최적화
  - ⏳ 번들 크기 분석 및 불필요한 의존성 제거
  - ⏳ WCAG 2.1 AA 접근성 감사
    - ⏳ 시맨틱 마크업 검토 (section, article, nav, heading 계층)
    - ⏳ 키보드 네비게이션 테스트 (탭 순서, 포커스 관리)
    - ⏳ 스크린 리더 호환성 (aria-label, alt 텍스트)
    - ⏳ 색상 대비 검사 (다크/라이트 모드 모두)
  - ⏳ Lighthouse 성능 점수 > 85 달성 확인
  - ⏳ 반응형 레이아웃 모든 브레이크포인트 테스트 (375px, 768px, 1280px)
  - ⏳ Playwright MCP로 전체 사이트 E2E 테스트 수행

- **Task 013: 최종 배포 및 검증**
  - ✅ 프로덕션 빌드 테스트 (`npm run build && npm start`)
  - ⏳ Vercel 배포 및 프로덕션 환경 검증
  - ✅ 모든 페이지 정상 동작 확인 (/, /about, /contact)
  - ⏳ 성공 기준 최종 검증

---

## 성공 기준

프로젝트 고도화 완료 시 다음 기준을 충족해야 합니다:

| 기준 | 상태 |
|------|------|
| About 페이지에서 프로필/자기소개가 정적 콘텐츠로 표시됨 | |
| Skills 섹션에서 기술 스택이 프로그레스 바로 시각화됨 | |
| Contact 페이지에서 연락처가 카드 형태로 표시됨 | |
| Fade-in 스크롤 애니메이션이 부드럽게 동작함 | |
| 다크/라이트 테마 전환이 모든 페이지에서 정상 작동함 | |
| 모바일/태블릿/데스크탑 반응형 레이아웃 확인 | |
| Lighthouse 성능 점수 > 85 | |
| 접근성 (WCAG 2.1 AA) 준수 | |
| Vercel 프로덕션 배포 완료 | |

---

## 전체 일정 요약

| Phase | 설명 | 예상 기간 | 누적 기간 | 주요 산출물 |
|-------|------|----------|----------|-----------|
| **6** | 페이지 골격 및 상수 데이터 정의 | 2-3일 | 2-3일 | 라우트 생성, 상수 데이터, 타입 정의, 애니메이션 훅 |
| **7** | About 페이지 UI 완성 | 2-3일 | 4-6일 | Hero, About, Skills 섹션 UI 완성 |
| **8** | Contact 페이지 및 네비게이션 완성 | 2-3일 | 6-9일 | Contact 섹션, 모바일 메뉴, 네비게이션 |
| **9** | 애니메이션 및 UI/UX 개선 | 2-3일 | 8-12일 | 다크테마, 스크롤 애니메이션, 호버 효과 |
| **10** | 최적화 및 배포 | 1-2일 | 9-14일 | SEO, 성능 최적화, 접근성, Vercel 배포 |

**전체 소요 기간**: 9-14일 (일반적으로 약 10-12일)

---

## 상수 데이터 구조 (lib/constants.ts 확장 예정)

### PROFILE_DATA

```typescript
export const PROFILE_DATA = {
  name: 'Eunhye Park',
  role: 'Frontend Developer',
  location: 'Seoul, Korea',
  bio: '사용자가 원하는 경험을 만들어내는 프론트엔드 개발자',
  imageUrl: '/images/profile.png',
} as const;
```

### SKILLS_DATA

```typescript
export const SKILLS_DATA = [
  { name: 'HTML', category: 'Frontend', proficiency: 95, color: 'bg-orange-400' },
  { name: 'CSS', category: 'Frontend', proficiency: 90, color: 'bg-blue-400' },
  { name: 'JavaScript', category: 'Frontend', proficiency: 85, color: 'bg-yellow-400' },
  { name: 'React', category: 'Frontend', proficiency: 80, color: 'bg-cyan-400' },
  { name: 'TypeScript', category: 'Frontend', proficiency: 75, color: 'bg-indigo-400' },
  { name: 'Vue.js', category: 'Frontend', proficiency: 70, color: 'bg-green-400' },
  { name: 'Next.js', category: 'Frontend', proficiency: 78, color: 'bg-gray-700' },
  { name: 'Tailwind', category: 'Frontend', proficiency: 88, color: 'bg-cyan-400' },
] as const;
```

### CONTACT_DATA

```typescript
export const CONTACT_DATA = [
  { type: 'Phone', label: 'Phone', value: '010-7997-3104', url: 'tel:01079973104', iconName: 'Phone' },
  { type: 'Email', label: 'Email', value: 'pehwish@gmail.com', url: 'mailto:pehwish@gmail.com', iconName: 'Mail' },
] as const;
```

### PHILOSOPHY_DATA

```typescript
export const PHILOSOPHY_DATA = [
  { title: 'Clean Code', description: 'Writing readable, maintainable code that teams can build on.', iconName: 'Code' },
  { title: 'User-Centered', description: 'Always prioritizing the end-user\'s experience in every design decision.', iconName: 'User' },
  { title: 'Always Growing', description: 'Embracing new technologies and continuously improving as a developer.', iconName: 'GraduationCap' },
] as const;
```

---

## 새로 추가되는 디렉토리 구조

```
components/
  profile/                  # 프로필 관련 컴포넌트 (신규)
    hero-section.tsx
    about-section.tsx
    skills-section.tsx
  contact/                  # 연락처 관련 컴포넌트 (신규)
    contact-section.tsx
app/(blog)/
  about/page.tsx            # About 페이지 (신규)
  contact/page.tsx          # Contact 페이지 (신규)
hooks/
  use-intersection-observer.ts  # IntersectionObserver 훅 (신규)
  use-typing-animation.ts      # 타이핑 애니메이션 훅 (신규)
lib/
  animation-variants.ts    # 애니메이션 상수 (신규)
```

---

## 기존 코드 보호 원칙

- 기존 `(blog)` 라우트 그룹 및 포트폴리오 기능 무손상
- `components/blog/` 하위 컴포넌트 수정 금지
- `lib/notion.ts`는 기존 함수 유지, 수정 없음
- `lib/types.ts`는 기존 인터페이스 유지, 새 인터페이스만 추가
- `lib/constants.ts`는 기존 상수 유지, 새 상수만 추가

---

## 마일스톤 체크리스트

### Phase 6 체크리스트
- [x] About/Contact 페이지 라우트 생성 완료
- [x] 상수 데이터 정의 완료 (SKILLS_DATA, CONTACT_DATA, PROFILE_DATA, PHILOSOPHY_DATA)
- [x] TypeScript 타입 정의 (Skill, ContactInfo, ProfileInfo, Philosophy) 완료
- [x] 공통 애니메이션 훅 (IntersectionObserver, typing) 구현 완료

### Phase 7 체크리스트
- [x] Hero 섹션 UI 완성 (타이핑 애니메이션 + CTA 버튼)
- [x] About 소개 섹션 UI 완성 (배경 타이포그래피 + 철학 카드)
- [x] Skills 섹션 UI 완성 (프로그레스 바 + 카운트업 애니메이션)
- [x] About 페이지 섹션 조합 및 전체 플로우 검증

### Phase 8 체크리스트
- [x] Contact 페이지 UI 완성 (연락처 카드 + 호버 효과)
- [x] 모바일 햄버거 메뉴 재구현 (Sheet 방식)
- [x] Header 네비게이션 최종 검증 (About, Portfolio, Contact)
- [x] 페이지 간 링크 연결 확인

### Phase 9 체크리스트
- [x] 다크테마 강화 (카드, 프로그레스 바, 배경 패턴)
- [x] Fade-in 스크롤 애니메이션 전체 적용 (staggered delay)
- [x] 호버 인터랙션 통일 (카드, Contact)
- [x] `prefers-reduced-motion` 접근성 대응

### Phase 10 체크리스트
- [ ] SEO 확장 (sitemap, JSON-LD Person/ContactPoint, Open Graph)
- [ ] Lighthouse 성능 > 85, 접근성 감사 통과
- [ ] Vercel 프로덕션 배포 완료
- [ ] 성공 기준 모두 충족 확인

---

## 진행 상황

**Phase 진행도**: Phase 6 완료 ✅ → Phase 7 완료 ✅ → Phase 8 완료 ✅ → Phase 9 완료 ✅ → Phase 10 진행 중

**전체 진행률**: 12/13 Tasks 완료 (약 92%)

**최종 업데이트**: 2026-03-19

---

## 참고 자료

- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [Tailwind CSS v4 반응형](https://tailwindcss.com/docs/responsive-design)
- [shadcn/ui 컴포넌트](https://ui.shadcn.com)
- [lucide-react 아이콘](https://lucide.dev)
- [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
- [WCAG 2.1 접근성 가이드](https://www.w3.org/WAI/WCAG21/quickref/)
- 정적 포트폴리오 참고: `/Users/mac/workspace/my-profile-site` (디자인/애니메이션 참고)

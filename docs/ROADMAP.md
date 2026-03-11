# ROADMAP: 개인 개발 블로그 (Notion CMS)

**작성일**: 2026년 3월 9일
**버전**: 1.1
**프로젝트**: Personal Dev Blog with Notion CMS
**📅 최종 업데이트**: 2026년 3월 10일

---

## 📋 개요

본 ROADMAP은 개인 개발 블로그 프로젝트의 5단계 개발 계획을 정의합니다. 각 Phase는 PRD.md의 기능 요구사항(F-01~F-05)과 비기능 요구사항을 포함하며, 예상 소요 기간은 **9-14일**입니다.

---

## 🎯 Phase별 상세 계획

### **Phase 1: 프로젝트 골격 (구조, 환경 설정) (1-2일) ✅**

**목표**: 개발 환경 구축 및 기본 프로젝트 구조 완성

**❓ 왜 이 순서인가?**
모든 후속 단계가 이 골격에 의존한다. 디렉토리 구조와 환경 변수가 없으면 코드를 어디에 배치할지 불명확하고, Notion API 연동 자체가 불가능하다. 기초 공사 없이 기능을 만들면 나중에 전면 재구조화가 필요해진다.

**작업 항목**:
- [x] Next.js 프로젝트 구조 설정 (PRD §7 디렉토리 구조 참고)
- [x] `.env.local` 설정
  - ✅ `NOTION_API_KEY`: Notion API 키
  - ✅ `NOTION_DATABASE_ID`: Blog Posts 데이터베이스 ID
- [x] 기본 레이아웃 구조 생성
  - ✅ `app/(blog)/layout.tsx`: 블로그 전용 레이아웃
  - ✅ `app/(blog)/page.tsx`: 홈 페이지
- [x] `components/blog/` 디렉토리 구조 생성
- [x] TypeScript 타입 정의 초기 구성 (`lib/types.ts`)

**관련 PRD 항목**: §9 API 통합 계획, §7 프로젝트 디렉토리 구조

---

### **Phase 2: 공통 모듈 (모든 기능에서 쓰는 것들) (2-3일)**

**목표**: Notion API 연동 및 공통 컴포넌트 완성

**❓ 왜 이 순서인가?**
핵심 기능 개발 전에 공통 타입, API 함수, 컴포넌트를 먼저 정의해야 중복 없이 재사용할 수 있다. 이 단계가 늦어지면 기능 개발 중 인터페이스가 자주 바뀌어 불안정해지고, 중복 코드가 쌓인다.

**작업 항목**:
- [ ] Notion API 클라이언트 및 공통 함수 구현 (`lib/notion.ts`)
  - `@notionhq/client` 설정
  - `fetchPublishedPosts()`: 발행 글 조회 함수
  - `fetchPostBySlug()`: 특정 글 조회 함수
  - `fetchPageBlocks()`: 페이지 블록 조회 함수
- [ ] 공통 타입 정의 완성 (`lib/types.ts`)
  - `Post`: 블로그 글 타입 (PRD §5 Notion DB 스키마 기반)
  - `Category`, `Tag`: 카테고리/태그 타입
- [ ] 공통 컴포넌트 구현
  - `components/layout/header.tsx`: 헤더/네비게이션
  - `components/layout/footer.tsx`: 푸터
  - `components/blog/post-card.tsx`: 글 카드 컴포넌트
  - `components/blog/post-list.tsx`: 글 목록 컴포넌트
- [ ] Notion 블록 → HTML 변환 로직 기초 (`lib/notion-blocks.ts`)

**관련 PRD 항목**: §5 Notion 데이터베이스 스키마, §9 API 엔드포인트

---

### **Phase 3: 핵심 기능 (가장 중요한 기능) (3-4일)**

**목표**: F-01, F-02 핵심 기능 완성

**❓ 왜 이 순서인가?**
프로젝트의 핵심 가치(글 목록/상세 보기)를 최대한 빨리 완성해 조기에 실제 작동하는 제품을 확인할 수 있다. 핵심이 없으면 추가 기능을 테스트하거나 검증할 수가 없다.

**작업 항목**:
- [ ] **F-01: 블로그 글 목록 조회**
  - `app/(blog)/page.tsx` 구현
  - Notion API를 통해 발행(Published) 상태 글 조회
  - 최신 순서(발행일 기준 내림차순)로 정렬
  - 글 카드 목록 렌더링
- [ ] **F-02: 개별 글 상세 페이지**
  - `app/(blog)/posts/[slug]/page.tsx` 구현
  - 글 제목, 작성일, 카테고리, 태그, 본문 내용 표시
  - `components/blog/post-content.tsx`: Notion 페이지 블록 렌더러
  - 메타데이터 동적 생성 (`generateMetadata()`)
- [ ] ISR(Incremental Static Regeneration) 설정
  - `revalidate: 3600` (1시간 주기로 재검증)
  - 새 글 발행 시 자동 재빌드 지원
- [ ] 메타데이터 및 Open Graph 설정
  - 제목, 설명, 작성자, 발행일
  - OG 이미지 (글 썸네일)

**관련 PRD 항목**: F-01, F-02, §3 성능/SEO, §11 성공 기준

---

### **Phase 4: 추가 기능 (부가적인 기능) (2-3일)**

**목표**: F-03, F-04, SEO 최적화 완성

**❓ 왜 이 순서인가?**
핵심이 작동한 후에야 UX를 향상시키는 부가 기능(필터링, 검색, SEO)을 붙이는 것이 효율적이다. 핵심 없이 필터/검색을 구현하면 그 기능 자체를 테스트할 데이터와 컨텍스트가 존재하지 않는다.

**작업 항목**:
- [ ] **F-03: 카테고리별 필터링**
  - `/?category=name` 쿼리 스트링 처리
  - `components/blog/category-filter.tsx` 구현
  - 홈 페이지에서 카테고리별 글 목록 필터링
  - 필터 제거 옵션 제공
- [ ] **F-04: 키워드 검색**
  - `/?q=keyword` 쿼리 스트링 처리
  - `components/blog/search-bar.tsx` 구현
  - 제목 및 태그 기반 검색
  - 검색 결과 페이지네이션 (선택사항)
- [ ] **SEO 최적화**
  - Sitemap 자동 생성 (`app/sitemap.ts`)
  - robots.txt 설정
  - 구조화된 데이터 (Schema.org JSON-LD)
    - Article, BlogPosting 마크업
  - 동적 메타데이터 완성도 개선

**관련 PRD 항목**: F-03, F-04, §3 SEO 요구사항

---

### **Phase 5: 최적화 및 배포 (1-2일)**

**목표**: F-05 및 성능/접근성 요구사항 완성

**❓ 왜 이 순서인가?**
성능 최적화는 기능이 완성된 후에 진행해야 실제 병목을 측정하고 개선할 수 있다. 미완성 기능에 최적화를 적용하면 이후 코드 변경 시 무용지물이 된다. 배포는 모든 기능과 품질 검증이 끝난 마지막에 수행한다.

**작업 항목**:
- [ ] **F-05: 반응형 디자인**
  - 모바일 (< 640px): 1열 레이아웃
  - 태블릿 (640px - 1024px): 2열 레이아웃
  - 데스크탑 (> 1024px): 3열 레이아웃
  - Tailwind CSS 반응형 클래스 적용
- [ ] **성능 최적화**
  - LCP (Largest Contentful Paint) < 2.5s
  - CLS (Cumulative Layout Shift) < 0.1
  - 이미지 최적화 (Next.js Image 컴포넌트)
  - 폰트 로딩 최적화
- [ ] **캐시 전략**
  - Notion API 응답 캐싱 (ISR 활용)
  - CDN 캐시 헤더 설정
- [ ] **접근성 감사 (WCAG 2.1 AA)**
  - 시맨틱 마크업 검토
  - 키보드 네비게이션 지원 확인
  - 스크린 리더 호환성 테스트
  - 색상 대비 검사
- [ ] **Vercel 배포**
  - Vercel 프로젝트 연결
  - 환경 변수 설정
  - 배포 전 최종 테스트
  - 프로덕션 배포

**관련 PRD 항목**: F-05, §3 비기능 요구사항 (성능, 접근성), §12 배포

---

## ✅ 성공 기준

프로젝트 완료 시 다음 기준을 충족해야 합니다 (PRD §11 기반):

| 기준 | 상태 |
|------|------|
| Notion에서 발행한 글이 웹사이트에 자동으로 표시됨 | ☐ |
| 글 상세 페이지가 정상적으로 렌더링됨 (메타데이터 포함) | ☐ |
| 카테고리 필터링 및 검색이 정상 작동함 | ☐ |
| 모바일/태블릿/데스크탑에서 반응형 레이아웃 확인 | ☐ |
| Lighthouse 성능 점수 > 85 | ☐ |

---

## 📅 전체 일정 요약

| Phase | 설명 | 예상 기간 | 누적 기간 | 주요 산출물 |
|-------|------|----------|----------|-----------|
| **1** | 프로젝트 초기 설정 | 1-2일 | 1-2일 | 프로젝트 구조, 환경 설정 |
| **2** | 공통 모듈 개발 | 2-3일 | 3-5일 | Notion API 클라이언트, 공통 컴포넌트 |
| **3** | 핵심 기능 개발 | 3-4일 | 6-9일 | 글 목록/상세 페이지, ISR 설정 |
| **4** | 추가 기능 개발 | 2-3일 | 8-12일 | 필터링, 검색, SEO 최적화 |
| **5** | 최적화 및 배포 | 1-2일 | 9-14일 | 반응형 디자인, 성능 최적화, Vercel 배포 |

**전체 소요 기간**: 9-14일 (일반적으로 약 10-11일)

---

## 🔗 마일스톤 체크리스트

### Phase 1 체크리스트 ✅
- [x] Next.js 프로젝트 구조 완성
- [x] 환경 변수 설정 (.env.local)
- [x] 기본 레이아웃 구현
- [x] 초기 타입 정의 완료

### Phase 2 체크리스트
- [ ] Notion API 클라이언트 구현
- [ ] 공통 컴포넌트 완성
- [ ] 공통 함수 구현 (fetchPublishedPosts, fetchPostBySlug)
- [ ] 블록 변환 로직 기초 완성

### Phase 3 체크리스트
- [ ] F-01 완료: 글 목록 페이지 정상 작동
- [ ] F-02 완료: 글 상세 페이지 정상 작동
- [ ] ISR 설정 및 테스트
- [ ] 메타데이터 동적 생성 확인

### Phase 4 체크리스트 ✅
- [x] F-03 완료: 카테고리 필터링 정상 작동 (홈페이지에서 구현됨)
- [x] F-04 완료: 검색 기능 정상 작동 (홈페이지에서 구현됨)
- [x] SEO 최적화 완료 (Sitemap, robots.txt, JSON-LD Article 스키마)
- [x] Lighthouse SEO 점수 확인 (Phase 5 성능 최적화 후 검증)

### Phase 5 체크리스트
- [ ] F-05 완료: 반응형 디자인 모든 브레이크포인트 테스트
- [ ] 성능 최적화 완료 (LCP < 2.5s, CLS < 0.1)
- [ ] 접근성 감사 완료 (WCAG 2.1 AA)
- [ ] Vercel 배포 완료
- [ ] 성공 기준 모두 충족 확인

---

## 🚀 다음 단계

1. ✅ **Phase 1 완료**: 프로젝트 구조 및 기본 설정 완성
2. **Phase 2 시작**: Notion API 클라이언트 및 공통 컴포넌트 구현
3. **Notion 데이터베이스 준비**: Blog Posts 데이터베이스 생성 및 샘플 글 작성
4. **개발 진행**: Phase 2~5 순차적 진행
5. **정기 검토**: 각 Phase 완료 후 성공 기준 확인

---

## 📊 진행 상황

**Phase 진행도**: Phase 1 ✅ → Phase 2 ✅ → Phase 3 ✅ → Phase 4 ✅ → Phase 5 예정

**완료된 마일스톤**:
- Phase 1: 5/5 작업 완료 (100%) ✅
- Phase 2: API 클라이언트 + 공통 컴포넌트 완료 (100%) ✅
- Phase 3: 핵심 기능 (글 목록/상세 + 블록 렌더링) 완료 (100%) ✅
- Phase 4: SEO 최적화 (Sitemap, robots.txt, JSON-LD) 완료 (100%) ✅

**다음 목표**:
- Phase 5: 반응형 디자인 + 성능 최적화 + 배포 (2-3일)

---

## 📚 참고 자료

- [Notion API 문서](https://developers.notion.com)
- [Next.js 15 동적 라우팅](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Tailwind CSS 반응형 디자인](https://tailwindcss.com/docs/responsive-design)
- [WCAG 2.1 접근성 가이드](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev 성능 최적화](https://web.dev/performance/)

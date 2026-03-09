# PRD: 개인 개발 블로그 (Notion CMS)

**작성일**: 2026년 3월 9일
**버전**: 1.0

---

## 1. 프로젝트 개요

### 프로젝트명
개인 개발 블로그 (Personal Dev Blog with Notion CMS)

### 목적 및 배경
- **목적**: 개발 경험과 지식을 기록하고 공유할 수 있는 개인 블로그 구축
- **배경**: 기존 블로그 플랫폼 대신 자신만의 커스터마이징이 가능한 블로그를 원함. Notion을 콘텐츠 관리 시스템으로 사용하여 간단하게 글을 작성하고 관리할 수 있는 환경 제공

### CMS로 Notion 선택 이유
- **편의성**: Notion UI에서 직관적으로 글 작성 및 관리 가능
- **비용 효율성**: 데이터베이스 호스팅 비용 없음
- **유연성**: 커스텀 속성 추가 용이 (카테고리, 태그, 상태 등)
- **API 지원**: Notion API를 통한 자동화 가능

---

## 2. 기능 요구사항

### F-01: Notion 데이터베이스 연동 및 블로그 글 목록 조회
- Notion API를 통해 블로그 데이터베이스에 접근
- 발행됨(Published) 상태인 글만 표시
- 최신 글 순서로 정렬 (발행일 기준 내림차순)

### F-02: 개별 글 상세 페이지
- 경로: `/posts/[slug]`
- 글 제목, 작성일, 카테고리, 태그, 본문 내용 표시
- Notion 페이지 블록을 HTML로 변환하여 렌더링
- 메타데이터 동적 생성 (SEO)

### F-03: 카테고리별 필터링
- 쿼리 스트링 방식: `/?category=name`
- 홈 페이지에서 카테고리별 글 목록 필터링
- 필터 제거 옵션 제공

### F-04: 키워드 검색
- 쿼리 스트링 방식: `/?q=keyword`
- 제목 및 태그 기반 검색
- 검색 결과 페이지네이션 지원 (선택사항)

### F-05: 반응형 디자인
- 모바일 (< 640px): 1열 레이아웃
- 태블릿 (640px - 1024px): 2열 레이아웃
- 데스크탑 (> 1024px): 3열 레이아웃

---

## 3. 비기능 요구사항

### 성능
- **ISR(Incremental Static Regeneration)**: 새 글 발행 시 자동 재빌드 (재검증 주기: 3600초)
- **캐시 전략**: Notion API 응답 캐싱 (Redis 또는 인메모리 캐시)
- **페이지 로딩**: LCP < 2.5s, CLS < 0.1

### SEO
- 동적 메타데이터 생성 (제목, 설명, Open Graph)
- Sitemap 자동 생성
- 구조화된 데이터 (Schema.org)

### 접근성
- WCAG 2.1 AA 준수
- 시맨틱 마크업 사용
- 키보드 네비게이션 지원
- 스크린 리더 호환성

---

## 4. 기술 스택

| 계층 | 기술 |
|------|------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **CMS** | Notion API (@notionhq/client) |
| **Icons** | Lucide React |
| **Markdown** | `@notion-to-md/notion-to-md` (또는 직접 변환) |
| **Deployment** | Vercel |

---

## 5. Notion 데이터베이스 스키마

### 데이터베이스명: Blog Posts

| 필드명 | 타입 | 설명 | 필수 여부 |
|--------|------|------|---------|
| Title | Title | 글 제목 | ✅ |
| Slug | Text | URL 경로용 슬러그 (예: `my-first-post`) | ✅ |
| Category | Select | 카테고리 (React, Node.js, DevOps 등) | ✅ |
| Tags | Multi-select | 태그 (JavaScript, TypeScript 등) | ❌ |
| Published | Date | 발행일 | ✅ |
| Status | Select | 상태 (초안 / 발행됨) | ✅ |
| Description | Text | 글 요약 (리스트에 표시) | ❌ |
| Content | Page content | 본문 (Notion 블록) | ✅ |

**Status 옵션**:
- 초안 (Draft)
- 발행됨 (Published)

**Category 옵션** (예시):
- React
- Node.js
- TypeScript
- DevOps
- 웹 성능

---

## 6. 화면 구성 (페이지 목록)

| 경로 | 화면명 | 설명 | 주요 요소 |
|------|--------|------|---------|
| `/` | 홈 | 최근 글 목록 | 글 카드 목록, 카테고리 필터, 검색바 |
| `/posts/[slug]` | 글 상세 | 개별 글 내용 | 제목, 메타정보, 본문, 이전/다음 글 링크 |
| `/?category=[name]` | 홈 (카테고리 필터) | 특정 카테고리의 글만 표시 | 필터된 글 목록, 필터 상태 표시 |
| `/?q=[keyword]` | 홈 (검색) | 키워드 검색 결과 | 검색된 글 목록, 검색어 표시 |

---

## 7. 프로젝트 디렉토리 구조 (예정)

```
notion-cms-project/
├── app/
│   ├── (blog)/                    # 블로그 라우트 그룹
│   │   ├── layout.tsx             # 블로그 레이아웃
│   │   ├── page.tsx               # 홈 페이지 (/posts 목록)
│   │   └── posts/
│   │       └── [slug]/
│   │           └── page.tsx       # 글 상세 페이지
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── notion.ts                  # Notion API 클라이언트 및 페칭 함수
│   ├── types.ts                   # 블로그 타입 정의 확장
│   ├── constants.ts               # (기존)
│   ├── utils.ts                   # (기존)
│   └── stores/
├── components/
│   ├── ui/                        # (기존 shadcn/ui)
│   ├── layout/                    # (기존)
│   ├── common/                    # (기존)
│   └── blog/                      # 블로그 전용 컴포넌트
│       ├── post-card.tsx          # 글 카드
│       ├── post-list.tsx          # 글 목록
│       ├── category-filter.tsx    # 카테고리 필터
│       ├── search-bar.tsx         # 검색바
│       └── post-content.tsx       # 글 본문 렌더러
├── docs/
│   └── PRD.md                     # (본 문서)
└── public/
```

---

## 8. 마일스톤

### Phase 1: 기초 구축 (주차 1-2)
- [ ] Notion API 인증 및 클라이언트 설정 (`lib/notion.ts`)
- [ ] 블로그 타입 정의 (`lib/types.ts`)
- [ ] 글 목록 조회 함수 구현
- [ ] 홈 페이지 및 글 카드 컴포넌트 구현

### Phase 2: 상세 페이지 및 메타데이터 (주차 3-4)
- [ ] `posts/[slug]` 상세 페이지 구현
- [ ] Notion 블록 → HTML 변환 로직
- [ ] SEO 메타데이터 동적 생성 (`generateMetadata`)
- [ ] ISR 설정

### Phase 3: 필터링 및 검색 (주차 5-6)
- [ ] 카테고리 필터링 (`/?category=name`)
- [ ] 키워드 검색 (`/?q=keyword`)
- [ ] 검색 결과 페이지네이션
- [ ] UI 개선 및 사용성 테스트

### Phase 4: 배포 및 최적화 (주차 7)
- [ ] Vercel 배포 설정
- [ ] 성능 최적화 및 캐시 전략 검토
- [ ] 접근성 감사 (WCAG 2.1 AA)
- [ ] 프로덕션 배포

---

## 9. API 통합 계획

### Notion API 엔드포인트

1. **데이터베이스 조회**
   ```
   GET /v1/databases/{database_id}/query
   ```
   - Filter: Status = "Published"
   - Sort: Published (desc)

2. **페이지 조회**
   ```
   GET /v1/pages/{page_id}
   ```

3. **블록 조회**
   ```
   GET /v1/blocks/{page_id}/children
   ```

### 환경 변수
```
NOTION_API_KEY=<your_api_key>
NOTION_DATABASE_ID=<your_database_id>
```

---

## 10. 데이터 흐름

```
[Notion Database]
        ↓
[Notion API]
        ↓
[Next.js API Route / Server Component]
        ↓
[Cache Layer (ISR/In-Memory)]
        ↓
[React Component]
        ↓
[User Browser]
```

---

## 11. 성공 기준

- ✅ Notion에서 발행한 글이 웹사이트에 자동으로 표시됨
- ✅ 글 상세 페이지가 정상적으로 렌더링됨 (메타데이터 포함)
- ✅ 카테고리 필터링 및 검색이 정상 작동함
- ✅ 모바일/태블릿/데스크탑에서 반응형 레이아웃 확인
- ✅ Lighthouse 점수: Performance > 85

---

## 12. 참고 자료

- [Notion API 문서](https://developers.notion.com)
- [Next.js 15 Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [TailwindCSS 반응형 디자인](https://tailwindcss.com/docs/responsive-design)
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

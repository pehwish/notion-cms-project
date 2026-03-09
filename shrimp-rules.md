# AI Agent Development Guidelines for Notion CMS Blog Project

이 문서는 AI 에이전트가 Notion CMS 블로그 프로젝트에서 작업할 때 따라야 할 표준과 규칙을 정의합니다.

---

## 1. 프로젝트 개요

### 목적
Notion을 CMS로 사용하는 개인 개발 블로그 구축. Next.js 15 + React 19 StarterKit 위에 블로그 기능을 추가합니다.

### 핵심 기술 스택
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode - `any` 타입 금지)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **CMS**: Notion API (@notionhq/client)
- **상태관리**: Zustand
- **폼**: React Hook Form + Zod

### 프로젝트 참고 문서
- `CLAUDE.md`: 코딩 스타일 및 커뮤니케이션 규칙
- `docs/PRD.md`: 기능 요구사항 (F-01~F-05)
- `docs/ROADMAP.md`: 5단계 개발 계획

---

## 2. 프로젝트 아키텍처

### 디렉토리 구조 (블로그 관련)
```
notion-cms-project/
├── app/
│   ├── (blog)/                    # 블로그 라우트 그룹 (신규)
│   │   ├── layout.tsx             # 블로그 레이아웃
│   │   ├── page.tsx               # 홈 페이지 (글 목록)
│   │   └── posts/
│   │       └── [slug]/
│   │           └── page.tsx       # 글 상세 페이지
│   ├── (marketing)/               # 기존 - 수정 금지
│   ├── (docs)/                    # 기존 - 수정 금지
│   └── layout.tsx                 # 루트 레이아웃 (기존)
├── components/
│   ├── blog/                      # 블로그 컴포넌트 (신규)
│   │   ├── post-card.tsx
│   │   ├── post-list.tsx
│   │   ├── post-content.tsx
│   │   ├── category-filter.tsx
│   │   └── search-bar.tsx
│   ├── ui/                        # shadcn/ui - 기존
│   ├── layout/                    # 기존 - 수정 금지
│   ├── common/                    # 기존 - 수정 금지
│   └── showcase/                  # 기존 - 수정 금지
├── lib/
│   ├── notion.ts                  # Notion API 클라이언트 (신규)
│   ├── types.ts                   # 타입 확장 (신규 타입 추가)
│   ├── constants.ts               # 상수 확장 (블로그 관련)
│   ├── utils.ts                   # 기존
│   └── stores/
│       └── ui-store.ts            # 기존
└── docs/
    ├── PRD.md
    └── ROADMAP.md
```

### 라우트 그룹 역할
- **`(marketing)`**: 공개 마케팅 페이지 (기존)
- **`(docs)`**: 문서 섹션 (기존)
- **`(blog)`**: 블로그 섹션 (신규) - 블로그 글 목록/상세 페이지

---

## 3. 코드 스타일 (CLAUDE.md 기준 준수)

### 명명 규칙
| 대상 | 규칙 | 예시 |
|-----|------|------|
| 변수/함수 | camelCase | `fetchPublishedPosts`, `postTitle` |
| 컴포넌트 | PascalCase | `PostCard`, `CategoryFilter` |
| 파일명 (컴포넌트) | PascalCase | `PostCard.tsx`, `CategoryFilter.tsx` |
| 파일명 (유틸/lib) | kebab-case | `notion.ts`, `format.ts` |

### 포맷팅
- **들여쓰기**: 2칸 스페이스
- **세미콜론**: 필수
- **주석**: 한국어로 작성
- **line length**: 120자 기준

### TypeScript 엄격성
```typescript
// ✅ 허용
const posts: Post[] = [];
const fetchPost = async (slug: string): Promise<Post | null> => {};

// ❌ 금지
const posts: any = [];
const fetchPost = (slug: any) => {};
```

### JSDoc 주석
```typescript
/**
 * Notion API에서 발행된 블로그 글을 조회합니다.
 * @param limit - 조회할 글 개수 (기본값: 10)
 * @returns 발행된 글 배열
 */
async function fetchPublishedPosts(limit: number = 10): Promise<Post[]> {}
```

---

## 4. Notion 관련 구현 표준

### 환경 변수 설정
`.env.local` 파일에 다음 변수를 정의합니다:
```env
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_blog_database_id
```

### lib/notion.ts 구조 (필수 구현)
```typescript
import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// F-01: 발행된 글 목록 조회
export async function fetchPublishedPosts(): Promise<Post[]> {
  // Status = "Published" 필터링
  // 발행일 기준 내림차순 정렬
}

// F-02: 특정 글 조회
export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  // Slug로 특정 글 조회
}

// F-03/F-04: 필터링 및 검색
export async function filterPostsByCategory(category: string): Promise<Post[]> {}
export async function searchPostsByKeyword(keyword: string): Promise<Post[]> {}

// 블록 조회 및 변환
export async function fetchPageBlocks(pageId: string): Promise<Block[]> {}
```

### 타입 정의 (lib/types.ts 확장)
```typescript
// 블로그 관련 타입 추가
interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  description?: string;
  publishedDate: Date;
  status: 'draft' | 'published';
  content?: string; // HTML 변환 후 저장
}

interface Category {
  name: string;
  label: string;
}

interface Tag {
  name: string;
  label: string;
}
```

### 에러 처리
```typescript
// ✅ 필수: Notion API 에러 처리
try {
  const response = await notion.databases.query({ database_id });
  return response.results;
} catch (error) {
  console.error('Notion API 에러:', error);
  throw new Error('블로그 글을 불러올 수 없습니다.');
}

// ❌ 금지: 에러 무시
const response = await notion.databases.query({ database_id });
return response?.results || []; // 위험!
```

---

## 5. 컴포넌트 구현 표준

### 디렉토리 할당 명확화
| 용도 | 디렉토리 | 예시 |
|------|---------|------|
| 블로그 글 카드 | `components/blog/` | `post-card.tsx` |
| 문서 쇼케이스 | `components/showcase/` | `form-showcase.tsx` |
| 레이아웃 블록 | `components/layout/` | `header.tsx`, `footer.tsx` |
| 프로바이더/공통 | `components/common/` | `theme-provider.tsx` |

### 클라이언트/서버 구분
```typescript
// ✅ 서버 컴포넌트 (기본)
// app/(blog)/page.tsx
export default async function BlogHomePage() {
  const posts = await fetchPublishedPosts();
  return <PostList posts={posts} />;
}

// ✅ 클라이언트 컴포넌트 (상호작용 필요 시)
// components/blog/category-filter.tsx
'use client';

import { useSearchParams } from 'next/navigation';

export function CategoryFilter() {
  const searchParams = useSearchParams();
  // ...
}
```

### 컴포넌트 파일 명명
```typescript
// ✅ 허용
// components/blog/post-card.tsx
export function PostCard({ post }: { post: Post }) {}

// components/blog/category-filter.tsx
export function CategoryFilter() {}

// ❌ 금지: 파일과 컴포넌트 이름 불일치
// components/blog/post.tsx에서 export PostCardComponent {}
```

---

## 6. 기능별 구현 순서 (ROADMAP.md 기반)

### Phase 1: 기초 구축 (1-2일)
**구현 범위**: 프로젝트 구조, 환경 설정, 초기 타입
- [ ] `app/(blog)/layout.tsx` 생성
- [ ] `app/(blog)/page.tsx` 생성 (기본 틀)
- [ ] `lib/types.ts` 확장 (Post, Category, Tag 타입)
- [ ] `.env.local` 작성 (NOTION_API_KEY, NOTION_DATABASE_ID)

**관련 파일**:
- `app/(blog)/layout.tsx`
- `app/(blog)/page.tsx`
- `lib/types.ts`
- `.env.local`

---

### Phase 2: 공통 모듈 (2-3일)
**구현 범위**: Notion API 클라이언트, 공통 컴포넌트, 블록 변환 로직
- [ ] `lib/notion.ts` 생성 및 기본 함수 구현
- [ ] `components/blog/post-card.tsx` 구현
- [ ] `components/blog/post-list.tsx` 구현
- [ ] `lib/notion-blocks.ts` 생성 (블록 변환 로직)

**관련 파일**:
- `lib/notion.ts` (필수)
- `lib/notion-blocks.ts` (필수)
- `components/blog/post-card.tsx`
- `components/blog/post-list.tsx`
- `lib/types.ts` (확장)

**의존성**:
- `lib/types.ts`를 먼저 정의한 후 `lib/notion.ts` 구현
- `post-card.tsx` 먼저 구현, 이후 `post-list.tsx` 구현

---

### Phase 3: 핵심 기능 (3-4일)
**구현 범위**: 글 목록, 글 상세 페이지, ISR, SEO 메타데이터
- [ ] F-01: `app/(blog)/page.tsx` 완성 (글 목록)
- [ ] F-02: `app/(blog)/posts/[slug]/page.tsx` 생성 (글 상세)
- [ ] `components/blog/post-content.tsx` 구현 (블록 렌더러)
- [ ] `generateMetadata()` 구현 (SEO)
- [ ] ISR 설정 (`revalidate: 3600`)

**관련 파일**:
- `app/(blog)/page.tsx`
- `app/(blog)/posts/[slug]/page.tsx` (신규)
- `components/blog/post-content.tsx` (신규)
- `lib/notion.ts` (확장)

---

### Phase 4: 추가 기능 (2-3일)
**구현 범위**: 필터링, 검색, SEO 최적화
- [ ] F-03: `components/blog/category-filter.tsx` 구현
- [ ] F-04: `components/blog/search-bar.tsx` 구현
- [ ] `app/sitemap.ts` 생성
- [ ] `robots.txt` 생성
- [ ] 구조화된 데이터 (Schema.org) 구현

**관련 파일**:
- `components/blog/category-filter.tsx` (신규)
- `components/blog/search-bar.tsx` (신규)
- `app/sitemap.ts` (신규)
- `public/robots.txt` (신규)

---

### Phase 5: 최적화 및 배포 (1-2일)
**구현 범위**: 반응형 디자인, 성능 최적화, 배포
- [ ] F-05: 반응형 디자인 완성
  - 모바일: 1열
  - 태블릿: 2열
  - 데스크탑: 3열
- [ ] Lighthouse 점수 최적화 (Performance > 85)
- [ ] 접근성 감사 (WCAG 2.1 AA)
- [ ] Vercel 배포

**관련 파일**:
- 모든 블로그 컴포넌트 (반응형 클래스 추가)

---

## 7. 파일 간 의존성 및 동시 수정 규칙

### 필수 동시 수정 (Multi-file Coordination)

#### 규칙 1: 새 타입 추가 시
**시나리오**: `lib/types.ts`에 새로운 타입 추가

**필수 확인사항**:
- [ ] `lib/notion.ts` 함수 반환 타입 일치
- [ ] 관련 컴포넌트 Props 타입 업데이트
- [ ] `lib/constants.ts`에 기본값 필요 시 추가

**예시**:
```typescript
// lib/types.ts에 Post 타입 추가
interface Post {
  id: string;
  title: string;
  category: string; // ← 새로운 필드
}

// lib/notion.ts에서 반드시 category 처리
export async function fetchPublishedPosts(): Promise<Post[]> {
  const results = response.results.map((page) => ({
    category: page.properties.Category?.select?.name, // ← 필수
  }));
}
```

#### 규칙 2: 새 라우트 추가 시
**시나리오**: `app/(blog)/posts/[slug]/page.tsx` 추가

**필수 확인사항**:
- [ ] 대응하는 데이터 조회 함수 `lib/notion.ts`에 존재 (`fetchPostBySlug`)
- [ ] 타입이 `lib/types.ts`에 정의됨
- [ ] 메타데이터 함수 (`generateMetadata`) 구현
- [ ] ISR 설정 (`revalidate: 3600`)

#### 규칙 3: 새 필터/검색 기능 추가 시
**시나리오**: 카테고리 필터 추가 (`components/blog/category-filter.tsx`)

**필수 확인사항**:
- [ ] `lib/notion.ts`에 필터링 함수 존재 (`filterPostsByCategory`)
- [ ] 쿼리 스트링 파싱 로직 (`lib/utils.ts` 또는 신규 유틸)
- [ ] `app/(blog)/page.tsx`에서 쿼리 스트링 처리
- [ ] 타입 정의 (`lib/types.ts`)

---

## 8. 금지 사항 (DO NOT)

### 🚫 StarterKit 기존 파일 수정 금지
다음 파일들은 블로그 기능 추가 시 수정하면 안 됩니다:
- `components/common/*` (프로바이더, 공통 컴포넌트)
- `components/layout/*` (기존 레이아웃)
- `components/showcase/*` (문서 쇼케이스)
- `app/(marketing)/*` (마케팅 페이지)
- `app/(docs)/*` (문서 섹션)
- `app/layout.tsx` (루트 레이아웃)

**예외**: 프로바이더 추가 필요 시 `components/common/` 확장 가능 (다른 프로바이더 추가 시)

---

### 🚫 TypeScript 타입 안전성 위반
```typescript
// ❌ 금지: any 타입 사용
const posts: any = [];
const post: any = await fetchPost(slug);

// ❌ 금지: 타입 단언 남용
const post = data as Post;

// ✅ 허용: 명시적 타입
const posts: Post[] = [];
const post: Post | null = await fetchPost(slug);
```

---

### 🚫 상수 매직 넘버
```typescript
// ❌ 금지
if (array.length > 10) { ... }
const limit = fetch(`/api?count=20`);

// ✅ 허용
const MAX_POSTS_PER_PAGE = 10;
const DEFAULT_NOTION_LIMIT = 20;

if (array.length > MAX_POSTS_PER_PAGE) { ... }
const limit = fetch(`/api?count=${DEFAULT_NOTION_LIMIT}`);
```

**위치**: `lib/constants.ts`에 정의

---

### 🚫 Notion API 에러 무시
```typescript
// ❌ 금지: 에러 무시하고 진행
const response = await notion.databases.query({...});
return response?.results || [];

// ✅ 허용: 명시적 에러 처리
try {
  const response = await notion.databases.query({...});
  return response.results;
} catch (error) {
  logger.error('Notion API 오류:', error);
  throw new Error('블로그 글을 불러올 수 없습니다.');
}
```

---

### 🚫 타입 정의 없이 컴포넌트 구현
```typescript
// ❌ 금지: Post 타입이 없는 상태에서 컴포넌트 구현
export function PostCard(props: any) { ... }

// ✅ 허용: 타입을 먼저 정의하고 컴포넌트 구현
interface Post {
  id: string;
  title: string;
  // ...
}

export function PostCard({ post }: { post: Post }) { ... }
```

---

### 🚫 잘못된 디렉토리에 파일 생성
```
❌ components/showcase/post-card.tsx (쇼케이스 아님)
❌ components/layout/post-list.tsx (레이아웃 아님)
❌ lib/blog/types.ts (lib 직하위에 types.ts)

✅ components/blog/post-card.tsx
✅ components/blog/post-list.tsx
✅ lib/types.ts (확장)
```

---

## 9. 허용 사항 (DO)

### ✅ lib/types.ts 확장
Post, Category, Tag 등 블로그 관련 타입 추가:
```typescript
interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  publishedDate: Date;
  status: 'draft' | 'published';
}
```

---

### ✅ lib/constants.ts 확장
블로그 관련 상수 추가:
```typescript
export const BLOG_CONFIG = {
  postsPerPage: 10,
  revalidateTime: 3600, // 1시간
  dbName: 'Blog Posts',
};

export const BLOG_CATEGORIES = [
  { name: 'react', label: 'React' },
  { name: 'nodejs', label: 'Node.js' },
];
```

---

### ✅ 새 lib 모듈 생성
블로그 관련 기능을 별도 파일로 분리:
```typescript
lib/
├── notion.ts (Notion API 클라이언트)
├── notion-blocks.ts (블록 변환 로직)
├── blog-utils.ts (블로그 유틸 함수)
└── types.ts (타입 확장)
```

---

### ✅ components/blog/ 디렉토리 자유 생성
블로그 전용 컴포넌트:
```
components/blog/
├── post-card.tsx
├── post-list.tsx
├── post-content.tsx
├── category-filter.tsx
└── search-bar.tsx
```

---

### ✅ app/(blog)/ 라우트 그룹 생성
블로그 관련 라우트:
```
app/(blog)/
├── layout.tsx
├── page.tsx
└── posts/
    └── [slug]/
        └── page.tsx
```

---

## 10. 결정 트리 (Decision Tree)

AI 에이전트가 모호한 상황에서 결정해야 할 때 사용합니다.

### Q1: 새 파일을 어디에 생성할까?
```
파일의 용도가 무엇인가?
├─ Notion API 관련 함수
│  └─ lib/notion.ts 또는 lib/notion-blocks.ts
├─ 블로그 타입
│  └─ lib/types.ts (확장)
├─ 블로그 상수
│  └─ lib/constants.ts (확장)
├─ 블로그 컴포넌트
│  └─ components/blog/
├─ 블로그 페이지/라우트
│  └─ app/(blog)/
└─ 기타 유틸
   └─ lib/blog-utils.ts 또는 기존 lib/ 파일 확장
```

---

### Q2: 기존 파일을 수정해야 하나?
```
수정할 파일이 StarterKit 핵심 파일인가?
├─ YES (components/common/, components/layout/, app/(marketing), app/(docs))
│  └─ ❌ 수정 금지. 대신 새 파일 생성
├─ NO
│  └─ 수정 가능
│     └─ lib/types.ts, lib/constants.ts, app/layout.tsx 등은 확장 가능
```

---

### Q3: Phase 순서는?
```
현재 구현할 기능은?
├─ 프로젝트 구조/환경설정
│  └─ Phase 1 (ROADMAP.md 참고)
├─ Notion API/공통 컴포넌트
│  └─ Phase 2
├─ 글 목록/상세 페이지
│  └─ Phase 3
├─ 필터링/검색
│  └─ Phase 4
└─ 반응형/성능/배포
   └─ Phase 5
```

**규칙**: Phase 순서를 반드시 준수합니다. Phase 3를 건너뛰고 Phase 4를 진행하면 안 됩니다.

---

## 11. API 응답 처리 패턴

### Notion API 응답 → 타입 변환
```typescript
// ✅ 권장: 명시적 변환
function mapNotionPageToPost(page: PageObjectResponse): Post {
  return {
    id: page.id,
    title: (page.properties.Title as TitlePropertyItemObjectResponse)
      .title[0]?.plain_text || '',
    slug: (page.properties.Slug as RichTextPropertyItemObjectResponse)
      .rich_text[0]?.plain_text || '',
    category: (page.properties.Category as SelectPropertyItemObjectResponse)
      .select?.name || '',
    publishedDate: new Date(
      (page.properties.Published as DatePropertyItemObjectResponse).date?.start || ''
    ),
    status: ((page.properties.Status as SelectPropertyItemObjectResponse)
      .select?.name || '') as 'draft' | 'published',
  };
}
```

---

## 12. 성능 및 ISR 규칙

### 필수 ISR 설정
```typescript
// app/(blog)/page.tsx
export const revalidate = 3600; // 1시간마다 재검증

// app/(blog)/posts/[slug]/page.tsx
export const revalidate = 3600;
```

### 메타데이터 필수 구현
```typescript
// ✅ 필수
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await fetchPostBySlug(params.slug);
  return {
    title: post?.title || 'Not Found',
    description: post?.description,
  };
}
```

---

## 13. 테스트 및 배포 체크리스트

### 배포 전 확인사항
- [ ] TypeScript 컴파일 성공 (`npm run build`)
- [ ] ESLint 통과 (`npm run lint`)
- [ ] 모든 타입 오류 해결 (strict mode)
- [ ] 환경 변수 설정 (NOTION_API_KEY, NOTION_DATABASE_ID)
- [ ] Lighthouse Performance 점수 > 85
- [ ] WCAG 2.1 AA 접근성 확인
- [ ] 모바일/태블릿/데스크탑 반응형 테스트

### Vercel 배포
```bash
# 환경 변수 설정 (Vercel 대시보드에서)
NOTION_API_KEY = your_key
NOTION_DATABASE_ID = your_id

# 배포
npm run build
```

---

## 14. 참고 자료

- [Notion API 공식 문서](https://developers.notion.com)
- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [TypeScript strict mode](https://www.typescriptlang.org/tsconfig#strict)
- [Tailwind CSS 반응형](https://tailwindcss.com/docs/responsive-design)

---

**문서 작성일**: 2026-03-09
**버전**: 1.0

# 개인 개발 블로그 (Notion CMS)

Notion을 콘텐츠 관리 시스템(CMS)으로 활용하는 현대적인 개인 개발 블로그입니다.

## 🎯 프로젝트 개요

이 프로젝트는 Next.js 15와 Notion API를 활용하여 간단하면서도 강력한 개인 블로그를 구축합니다.

**주요 특징:**
- ✅ Notion에서 직관적으로 글 작성 및 관리
- ✅ Next.js ISR을 통한 자동 재생성
- ✅ 카테고리별 필터링 및 키워드 검색
- ✅ 모바일/태블릿/데스크탑 반응형 디자인
- ✅ SEO 최적화 (동적 메타데이터)

## 🛠️ 기술 스택

- **프레임워크**: [Next.js 15](https://nextjs.org) (App Router)
- **언어**: TypeScript
- **스타일링**: [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **CMS**: [Notion API](https://developers.notion.com)
- **상태관리**: [Zustand](https://github.com/pmndrs/zustand)
- **폼**: React Hook Form + Zod
- **배포**: [Vercel](https://vercel.com)

## 📋 요구사항

- Node.js 18+ 및 npm
- Notion 계정
- Notion API 키 및 데이터베이스 ID

## 🚀 시작하기

### 1. 저장소 클론 및 의존성 설치

```bash
git clone <repository-url>
cd notion-cms-project
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 정보를 추가합니다:

```env
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_database_id_here
```

**Notion API 키 발급:**
1. [Notion Integrations](https://www.notion.so/my-integrations) 방문
2. "새로운 통합 생성" 클릭
3. API 키 복사

**데이터베이스 ID 찾기:**
- Notion 데이터베이스 URL에서 ID 추출
- 예: `https://notion.so/{database_id}?v=...`

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 결과를 확인할 수 있습니다.

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 📚 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 시작 (hot reload) |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 프로덕션 서버 시작 |
| `npm run lint` | ESLint 실행 및 자동 수정 |

## 📁 프로젝트 구조

자세한 프로젝트 구조는 [CLAUDE.md](./CLAUDE.md)를 참고하세요.

**주요 디렉토리:**
- `app/` - Next.js App Router
- `components/` - React 컴포넌트 (UI, 레이아웃, 블로그 전용)
- `lib/` - 유틸리티, 타입, Notion API 클라이언트
- `hooks/` - 커스텀 React 훅
- `public/` - 정적 애셋
- `docs/` - 프로젝트 문서 (PRD 포함)

## 📖 Notion 데이터베이스 설정

블로그 포스트 데이터베이스의 스키마는 [docs/PRD.md](./docs/PRD.md#5-notion-데이터베이스-스키마)를 참고하세요.

**필수 필드:**
- Title (제목)
- Slug (URL 경로)
- Category (카테고리)
- Published (발행일)
- Status (발행됨/초안)

## 🌐 배포

### Vercel 배포 (권장)

1. [Vercel](https://vercel.com/new)에서 프로젝트 임포트
2. 환경 변수 설정 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`)
3. 배포 클릭

자세한 배포 가이드는 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 참고하세요.

## 📝 개발 가이드

- **컴포넌트 추가**: `components/` 디렉토리에 새 컴포넌트 생성
- **페이지 추가**: `app/(blog)/` 라우트 그룹에 새 페이지 생성
- **스타일링**: Tailwind CSS 클래스 사용
- **타입 안전성**: TypeScript strict 모드 준수

자세한 내용은 [CLAUDE.md](./CLAUDE.md)를 참고하세요.

## 📄 라이선스

MIT

## 🔗 관련 자료

- [프로젝트 요구사항 문서](./docs/PRD.md)
- [Next.js 문서](https://nextjs.org/docs)
- [Notion API 문서](https://developers.notion.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

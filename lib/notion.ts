/**
 * Notion API 클라이언트 및 데이터 페칭 함수
 *
 * 환경 변수:
 *   - NOTION_API_KEY: Notion Integration 토큰
 *   - NOTION_DATABASE_ID: 포트폴리오 데이터베이스 ID
 *
 * Notion 데이터베이스 스키마:
 *   - Name (Title): 프로젝트명
 *   - URL: 프로젝트 URL
 *   - 사용언어 (Rich Text): 기술 스택 (쉼표 구분)
 *   - 업무포지션 (Rich Text): 담당 역할 (쉼표 구분)
 *   - 투입기간 (Rich Text): 기간 문자열
 */

import { Post } from './types';

// 데이터베이스 ID는 환경 변수에서 로드
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const API_KEY = process.env.NOTION_API_KEY;

/**
 * Notion 필드 속성 타입
 */
interface NotionProperty {
  type: string;
  title?: Array<{ plain_text: string }>;
  rich_text?: Array<{ plain_text: string }>;
  url?: string;
  select?: { name: string };
  multi_select?: Array<{ name: string }>;
  date?: { start: string };
  files?: Array<{ type: string; external?: { url: string }; file?: { url: string } }>;
  id: string;
}


/**
 * 쉼표로 구분된 문자열을 배열로 파싱
 * 예: "React, TypeScript, Redux" → ["React", "TypeScript", "Redux"]
 */
function parseCommaSeparatedString(text: unknown): string[] {
  if (!text || typeof text !== 'string') return [];
  return text
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

/**
 * 투입기간 문자열 파싱
 * 예: "2021/03/09 → 2021/05/25" → { startDate: "2021/03/09", endDate: "2021/05/25" }
 * 예: "2023/12/09" → { startDate: "2023/12/09" }
 */
function parsePeriodString(periodStr: unknown): {
  startDate: string;
  endDate?: string;
} | null {
  if (!periodStr || typeof periodStr !== 'string') return null;

  const parts = periodStr.split('→').map(p => p.trim());

  if (parts.length === 2) {
    return {
      startDate: parts[0],
      endDate: parts[1]
    };
  } else if (parts.length === 1) {
    return {
      startDate: parts[0]
    };
  }

  return null;
}

/**
 * Notion 페이지 응답을 Post 타입으로 변환 (포트폴리오)
 * 기존 Database 스키마: 이름, URL, 사용언어, 업무포지션, 투입기간
 */
function transformNotionPageToPost(page: Record<string, unknown>): Post {
  const props = page.properties as Record<string, NotionProperty>;

  // 필드 이름이 데이터베이스와 다를 수 있으므로 동적 추출
  const titleField = props.이름 || props.Name || props.Title;
  const urlField = props.URL;
  const techField = props.사용언어;
  const roleField = props.업무포지션;
  const periodField = props.투입기간;
  const imageField = props.이미지 || props.Image;

  const title =
    (titleField?.type === 'title'
      ? titleField.title?.[0]?.plain_text
      : titleField?.type === 'rich_text'
        ? titleField.rich_text?.[0]?.plain_text
        : '') || '제목 없음';

  const url = (urlField?.type === 'url' ? urlField.url : '') || '';

  // 기술 스택: multi_select 또는 rich_text 타입 모두 지원
  let technologies: string[] = [];
  if (techField?.type === 'multi_select' && techField.multi_select) {
    technologies = techField.multi_select.map((item: { name: string }) => item.name);
  } else if (techField?.type === 'rich_text') {
    const technologiesStr = techField.rich_text?.[0]?.plain_text || '';
    technologies = parseCommaSeparatedString(technologiesStr);
  }

  // 역할: multi_select 또는 rich_text 타입 모두 지원
  let roles: string[] = [];
  if (roleField?.type === 'multi_select' && roleField.multi_select) {
    roles = roleField.multi_select.map((item: { name: string }) => item.name);
  } else if (roleField?.type === 'rich_text') {
    const rolesStr = roleField.rich_text?.[0]?.plain_text || '';
    roles = parseCommaSeparatedString(rolesStr);
  }

  const periodStr = periodField?.type === 'rich_text'
    ? periodField.rich_text?.[0]?.plain_text || ''
    : '';
  const periodParsed = parsePeriodString(periodStr);

  // 이미지 추출 (Files & media 필드 또는 커버)
  interface FileObject {
    type: string;
    external?: { url: string };
    file?: { url: string };
  }
  let imageUrl: string | undefined;

  // 1. 이미지 필드에서 추출 (Files & media 타입)
  if (imageField?.type === 'files' && imageField.files && imageField.files.length > 0) {
    const firstFile = imageField.files[0] as FileObject;
    if (firstFile.type === 'external' && firstFile.external?.url) {
      imageUrl = firstFile.external.url;
    } else if (firstFile.type === 'file' && firstFile.file?.url) {
      imageUrl = firstFile.file.url;
    }
  }

  // 2. 커버 이미지 (Notion 페이지 커버)
  if (!imageUrl) {
    const cover = page.cover as FileObject | null;
    if (cover?.type === 'external' && cover.external?.url) {
      imageUrl = cover.external.url;
    } else if (cover?.type === 'file' && cover.file?.url) {
      imageUrl = cover.file.url;
    }
  }

  // 3. 자동 생성 (이미지가 없으면)
  if (!imageUrl) {
    const encodedTitle = encodeURIComponent(title);
    imageUrl = `https://ui-avatars.com/api/?name=${encodedTitle}&background=random&size=400&bold=true&font-size=0.4`;
  }

  return {
    id: (page.id as string) || '',
    title,
    url,
    technologies: technologies.length > 0 ? technologies : [],
    roles: roles.length > 0 ? roles : [],
    period: periodStr,
    periodParsed: periodParsed || undefined,
    lastEditedAt: (page.last_edited_time as string) || '',
    slug: title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/^-|-$/g, ''),
    tags: [], // 포트폴리오는 태그 미지원
    description: '', // 포트폴리오는 설명 미지원
    imageUrl
  };
}

/**
 * 포트폴리오 프로젝트 목록 조회
 * Notion 데이터베이스에서 모든 포트폴리오 항목 조회
 * 투입기간(시작일) 기준 내림차순 정렬
 *
 * @returns 포트폴리오 프로젝트 목록
 * @throws {Error} API 호출 실패 시 에러 메시지와 함께 던짐
 */
export async function fetchPublishedPosts(): Promise<Post[]> {
  try {
    // 환경 변수 검증
    if (!DATABASE_ID) {
      throw new Error('NOTION_DATABASE_ID 환경 변수가 설정되지 않았습니다');
    }

    if (!API_KEY) {
      throw new Error('NOTION_API_KEY 환경 변수가 설정되지 않았습니다');
    }

    // Notion API REST 직접 호출
    const response = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sorts: [
            {
              property: '투입기간',
              direction: 'descending'
            }
          ],
          page_size: 100
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Notion API 요청 실패: ${response.status} ${response.statusText} - ${
          (errorData as Record<string, unknown>).message || ''
        }`
      );
    }

    interface QueryResponse {
      results: unknown[];
      next_cursor?: string;
      has_more?: boolean;
    }

    const data = (await response.json()) as QueryResponse;

    // Notion 응답을 Post 배열로 변환
    const posts: Post[] = data.results.map(page =>
      transformNotionPageToPost(page as Record<string, unknown>)
    );

    return posts;
  } catch (error) {
    // 에러 처리 및 로깅
    const errorMessage =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';

    console.error('fetchPublishedPosts 오류:', errorMessage);
    throw new Error(`포트폴리오 조회 실패: ${errorMessage}`);
  }
}

/**
 * slug로 특정 포트폴리오 프로젝트 조회
 * @param slug - URL 경로용 슬러그 (예: "my-project")
 * @returns 해당 slug인 프로젝트, 없으면 null
 * @throws {Error} API 호출 실패 시 에러 메시지와 함께 던짐
 */
export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  try {
    // 환경 변수 검증
    if (!DATABASE_ID) {
      throw new Error('NOTION_DATABASE_ID 환경 변수가 설정되지 않았습니다');
    }

    if (!API_KEY) {
      throw new Error('NOTION_API_KEY 환경 변수가 설정되지 않았습니다');
    }

    // 모든 포트폴리오 조회 후 slug로 필터링 (Notion은 자동 생성 필드로 필터링 불가)
    const allPosts = await fetchPublishedPosts();
    const post = allPosts.find(p => p.slug === slug);

    return post || null;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';

    console.error(`fetchPostBySlug('${slug}') 오류:`, errorMessage);
    throw new Error(`프로젝트 조회 실패 (slug: ${slug}): ${errorMessage}`);
  }
}

/**
 * Notion 페이지의 블록(본문) 조회
 * @param pageId - Notion 페이지 ID
 * @returns 페이지의 블록 배열
 * @throws {Error} API 호출 실패 시 에러 메시지와 함께 던짐
 */
export async function fetchPageBlocks(pageId: string): Promise<unknown[]> {
  try {
    // Notion API REST 직접 호출
    const response = await fetch(
      `https://api.notion.com/v1/blocks/${pageId}/children`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Notion API 요청 실패: ${response.status} ${response.statusText}`);
    }

    interface BlocksResponse {
      results: unknown[];
    }

    const data = (await response.json()) as BlocksResponse;

    return data.results;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';

    console.error(`fetchPageBlocks('${pageId}') 오류:`, errorMessage);
    throw new Error(`블록 조회 실패 (pageId: ${pageId}): ${errorMessage}`);
  }
}

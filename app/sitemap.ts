/**
 * 동적 Sitemap 생성
 * Notion API에서 조회한 posts를 기반으로 sitemap.xml 자동 생성
 * ISR과 함께 작동하여 새 글 발행 시 자동 갱신
 */

import type { MetadataRoute } from 'next';
import { SITE_CONFIG, REVALIDATE_SECONDS } from '@/lib/constants';
import { fetchPublishedPosts } from '@/lib/notion';

/**
 * ISR: 3600초(1시간) 주기로 Sitemap 재검증
 * 새 글 발행 시 자동으로 sitemap 업데이트됨
 */
export const revalidate = REVALIDATE_SECONDS;

/**
 * 동적 Sitemap 생성
 * @returns MetadataRoute.Sitemap - sitemap.xml 형식의 URL 배열
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 기본 페이지 URL들 (모든 사용자가 접근 가능)
  const baseUrls: MetadataRoute.Sitemap = [
    {
      url: SITE_CONFIG.url,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_CONFIG.url}/blog`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Notion API에서 발행된 posts 조회
  let postUrls: MetadataRoute.Sitemap = [];

  try {
    const posts = await fetchPublishedPosts();

    postUrls = posts.map((post) => ({
      url: `${SITE_CONFIG.url}/posts/${post.slug}`,
      lastModified: post.lastEditedAt || new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    console.log(`Sitemap 생성: ${baseUrls.length + postUrls.length}개 URL`);
  } catch (error) {
    // API 호출 실패 시 기본 URL만 반환 (빌드 실패 방지)
    const errorMessage =
      error instanceof Error ? error.message : '알 수 없는 오류';
    console.error('Sitemap posts 조회 실패:', errorMessage);
    console.log('기본 URL만으로 Sitemap 생성됨');
  }

  // 기본 URL + posts URL 병합
  return [...baseUrls, ...postUrls];
}

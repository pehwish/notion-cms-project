/**
 * 블로그 글 목록 컴포넌트
 * 반응형 그리드로 PostCard를 배열하여 표시
 * PRD F-05: 모바일 1열 / 태블릿 2열 / 데스크탑 3열
 */

import { PostCard } from "./post-card";
import type { Post } from "@/lib/types";

interface PostListProps {
  posts: Post[];
}

/**
 * 블로그 글 목록을 반응형 그리드로 렌더링
 * 글이 없을 경우 빈 상태 메시지를 표시
 */
export function PostList({ posts }: PostListProps) {
  /* 글이 없을 때 빈 상태 표시 */
  if (posts.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground py-10">
        표시할 글이 없습니다.
      </p>
    );
  }

  return (
    /* 반응형 그리드: 모바일 1열 → 태블릿(sm) 2열 → 데스크탑(lg) 3열 */
    <ul
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="블로그 글 목록"
    >
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Notion 블록 타입 정의 및 변환 로직
 *
 * Notion 페이지의 모든 블록 타입을 HTML로 변환
 * Phase 3에서 완전 구현됨
 *
 * 참고: Notion API 블록 문서 https://developers.notion.com/reference/block
 * lib/notion.ts의 fetchPageBlocks() 함수와 함께 사용
 */

/**
 * Notion 블록 기본 구조 (재귀 타입)
 * 모든 Notion 블록이 가져야 할 기본 속성
 */
export interface NotionBlock {
  id: string;
  type: string;
  has_children: boolean;
  /** 재귀: 자식 블록 처리 (예: toggle, bulleted_list_item의 children) */
  children?: NotionBlock[];
  [key: string]: unknown;
}

/**
 * Rich Text (텍스트 서식) 처리
 * Notion의 모든 텍스트 필드는 RichText 배열로 구성됨
 * bold, italic, underline, strikethrough, code 등의 서식 지원
 */
export interface NotionRichText {
  type: "text" | "mention" | "equation";
  text?: {
    content: string;
    link?: {
      url: string;
    };
  };
  mention?: {
    type: string;
    user?: { id: string };
    database?: { id: string };
    page?: { id: string };
    date?: { start: string; end?: string };
  };
  equation?: {
    expression: string;
  };
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    /** "default", "gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red" 등 */
    color?: string;
  };
  plain_text?: string;
  href?: string;
}

/**
 * 단락(Paragraph) 블록
 * 일반 텍스트를 포함하는 가장 기본적인 블록 타입
 * HTML: <p>...</p>로 변환
 */
export interface ParagraphBlock extends NotionBlock {
  type: "paragraph";
  paragraph: {
    rich_text: NotionRichText[];
    color?: string;
  };
}

/**
 * 제목 블록 (3가지 레벨)
 * heading_1: HTML <h1>
 * heading_2: HTML <h2>
 * heading_3: HTML <h3>
 */
export interface HeadingBlock extends NotionBlock {
  type: "heading_1" | "heading_2" | "heading_3";
  heading_1?: { rich_text: NotionRichText[]; color?: string };
  heading_2?: { rich_text: NotionRichText[]; color?: string };
  heading_3?: { rich_text: NotionRichText[]; color?: string };
}

/**
 * 불릿 리스트 항목 블록
 * HTML: <ul><li>...</li></ul>로 변환
 * children을 가질 수 있으므로 재귀적으로 처리 필요
 */
export interface BulletedListItemBlock extends NotionBlock {
  type: "bulleted_list_item";
  bulleted_list_item: {
    rich_text: NotionRichText[];
    color?: string;
  };
}

/**
 * 번호 리스트 항목 블록
 * HTML: <ol><li>...</li></ol>로 변환
 * children을 가질 수 있으므로 재귀적으로 처리 필요
 */
export interface NumberedListItemBlock extends NotionBlock {
  type: "numbered_list_item";
  numbered_list_item: {
    rich_text: NotionRichText[];
    color?: string;
  };
}

/**
 * 코드 블록
 * HTML: <pre><code>...</code></pre>로 변환
 * language: 프로그래밍 언어 (javascript, typescript, python, java 등)
 */
export interface CodeBlock extends NotionBlock {
  type: "code";
  code: {
    rich_text: NotionRichText[];
    language?: string;
    caption?: NotionRichText[];
  };
}

/**
 * 이미지 블록
 * HTML: <img> 또는 <figure><img><figcaption></figcaption></figure>로 변환
 * 내부 이미지 또는 외부 URL 모두 지원
 */
export interface ImageBlock extends NotionBlock {
  type: "image";
  image: {
    type: "file" | "external";
    file?: {
      url: string;
      expiry_time?: string;
    };
    external?: {
      url: string;
    };
    caption?: NotionRichText[];
  };
}

/**
 * 구분선(Divider) 블록
 * HTML: <hr>로 변환
 */
export interface DividerBlock extends NotionBlock {
  type: "divider";
  divider: Record<string, never>;
}

/**
 * 인용구(Quote) 블록
 * HTML: <blockquote>...</blockquote>로 변환
 */
export interface QuoteBlock extends NotionBlock {
  type: "quote";
  quote: {
    rich_text: NotionRichText[];
    color?: string;
  };
}

/**
 * 토글(Toggle List) 블록
 * HTML: <details><summary>...</summary>...</details>로 변환
 * children을 가지고 있으므로 재귀적으로 처리 필요
 */
export interface ToggleBlock extends NotionBlock {
  type: "toggle";
  toggle: {
    rich_text: NotionRichText[];
    color?: string;
  };
}

/**
 * 구분된 블록 타입 Union
 */
export type SupportedNotionBlock =
  | ParagraphBlock
  | HeadingBlock
  | BulletedListItemBlock
  | NumberedListItemBlock
  | CodeBlock
  | ImageBlock
  | DividerBlock
  | QuoteBlock
  | ToggleBlock;

// =============================================================================
// 재귀 깊이 제한 상수
// =============================================================================

/** 블록 재귀 처리 최대 깊이 (무한 루프 방지) */
const MAX_DEPTH = 10;

// =============================================================================
// Rich Text 변환
// =============================================================================

/**
 * URL의 안전성 검증 (XSS 방지)
 * http 또는 https 프로토콜만 허용
 *
 * @param url - 검증할 URL 문자열
 * @returns 안전한 URL이면 true, 아니면 false
 */
function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * HTML 특수문자 이스케이프 (XSS 방지)
 *
 * @param text - 이스케이프할 텍스트
 * @returns 이스케이프된 텍스트
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Notion color 값을 CSS color 값으로 변환
 *
 * @param color - Notion color 문자열
 * @returns CSS 인라인 스타일 문자열 또는 빈 문자열
 */
function getColorStyle(color: string): string {
  const colorMap: Record<string, string> = {
    gray: "#9b9b9b",
    brown: "#8b5e3c",
    orange: "#e67e22",
    yellow: "#f1c40f",
    green: "#2ecc71",
    blue: "#3498db",
    purple: "#9b59b6",
    pink: "#e91e63",
    red: "#e74c3c",
  };

  // "_background" 접미사가 있으면 배경색 처리는 생략하고 기본 반환
  if (color.endsWith("_background")) return "";
  if (color === "default") return "";

  const cssColor = colorMap[color];
  return cssColor ? `style="color: ${cssColor}"` : "";
}

/**
 * Notion Rich Text 배열을 HTML 문자열로 변환
 * bold, italic, strikethrough, underline, code 서식 적용
 * 링크(text.link) 처리 및 URL 검증
 * color 속성 적용 (인라인 스타일)
 * mention, equation 기본 처리 (plain_text 사용)
 *
 * @param richTexts - Notion Rich Text 배열
 * @returns HTML 문자열 (서식이 적용된 텍스트)
 */
export function convertRichText(richTexts: NotionRichText[]): string {
  return richTexts
    .map((rt) => {
      // mention 타입은 plain_text로 처리
      if (rt.type === "mention") {
        return escapeHtml(rt.plain_text ?? "");
      }

      // equation 타입은 <code>로 처리
      if (rt.type === "equation") {
        const expr = escapeHtml(rt.equation?.expression ?? "");
        return `<code>${expr}</code>`;
      }

      // text 타입 처리
      let html = escapeHtml(rt.text?.content ?? rt.plain_text ?? "");

      // 서식 적용 (중첩 순서: bold → italic → strikethrough → underline → code)
      if (rt.annotations?.code) html = `<code>${html}</code>`;
      if (rt.annotations?.bold) html = `<strong>${html}</strong>`;
      if (rt.annotations?.italic) html = `<em>${html}</em>`;
      if (rt.annotations?.strikethrough) html = `<del>${html}</del>`;
      if (rt.annotations?.underline) html = `<u>${html}</u>`;

      // 컬러 적용
      const color = rt.annotations?.color ?? "";
      if (color && color !== "default") {
        const colorStyle = getColorStyle(color);
        if (colorStyle) {
          html = `<span ${colorStyle}>${html}</span>`;
        }
      }

      // 링크 처리 (http/https URL 검증 후 적용)
      const linkUrl = rt.text?.link?.url ?? rt.href;
      if (linkUrl && isSafeUrl(linkUrl)) {
        const safeUrl = escapeHtml(linkUrl);
        html = `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${html}</a>`;
      }

      return html;
    })
    .join("");
}

// =============================================================================
// 개별 블록 변환 함수
// =============================================================================

/**
 * Paragraph 블록을 HTML <p> 태그로 변환
 *
 * @param block - ParagraphBlock
 * @returns HTML <p>...</p> 문자열
 */
function convertParagraphToHtml(block: ParagraphBlock): string {
  const html = convertRichText(block.paragraph.rich_text);
  // 빈 단락은 줄바꿈 역할의 <br> 포함 <p> 태그 반환
  return html ? `<p>${html}</p>` : "<p><br></p>";
}

/**
 * Heading 블록을 HTML h1~h3 태그로 변환
 *
 * @param block - HeadingBlock
 * @returns HTML 헤딩 태그 문자열
 */
function convertHeadingToHtml(block: HeadingBlock): string {
  const level = block.type === "heading_1" ? 1 : block.type === "heading_2" ? 2 : 3;
  const key = `heading_${level}` as "heading_1" | "heading_2" | "heading_3";
  const heading = block[key];

  if (!heading) return "";

  const html = convertRichText(heading.rich_text);
  return `<h${level}>${html}</h${level}>`;
}

/**
 * 자식 블록 배열을 HTML 문자열로 렌더링
 * 연속된 bulleted_list_item은 하나의 <ul>로, numbered_list_item은 하나의 <ol>로 병합
 * 나머지 블록은 convertBlockToHtml로 위임
 *
 * @param children - 자식 NotionBlock 배열
 * @param depth - 현재 중첩 깊이
 * @returns HTML 문자열
 */
function renderChildBlocks(children: NotionBlock[], depth: number): string {
  if (depth > MAX_DEPTH) return "";

  let result = "";
  let i = 0;

  while (i < children.length) {
    const child = children[i];

    if (child.type === "bulleted_list_item") {
      // 연속된 불릿 리스트 항목을 하나의 <ul>로 병합
      result += "<ul>";
      while (i < children.length && children[i].type === "bulleted_list_item") {
        result += convertBulletedListItemToHtml(
          children[i] as BulletedListItemBlock,
          depth
        );
        i++;
      }
      result += "</ul>";
    } else if (child.type === "numbered_list_item") {
      // 연속된 번호 리스트 항목을 하나의 <ol>로 병합
      result += "<ol>";
      while (
        i < children.length &&
        children[i].type === "numbered_list_item"
      ) {
        result += convertNumberedListItemToHtml(
          children[i] as NumberedListItemBlock,
          depth
        );
        i++;
      }
      result += "</ol>";
    } else {
      // 리스트 항목이 아닌 자식 블록은 일반 변환
      result += convertBlockToHtml(child, depth);
      i++;
    }
  }

  return result;
}

/**
 * 불릿 리스트 항목 블록들을 HTML <ul><li>...</li></ul>로 변환
 * 자식 블록이 있는 경우 재귀 처리
 *
 * @param block - BulletedListItemBlock
 * @param depth - 중첩 깊이 (무한 중첩 방지)
 * @returns HTML <li>...</li> 문자열 (ul 래핑 없음 - convertBlockToHtml에서 처리)
 */
function convertBulletedListItemToHtml(
  block: BulletedListItemBlock,
  depth: number
): string {
  const content = convertRichText(block.bulleted_list_item.rich_text);
  let html = `<li>${content}`;

  // 자식 블록 재귀 처리 (헬퍼로 연속 리스트 병합 및 중첩 ul 오염 방지)
  if (block.children && block.children.length > 0) {
    html += renderChildBlocks(block.children, depth + 1);
  }

  html += "</li>";
  return html;
}

/**
 * 번호 리스트 항목 블록들을 HTML <ol><li>...</li></ol>로 변환
 * 자식 블록이 있는 경우 재귀 처리
 *
 * @param block - NumberedListItemBlock
 * @param depth - 중첩 깊이 (무한 중첩 방지)
 * @returns HTML <li>...</li> 문자열 (ol 래핑 없음 - convertBlockToHtml에서 처리)
 */
function convertNumberedListItemToHtml(
  block: NumberedListItemBlock,
  depth: number
): string {
  const content = convertRichText(block.numbered_list_item.rich_text);
  let html = `<li>${content}`;

  // 자식 블록 재귀 처리 (헬퍼로 연속 리스트 병합 및 중첩 ol 오염 방지)
  if (block.children && block.children.length > 0) {
    html += renderChildBlocks(block.children, depth + 1);
  }

  html += "</li>";
  return html;
}

/**
 * 코드 블록을 HTML <pre><code>...</code></pre>로 변환
 *
 * @param block - CodeBlock
 * @returns HTML <pre><code>...</code></pre> 문자열
 */
function convertCodeToHtml(block: CodeBlock): string {
  // 코드 내용은 escapeHtml이 convertRichText 내부에서 처리됨
  const code = convertRichText(block.code.rich_text);
  const lang = block.code.language ?? "";
  const classAttr = lang ? ` class="language-${escapeHtml(lang)}"` : "";
  return `<pre><code${classAttr}>${code}</code></pre>`;
}

/**
 * 이미지 블록을 HTML <figure> 또는 <img> 태그로 변환
 * 캡션이 있을 경우 <figure><img><figcaption>...</figcaption></figure> 형태
 *
 * @param block - ImageBlock
 * @returns HTML 이미지 태그 문자열
 */
function convertImageToHtml(block: ImageBlock): string {
  const imageUrl =
    block.image.type === "external"
      ? block.image.external?.url
      : block.image.file?.url;

  // URL이 없거나 안전하지 않으면 빈 문자열 반환
  if (!imageUrl || !isSafeUrl(imageUrl)) return "";

  const safeUrl = escapeHtml(imageUrl);
  const caption = block.image.caption
    ? convertRichText(block.image.caption)
    : "";

  if (caption) {
    return `<figure><img src="${safeUrl}" alt="${escapeHtml(caption.replace(/<[^>]*>/g, ""))}" /><figcaption>${caption}</figcaption></figure>`;
  }

  return `<img src="${safeUrl}" alt="" />`;
}

/**
 * 구분선(Divider) 블록을 HTML <hr> 태그로 변환
 *
 * @returns HTML <hr /> 문자열
 */
function convertDividerToHtml(): string {
  return "<hr />";
}

/**
 * 인용구(Quote) 블록을 HTML <blockquote> 태그로 변환
 *
 * @param block - QuoteBlock
 * @returns HTML <blockquote>...</blockquote> 문자열
 */
function convertQuoteToHtml(block: QuoteBlock): string {
  const html = convertRichText(block.quote.rich_text);
  return html ? `<blockquote>${html}</blockquote>` : "<blockquote></blockquote>";
}

/**
 * 토글(Toggle) 블록을 HTML <details><summary>...</summary>...</details>로 변환
 * 자식 블록이 있는 경우 재귀 처리
 *
 * @param block - ToggleBlock
 * @param depth - 중첩 깊이 (무한 중첩 방지)
 * @returns HTML <details>...</details> 문자열
 */
function convertToggleToHtml(block: ToggleBlock, depth: number): string {
  const summary = convertRichText(block.toggle.rich_text);
  let html = `<details><summary>${summary}</summary>`;

  // 자식 블록 재귀 처리 (renderChildBlocks로 리스트 항목 병합 처리 포함)
  if (block.children && block.children.length > 0) {
    html += renderChildBlocks(block.children, depth + 1);
  }

  html += "</details>";
  return html;
}

// =============================================================================
// 메인 변환 함수
// =============================================================================

/**
 * 모든 Notion 블록 타입을 처리하는 메인 변환 함수
 * 블록 타입별로 적절한 변환 함수를 호출
 * 재귀 깊이를 추적하여 무한 루프를 방지
 *
 * @param block - 변환할 NotionBlock
 * @param depth - 중첩 깊이 (기본값: 0)
 * @returns HTML 문자열
 */
export function convertBlockToHtml(
  block: NotionBlock,
  depth: number = 0
): string {
  // 재귀 깊이 초과 시 빈 문자열 반환 (무한 루프 방지)
  if (depth > MAX_DEPTH) return "";

  switch (block.type) {
    case "paragraph":
      return convertParagraphToHtml(block as ParagraphBlock);

    case "heading_1":
    case "heading_2":
    case "heading_3":
      return convertHeadingToHtml(block as HeadingBlock);

    case "bulleted_list_item":
      // ul 래핑은 blocksToHtml에서 연속 항목을 묶어서 처리
      return `<ul>${convertBulletedListItemToHtml(block as BulletedListItemBlock, depth)}</ul>`;

    case "numbered_list_item":
      // ol 래핑은 blocksToHtml에서 연속 항목을 묶어서 처리
      return `<ol>${convertNumberedListItemToHtml(block as NumberedListItemBlock, depth)}</ol>`;

    case "code":
      return convertCodeToHtml(block as CodeBlock);

    case "image":
      return convertImageToHtml(block as ImageBlock);

    case "divider":
      return convertDividerToHtml();

    case "quote":
      return convertQuoteToHtml(block as QuoteBlock);

    case "toggle":
      return convertToggleToHtml(block as ToggleBlock, depth);

    default:
      // 지원하지 않는 블록 타입은 빈 문자열 반환
      return "";
  }
}

/**
 * 블록 배열 전체를 HTML로 변환
 * 연속된 bulleted_list_item들을 하나의 <ul>로, numbered_list_item들을 하나의 <ol>로 병합
 *
 * @param blocks - Notion 블록 배열 (fetchPageBlocks의 반환값)
 * @returns 전체 블록의 HTML 문자열
 */
export function blocksToHtml(blocks: NotionBlock[]): string {
  let html = "";
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    // 연속된 bulleted_list_item들을 하나의 <ul>로 병합
    if (block.type === "bulleted_list_item") {
      html += "<ul>";
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        html += convertBulletedListItemToHtml(
          blocks[i] as BulletedListItemBlock,
          0
        );
        i++;
      }
      html += "</ul>";
      continue;
    }

    // 연속된 numbered_list_item들을 하나의 <ol>로 병합
    if (block.type === "numbered_list_item") {
      html += "<ol>";
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        html += convertNumberedListItemToHtml(
          blocks[i] as NumberedListItemBlock,
          0
        );
        i++;
      }
      html += "</ol>";
      continue;
    }

    // 그 외 블록은 개별 변환
    html += convertBlockToHtml(block, 0);
    i++;
  }

  return html;
}

// =============================================================================
// 타입 가드 헬퍼 함수
// =============================================================================

/** 블록이 ParagraphBlock인지 확인 */
export function isParagraphBlock(block: NotionBlock): block is ParagraphBlock {
  return block.type === "paragraph";
}

/** 블록이 HeadingBlock인지 확인 */
export function isHeadingBlock(block: NotionBlock): block is HeadingBlock {
  return (
    block.type === "heading_1" ||
    block.type === "heading_2" ||
    block.type === "heading_3"
  );
}

/** 블록이 BulletedListItemBlock인지 확인 */
export function isBulletedListItemBlock(
  block: NotionBlock
): block is BulletedListItemBlock {
  return block.type === "bulleted_list_item";
}

/** 블록이 NumberedListItemBlock인지 확인 */
export function isNumberedListItemBlock(
  block: NotionBlock
): block is NumberedListItemBlock {
  return block.type === "numbered_list_item";
}

/** 블록이 CodeBlock인지 확인 */
export function isCodeBlock(block: NotionBlock): block is CodeBlock {
  return block.type === "code";
}

/** 블록이 ImageBlock인지 확인 */
export function isImageBlock(block: NotionBlock): block is ImageBlock {
  return block.type === "image";
}

/** 블록이 DividerBlock인지 확인 */
export function isDividerBlock(block: NotionBlock): block is DividerBlock {
  return block.type === "divider";
}

/** 블록이 QuoteBlock인지 확인 */
export function isQuoteBlock(block: NotionBlock): block is QuoteBlock {
  return block.type === "quote";
}

/** 블록이 ToggleBlock인지 확인 */
export function isToggleBlock(block: NotionBlock): block is ToggleBlock {
  return block.type === "toggle";
}

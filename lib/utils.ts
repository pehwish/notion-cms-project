import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷합니다.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * 경력 시작 연도로부터 현재까지의 경력 연수를 계산합니다.
 * @param startYear 경력 시작 연도 (예: 2015)
 * @returns 포맷된 경력 문자열 (예: "9년 6개월+", "10년+")
 */
export function calculateCareerYears(startYear: number): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth()는 0부터 시작

  const years = currentYear - startYear;
  const months = currentMonth;

  if (months >= 6) {
    return `${years}년 6개월+`;
  }
  return `${years}년+`;
}

/**
 * 한글 역할명을 영문으로 번역합니다.
 * @param role 한글 역할명
 * @returns 영문 역할명
 */
export function translateRoleToEnglish(role: string): string {
  const roleTranslations: Record<string, string> = {
    '프론트엔드': 'Frontend',
    '백엔드': 'Backend',
    '풀스택': 'Full Stack',
    '리드': 'Lead',
    '주임': 'Senior',
    '대리': 'Associate',
    '과장': 'Manager',
    '팀장': 'Team Lead'
  };

  return roleTranslations[role] || role;
}

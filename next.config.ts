import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Notion 파일 저장소 및 외부 이미지 허용 도메인 목록
    remotePatterns: [
      {
        // Notion 첨부파일 CDN (S3 us-west-2)
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      {
        // Notion 기타 AWS S3 버킷
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        // 아바타 이미지 생성 서비스
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        // Notion 공개 이미지 (notion.so 도메인)
        protocol: "https",
        hostname: "www.notion.so",
      },
      {
        // Notion 이미지 CDN (images.unsplash.com 등 외부 이미지를 Notion에서 embed한 경우)
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // 이미지 최적화: WebP 및 AVIF 형식 우선 제공 (파일 크기 절감)
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

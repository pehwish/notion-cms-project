import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Noto_Sans_KR } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { QueryProvider } from "@/components/common/QueryProvider";
import { CustomCursor } from "@/components/common/custom-cursor";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  // FOIT(Flash of Invisible Text) 방지: 폰트 로딩 중 시스템 폰트로 fallback
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  // 코드 블록용 모노스페이스 폰트도 동일하게 swap 적용
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} ${notoSansKR.variable} antialiased cursor-none`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <TooltipProvider>
              <CustomCursor />
              {children}
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

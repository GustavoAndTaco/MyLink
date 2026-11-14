import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevLink | Spotify Edition",
  description: "Spotify 디자인 시스템 감성으로 빚어낸 개발자 프로필 및 포트폴리오 링크트리",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full bg-[#121212] text-white antialiased">
      <body className="min-h-full flex flex-col bg-[#121212] text-white">{children}</body>
    </html>
  );
}

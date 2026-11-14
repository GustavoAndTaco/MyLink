import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dev Link | 개발자 프로필",
  description: "코드와 기술로 가치를 짓는 개발자 소개 및 링크 페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

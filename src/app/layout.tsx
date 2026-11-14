import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyLink",
  description: "나만의 링크 관리 서비스",
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

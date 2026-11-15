import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { AppToastProvider } from "@/components/ui/toast";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "MyLink | 개발자 특화 링크트리",
  description: "Spotify 디자인 시스템 감성으로 빚어낸 개발자 프로필 및 포트폴리오 링크트리",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={cn(
        "h-full bg-spotify-black text-white antialiased",
        "font-sans",
        geist.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-spotify-black text-white">
        <AppToastProvider>{children}</AppToastProvider>
      </body>
    </html>
  );
}

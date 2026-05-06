import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HDwal - 高清壁纸",
  description: "精选高清壁纸，免费下载，持续更新。提供 4K、2K 超清桌面壁纸、手机壁纸，涵盖自然风光、城市建筑、动漫二次元等多种风格。",
  keywords: ["高清壁纸", "4K壁纸", "桌面壁纸", "手机壁纸", "免费壁纸", "壁纸下载", "HD wallpaper"],
  alternates: {
    canonical: "https://hdwal.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}

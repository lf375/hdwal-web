import type { Metadata } from "next";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`https://read.hdwal.com/${id}`);
    if (!res.ok) return { title: "壁纸未找到 - HDwal" };
    const data = await res.json();
    const wp = data.data;

    return {
      title: `${wp.title} - HDwal 高清壁纸`,
      description: wp.prompt
        ? `AI 生成壁纸：${wp.title}。${wp.prompt}`
        : `下载高清壁纸：${wp.title}，免费商用`,
      openGraph: {
        title: `${wp.title} - HDwal`,
        description: wp.prompt || `高清壁纸：${wp.title}`,
        images: wp.url ? [{ url: wp.url, width: wp.width, height: wp.height }] : [],
        type: "website",
      },
    };
  } catch {
    return {
      title: "壁纸详情 - HDwal 高清壁纸",
    };
  }
}

export default function WallpaperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

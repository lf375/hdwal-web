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
      keywords: wp.tags ? [...wp.tags, "高清壁纸", "壁纸下载"] : ["高清壁纸", "壁纸下载"],
      alternates: {
        canonical: `https://hdwal.com/wallpaper/${id}`,
      },
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

export default async function WallpaperLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let jsonLd = null;
  try {
    const res = await fetch(`https://read.hdwal.com/${id}`);
    if (res.ok) {
      const data = await res.json();
      const wp = data.data;
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        name: wp.title,
        contentUrl: wp.url,
        thumbnailUrl: wp.thumbnail_url || wp.url,
        width: wp.width,
        height: wp.height,
        description: wp.prompt || wp.title,
        datePublished: wp.created_at,
      };
    }
  } catch {}

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}

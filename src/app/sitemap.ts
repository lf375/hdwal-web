import type { MetadataRoute } from "next";

const API_BASE = "https://read.hdwal.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://hdwal.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://hdwal.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const res = await fetch(`${API_BASE}/?limit=100`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    const wallpapers = data.data?.list || [];

    const wallpaperPages: MetadataRoute.Sitemap = wallpapers.map(
      (wp: { id: number; created_at: string }) => ({
        url: `https://hdwal.com/wallpaper/${wp.id}`,
        lastModified: new Date(wp.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })
    );

    return [...staticPages, ...wallpaperPages];
  } catch {
    return staticPages;
  }
}

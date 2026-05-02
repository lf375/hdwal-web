import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const API_BASE = "https://read.hdwal.com";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getApiUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(path, API_BASE);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

export function formatCount(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

export function stringToTags(str: string): string[] {
  if (!str || !str.trim()) return [];
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {}
  return str.split(",").map((t) => t.trim()).filter(Boolean);
}

export const TAGS = [
  "风景",
  "自然",
  "山脉",
  "海洋",
  "城市",
  "建筑",
  "动漫",
  "科幻",
  "奇幻",
  "夜景",
  "动物",
  "花卉",
  "抽象",
  "极简",
  "其他",
] as const;

export function getDisplayUrl(wallpaper: { url: string; thumbnail_url: string | null }): string {
  return wallpaper.thumbnail_url || wallpaper.url;
}

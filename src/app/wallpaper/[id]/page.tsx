"use client";

export const runtime = "edge";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IPhoneFrame from "@/components/iPhoneFrame";
import WallpaperCard from "@/components/WallpaperCard";
import { Download, ArrowLeft, Tag, X, Maximize2 } from "lucide-react";
import { stringToTags, formatDate, formatCount, formatFileSize, cn, getApiUrl, getDisplayUrl } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { Wallpaper, ApiResponse } from "@/lib/types";

export default function WallpaperDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarWallpapers, setSimilarWallpapers] = useState<Wallpaper[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    fetch(getApiUrl(`/${id}`))
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const wp = data.data || data.wallpaper || null;
        setWallpaper(wp);
        setLoading(false);

        if (wp) {
          fetch(getApiUrl("/", { limit: "12", page: "1" }))
            .then((r) => r.json())
            .then((data: ApiResponse) => {
              if (cancelled) return;
              const similar = (data.data?.list || [])
                .filter((w: Wallpaper) => String(w.id) !== String(id))
                .slice(0, 8);
              setSimilarWallpapers(similar);
            })
            .catch(() => { if (!cancelled) setSimilarWallpapers([]); });
        }
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const handleDownload = async () => {
    if (!wallpaper) return;
    try {
      window.open(wallpaper.url, "_blank");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="h-4 w-20 rounded animate-shimmer mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <div className="aspect-video rounded-2xl animate-shimmer" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-surface border border-border/60 rounded-2xl p-6 h-24 animate-shimmer" />
              <div className="bg-surface rounded-2xl p-6 border border-border/60 space-y-4">
                <div className="h-7 w-3/4 rounded animate-shimmer" />
                <div className="h-4 w-1/3 rounded animate-shimmer" />
                <div className="h-11 w-full rounded-xl animate-shimmer" />
                <div className="flex gap-4">
                  <div className="h-4 w-20 rounded animate-shimmer" />
                  <div className="h-4 w-16 rounded animate-shimmer" />
                </div>
                <div className="pt-4 space-y-2">
                  <div className="h-3 w-10 rounded animate-shimmer" />
                  <div className="flex gap-2">
                    <div className="h-6 w-14 rounded-full animate-shimmer" />
                    <div className="h-6 w-14 rounded-full animate-shimmer" />
                    <div className="h-6 w-14 rounded-full animate-shimmer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!wallpaper) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto text-center">
          <p className="text-text-secondary">壁纸未找到</p>
          <Link href="/" className="text-accent mt-4 inline-block">
            返回首页
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const tags = stringToTags(wallpaper.tags);
  const displayUrl = getDisplayUrl(wallpaper);
  const isPortrait = wallpaper.height > wallpaper.width && wallpaper.width > 0;

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              {isPortrait ? (
                <IPhoneFrame onClick={() => setShowPreview(true)}>
                  <div className="relative w-full h-full cursor-zoom-in group">
                    {displayUrl ? (
                      <Image
                        src={displayUrl}
                        alt={wallpaper.title}
                        fill
                        sizes="320px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 animate-shimmer" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-sm p-3 rounded-full">
                        <Maximize2 className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </IPhoneFrame>
              ) : (
                <div
                  className="relative overflow-hidden rounded-2xl bg-muted cursor-zoom-in group aspect-video"
                  onClick={() => setShowPreview(true)}
                >
                  {displayUrl ? (
                    <Image
                      src={displayUrl}
                      alt={wallpaper.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 animate-shimmer" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-sm p-3 rounded-full">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-surface border border-border/60 rounded-2xl p-6 mb-6 text-center">
                <p className="text-sm text-text-tertiary">[广告位]</p>
              </div>
              <div className="bg-surface rounded-2xl p-6 border border-border/60">
                <h1 className="font-heading text-2xl font-bold">
                  {wallpaper.title}
                </h1>
                <p className="text-sm text-text-tertiary mt-1">
                  {formatDate(wallpaper.created_at)}
                </p>

                <button
                  onClick={handleDownload}
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-dark transition-colors"
                >
                  <Download className="w-4 h-4" />
                  下载壁纸
                </button>

                <div className="flex items-center gap-4 text-sm text-text-secondary mt-4">
                  <span className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    {formatCount(wallpaper.download_count)} 下载
                  </span>
                  {wallpaper.width > 0 && wallpaper.height > 0 && (
                    <span className="text-text-tertiary">
                      {wallpaper.width} × {wallpaper.height}
                    </span>
                  )}
                  {wallpaper.file_size > 0 && (
                    <span className="text-text-tertiary">
                      {formatFileSize(wallpaper.file_size)}
                    </span>
                  )}
                </div>

                {tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                      标签
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/?tag=${encodeURIComponent(tag.trim())}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
                        >
                          <Tag className="w-3 h-3" />
                          {tag.trim()}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {wallpaper.prompt && (
                  <div className="mt-6">
                    <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                      AI 提示词
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed bg-muted/50 rounded-lg p-3">
                      {wallpaper.prompt}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {similarWallpapers.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border/60">
              <h2 className="text-xl font-semibold text-foreground mb-6">猜你喜欢</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {similarWallpapers.map((wp) => (
                  <WallpaperCard key={wp.id} wallpaper={wp} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />

      <AnimatePresence>
        {showPreview && wallpaper.url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setShowPreview(false)}
          >
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full max-w-[95vw] max-h-[95vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={wallpaper.url}
                alt={wallpaper.title}
                fill
                sizes="95vw"
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

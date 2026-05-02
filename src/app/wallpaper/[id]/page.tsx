"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IPhoneFrame from "@/components/iPhoneFrame";
import WallpaperCard from "@/components/WallpaperCard";
import { Download, ArrowLeft, Tag, X, Maximize2, Calendar, HardDrive, Maximize } from "lucide-react";
import { stringToTags, formatDate, formatCount, formatFileSize, getApiUrl, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { Wallpaper, ApiResponse } from "@/lib/types";

export const runtime = "edge";

export default function WallpaperDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [wallpaper, setWallpaper] = useState<Wallpaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarWallpapers, setSimilarWallpapers] = useState<Wallpaper[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    fetch(getApiUrl(`/${id}`), { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (controller.signal.aborted) return;
        const wp = data.data || data.wallpaper || null;
        setWallpaper(wp);
        setLoading(false);

        if (wp) {
          fetch(getApiUrl(`/${id}`), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'view' }),
            signal: controller.signal
          }).catch(() => {});

          const orientation = (wp.height > wp.width && wp.width > 0) ? 'portrait' : 'landscape';
          fetch(getApiUrl("/", { limit: "16", page: "1", orientation }), { signal: controller.signal })
            .then((r) => r.json())
            .then((data: ApiResponse) => {
              if (controller.signal.aborted) return;
              const similar = (data.data?.list || [])
                .filter((w: Wallpaper) => String(w.id) !== String(id))
                .slice(0, 10);
              setSimilarWallpapers(similar);
            })
            .catch(() => { if (!controller.signal.aborted) setSimilarWallpapers([]); });
        }
      })
      .catch(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => { controller.abort(); };
  }, [id]);

  useEffect(() => {
    if (!showPreview) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowPreview(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPreview]);

  const handleDownload = useCallback(async () => {
    if (!wallpaper) return;
    try {
      fetch(getApiUrl(`/${wallpaper.id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'download' })
      }).catch(() => {});

      const link = document.createElement('a');
      link.href = wallpaper.url;
      link.download = `${wallpaper.title || 'wallpaper'}.jpg`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      window.open(wallpaper.url, "_blank");
    }
  }, [wallpaper]);

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="h-4 w-20 rounded animate-shimmer mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <div className="aspect-video rounded-xl animate-shimmer" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-surface border border-border/60 rounded-xl p-5 animate-shimmer" />
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
        <div className="pt-20 pb-12 px-4 max-w-4xl mx-auto text-center">
          <p className="text-text-secondary">壁纸未找到</p>
          <Link href="/" className="text-accent mt-4 inline-block">返回首页</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const tags = stringToTags(wallpaper.tags);
  const isPortrait = wallpaper.height > wallpaper.width && wallpaper.width > 0;

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-muted transition-colors mb-4"
            title="返回首页"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              {isPortrait ? (
                <IPhoneFrame size="sm" onClick={() => setShowPreview(true)}>
                  <div className="relative w-full h-full cursor-zoom-in group">
                    {wallpaper.url ? (
                      <Image
                        src={wallpaper.url}
                        alt={wallpaper.title}
                        fill
                        sizes="280px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 animate-shimmer" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-sm p-2.5 rounded-full">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </IPhoneFrame>
              ) : (
                <div
                  className="relative overflow-hidden rounded-xl bg-muted cursor-zoom-in group aspect-video"
                  onClick={() => setShowPreview(true)}
                >
                  {wallpaper.url ? (
                    <Image
                      src={wallpaper.url}
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
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-sm p-2.5 rounded-full">
                      <Maximize2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="bg-surface rounded-xl p-5 border border-border/60 space-y-5">
                <div>
                  <h1 className="font-heading text-xl font-bold leading-tight">{wallpaper.title}</h1>
                  <div className="flex items-center gap-1 text-xs text-text-tertiary mt-2">
                    <Calendar className="w-3 h-3" />
                    {formatDate(wallpaper.created_at)}
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-dark transition-colors"
                >
                  <Download className="w-4 h-4" />
                  下载壁纸
                </button>

                <div className="grid grid-cols-3 gap-3 py-3 border-y border-border/60">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-text-tertiary mb-1">
                      <Download className="w-3 h-3" />
                    </div>
                    <p className="text-sm font-medium">{formatCount(wallpaper.download_count)}</p>
                    <p className="text-xs text-text-tertiary">下载</p>
                  </div>
                  {wallpaper.width > 0 && wallpaper.height > 0 && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-text-tertiary mb-1">
                        <Maximize className="w-3 h-3" />
                      </div>
                      <p className="text-sm font-medium">{wallpaper.width}×{wallpaper.height}</p>
                      <p className="text-xs text-text-tertiary">分辨率</p>
                    </div>
                  )}
                  {wallpaper.file_size > 0 && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-text-tertiary mb-1">
                        <HardDrive className="w-3 h-3" />
                      </div>
                      <p className="text-sm font-medium">{formatFileSize(wallpaper.file_size)}</p>
                      <p className="text-xs text-text-tertiary">大小</p>
                    </div>
                  )}
                </div>

                {tags.length > 0 && (
                  <div>
                    <h3 className="text-xs font-medium text-text-tertiary mb-2">标签</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/?tag=${encodeURIComponent(tag.trim())}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-text-secondary text-xs hover:bg-accent/10 hover:text-accent transition-colors"
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {tag.trim()}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {wallpaper.prompt && (
                  <div>
                    <h3 className="text-xs font-medium text-text-tertiary mb-2">AI 提示词</h3>
                    <p className="text-xs text-text-secondary leading-relaxed bg-muted/50 rounded-lg p-3">
                      {wallpaper.prompt}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {similarWallpapers.length > 0 && (
            <div className="mt-10 pt-6 border-t border-border/60">
              <h2 className="text-lg font-semibold text-foreground mb-4">猜你喜欢</h2>
              <div className={cn(
                "grid gap-3",
                isPortrait
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                  : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
              )}>
                {similarWallpapers.map((wp) => (
                  <WallpaperCard key={wp.id} wallpaper={wp} orientation={isPortrait ? "portrait" : "landscape"} />
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

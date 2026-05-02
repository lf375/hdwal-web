"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import WallpaperCard from "@/components/WallpaperCard";
import { useSearchParams } from "next/navigation";
import { TAGS, cn, getApiUrl } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import type { Wallpaper, ApiResponse } from "@/lib/types";

function HomeContentInner() {
  const searchParams = useSearchParams();
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTag, setActiveTag] = useState(searchParams.get("tag") || "all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const orientation = searchParams.get("orientation") || "landscape";

  const LIMIT = 20;
  const abortRef = useRef<AbortController | null>(null);
  const searchRef = useRef(searchParams.get("search") || "");

  useEffect(() => {
    searchRef.current = searchParams.get("search") || "";
  });

  const doFetch = useCallback(async (tag: string, pageNum: number, append: boolean, ori: string) => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      const params: Record<string, string> = {
        page: pageNum.toString(),
        limit: LIMIT.toString(),
      };
      if (tag !== "all") params.tag = tag;
      if (ori && ori !== "all") params.orientation = ori;

      const res = await fetch(getApiUrl("/", params), { signal: controller.signal });
      if (controller.signal.aborted) return;
      const data: ApiResponse = await res.json();

      if (append) {
        setWallpapers(prev => [...prev, ...(data.data?.list || [])]);
      } else {
        setWallpapers(data.data?.list || []);
      }
      const totalPages = data.data?.pagination?.totalPages || 0;
      setHasMore(pageNum < totalPages);
      setPage(pageNum);
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error(err);
      if (!append) setWallpapers([]);
    } finally {
      if (!controller.signal.aborted) {
        if (append) setLoadingMore(false);
        else setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    doFetch(activeTag, 1, false, orientation);
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [activeTag, orientation, doFetch]);

  const handleTagChange = useCallback((tag: string) => {
    setActiveTag(tag);
  }, []);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    doFetch(activeTag, page + 1, true, orientation);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pt-14 flex-1">
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8">
        <div className="relative overflow-hidden rounded-2xl h-[180px] sm:h-[200px]">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-purple-50" />
          <div className="absolute inset-0">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-indigo-200/60 to-purple-200/40 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-violet-200/50 to-indigo-200/50 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-8 w-32 h-32 border border-indigo-200/30 rotate-12" />
            <div className="absolute bottom-4 left-8 w-24 h-24 border border-indigo-200/20 rotate-45" />
            <div className="absolute top-12 right-1/4 w-3 h-3 bg-indigo-300/40 rotate-45" />
            <div className="absolute bottom-16 right-16 w-2 h-2 bg-purple-300/50 rotate-45" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-12 lg:px-16">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">
              精选高清壁纸素材库
            </h1>
            <p className="text-text-tertiary text-xs sm:text-sm mt-2">
              AI 智能创作 · 每日更新 · 免费下载
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="group flex items-center gap-2 cursor-pointer">
                <span className="w-5 h-5 rounded-full bg-indigo-400/20 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </span>
                <span className="text-sm font-medium text-foreground">4K 超清</span>
              </div>
              <div className="group flex items-center gap-2 cursor-pointer">
                <span className="w-5 h-5 rounded-full bg-indigo-400/20 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </span>
                <span className="text-sm font-medium text-foreground">2K 高清</span>
              </div>
              <div className="group flex items-center gap-2 cursor-pointer">
                <span className="w-5 h-5 rounded-full bg-indigo-400/20 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </span>
                <span className="text-sm font-medium text-foreground">免费商用</span>
              </div>
              <div className="group flex items-center gap-2 cursor-pointer">
                <span className="w-5 h-5 rounded-full bg-indigo-400/20 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </span>
                <span className="text-sm font-medium text-foreground">每日更新</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-2 px-2">
          <button
            onClick={() => handleTagChange("all")}
            className={cn(
              "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all",
              activeTag === "all"
                ? "bg-foreground text-background"
                : "bg-surface text-text-secondary border border-border hover:bg-surface/80 hover:border-foreground/30"
            )}
          >
            全部
          </button>
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagChange(tag)}
              className={cn(
                "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                activeTag === tag
                  ? "bg-foreground text-background"
                  : "bg-surface text-text-secondary border border-border hover:bg-surface/80 hover:border-foreground/30"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
        {loading ? (
          <div className={cn(
            "grid gap-4",
            orientation === "portrait"
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-3"
          )}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={cn(
                "rounded-xl animate-shimmer",
                orientation === "portrait" ? "aspect-[2/3]" : "aspect-[3/2]"
              )} />
            ))}
          </div>
        ) : wallpapers.length > 0 ? (
          <>
            <div className={cn(
              "grid gap-4",
              orientation === "portrait"
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                : "grid-cols-2 sm:grid-cols-3"
            )}>
              {wallpapers.map((wp) => (
                <WallpaperCard key={wp.id} wallpaper={wp} orientation={orientation as "landscape" | "portrait"} />
              ))}
            </div>

            <div className="mt-8 text-center">
              {hasMore ? (
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:border-foreground/20 transition-colors disabled:opacity-50"
                >
                  {loadingMore ? "加载中..." : "加载更多"}
                </button>
              ) : (
                <p className="text-text-tertiary text-sm">没有更多了</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-text-tertiary text-sm">暂无壁纸</p>
          </div>
        )}
      </section>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-28 right-6 z-50 p-3 rounded-lg bg-foreground text-background shadow-lg hover:bg-foreground/90 transition-all hover:scale-105"
          aria-label="回到顶部"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default function HomeContent() {
  return (
    <Suspense fallback={
      <div className="pt-14 flex-1">
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8">
          <div className="rounded-2xl h-[180px] sm:h-[200px] animate-shimmer" />
        </section>
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6">
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-16 h-8 rounded-full animate-shimmer" />
            ))}
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/2] rounded-xl animate-shimmer" />
            ))}
          </div>
        </section>
      </div>
    }>
      <HomeContentInner />
    </Suspense>
  );
}

"use client";

import { useEffect, useReducer, useCallback, useRef, Suspense } from "react";
import WallpaperCard from "@/components/WallpaperCard";
import { useSearchParams } from "next/navigation";
import { TAGS, cn, getApiUrl } from "@/lib/utils";
import { ArrowUp, AlertCircle } from "lucide-react";
import type { Wallpaper, ApiResponse } from "@/lib/types";

interface State {
  wallpapers: Wallpaper[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  showScrollTop: boolean;
}

type Action =
  | { type: "FETCH_START"; append: boolean }
  | { type: "FETCH_SUCCESS"; wallpapers: Wallpaper[]; append: boolean; totalPages: number; page: number }
  | { type: "FETCH_ERROR"; error: string; append: boolean }
  | { type: "SET_SCROLL_TOP"; value: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: action.append ? state.loading : true,
        loadingMore: action.append,
        error: null,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        loadingMore: false,
        wallpapers: action.append
          ? [...state.wallpapers, ...action.wallpapers]
          : action.wallpapers,
        hasMore: action.page < action.totalPages,
        page: action.page,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        loadingMore: false,
        wallpapers: action.append ? state.wallpapers : [],
        error: action.append ? state.error : action.error,
      };
    case "SET_SCROLL_TOP":
      return { ...state, showScrollTop: action.value };
    default:
      return state;
  }
}

const initialState: State = {
  wallpapers: [],
  loading: true,
  loadingMore: false,
  error: null,
  page: 1,
  hasMore: true,
  showScrollTop: false,
};

function HomeContentInner() {
  const searchParams = useSearchParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [activeTag, setActiveTag] = useReducer((s: string, a: string) => a, searchParams.get("tag") || "all");
  const orientation = searchParams.get("orientation") || "landscape";
  const search = searchParams.get("search") || "";

  const LIMIT = 20;
  const abortRef = useRef<AbortController | null>(null);
  const fetchIdRef = useRef(0);

  const doFetch = useCallback(async (tag: string, pageNum: number, append: boolean, ori: string, searchQuery: string) => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    const fetchId = ++fetchIdRef.current;

    dispatch({ type: "FETCH_START", append });

    try {
      const params: Record<string, string> = {
        page: pageNum.toString(),
        limit: LIMIT.toString(),
      };
      if (tag !== "all") params.tag = tag;
      if (ori && ori !== "all") params.orientation = ori;
      if (searchQuery) params.search = searchQuery;

      const res = await fetch(getApiUrl("/", params), { signal: controller.signal });
      if (controller.signal.aborted) return;
      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "请求失败");
      }

      if (fetchId !== fetchIdRef.current) return;

      dispatch({
        type: "FETCH_SUCCESS",
        wallpapers: data.data?.list || [],
        append,
        totalPages: data.data?.pagination?.totalPages || 0,
        page: pageNum,
      });
    } catch (err: unknown) {
      if (controller.signal.aborted) return;
      if (fetchId !== fetchIdRef.current) return;
      console.error(err);
      const message = err instanceof Error ? err.message : "加载失败，请重试";
      dispatch({ type: "FETCH_ERROR", error: message, append });
    }
  }, []);

  const fetchData = useCallback((tag: string, ori: string, searchQuery: string) => {
    doFetch(tag, 1, false, ori, searchQuery);
  }, [doFetch]);

  useEffect(() => {
    fetchData(activeTag, orientation, search);
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [activeTag, orientation, search, fetchData]);

  const handleTagChange = useCallback((tag: string) => {
    setActiveTag(tag);
  }, []);

  const handleLoadMore = () => {
    if (state.loadingMore || !state.hasMore) return;
    doFetch(activeTag, state.page + 1, true, orientation, search);
  };

  const handleRetry = () => {
    doFetch(activeTag, 1, false, orientation, search);
  };

  useEffect(() => {
    const handleScroll = () => {
      dispatch({ type: "SET_SCROLL_TOP", value: window.scrollY > 400 });
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
        {state.loading ? (
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
        ) : state.error ? (
          <div className="text-center py-20">
            <AlertCircle className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
            <p className="text-text-secondary text-sm mb-4">{state.error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 rounded-xl border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:border-foreground/20 transition-colors"
            >
              重试
            </button>
          </div>
        ) : state.wallpapers.length > 0 ? (
          <>
            <div className={cn(
              "grid gap-4",
              orientation === "portrait"
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                : "grid-cols-2 sm:grid-cols-3"
            )}>
              {state.wallpapers.map((wp) => (
                <WallpaperCard key={wp.id} wallpaper={wp} orientation={orientation as "landscape" | "portrait"} />
              ))}
            </div>

            <div className="mt-8 text-center">
              {state.hasMore ? (
                <button
                  onClick={handleLoadMore}
                  disabled={state.loadingMore}
                  className="px-8 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:border-foreground/20 transition-colors disabled:opacity-50"
                >
                  {state.loadingMore ? "加载中..." : "加载更多"}
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

      {state.showScrollTop && (
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

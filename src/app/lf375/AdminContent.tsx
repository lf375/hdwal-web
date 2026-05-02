"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock, Trash2, Edit, Search, ChevronLeft, ChevronRight, LogOut, AlertCircle } from "lucide-react";
import { formatDate, getApiUrl, getDisplayUrl } from "@/lib/utils";
import type { Wallpaper, ApiResponse } from "@/lib/types";

const API_BASE = "https://read.hdwal.com";

export default function AdminContent() {
  const [apiKey, setApiKey] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTags, setEditTags] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [fetchDeps, setFetchDeps] = useState({ page: 1, search: "" });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem("admin_api_key");
    if (storedKey) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setApiKey(storedKey);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    if (apiKey.trim()) {
      localStorage.setItem("admin_api_key", apiKey.trim());
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_api_key");
    setApiKey("");
    setIsLoggedIn(false);
    setWallpapers([]);
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    const params: Record<string, string> = {
      page: fetchDeps.page.toString(),
      limit: "12",
    };
    if (fetchDeps.search) params.search = fetchDeps.search;

    fetch(getApiUrl("/", params), { signal: controller.signal })
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        if (controller.signal.aborted) return;
        if (!data.success) throw new Error(data.error || "请求失败");
        setWallpapers(data.data?.list || []);
        setTotal(data.data?.pagination?.total || 0);
        setTotalPages(data.data?.pagination?.totalPages || 1);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "加载失败");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [isLoggedIn, fetchDeps]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setFetchDeps({ page: 1, search: value });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFetchDeps({ page: newPage, search: searchQuery });
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "删除失败");
      
      setWallpapers(wallpapers.filter((w) => w.id !== id));
      setTotal((t) => t - 1);
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "删除失败");
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          title: editTitle,
          tags: editTags,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "更新失败");

      setWallpapers(
        wallpapers.map((w) =>
          w.id === id ? { ...w, title: editTitle, tags: editTags } : w
        )
      );
      setEditingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "更新失败");
    }
  };

  const startEdit = (wp: Wallpaper) => {
    setEditingId(wp.id);
    setEditTitle(wp.title || "");
    setEditTags(wp.tags || "");
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-14 flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="bg-surface border border-border/60 rounded-xl p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-accent" />
                </div>
              </div>
              <h1 className="text-lg font-semibold text-center mb-4">管理后台登录</h1>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="请输入 API Key"
                className="w-full px-4 py-2.5 rounded-lg border border-border/60 bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 text-sm mb-4"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                onClick={handleLogin}
                className="w-full py-2.5 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-dark transition-colors"
              >
                登录
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-14 flex-1">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold">壁纸管理</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-tertiary">共 {total} 张</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-foreground hover:bg-surface transition-colors"
              >
                <LogOut className="w-4 h-4" />
                退出
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="搜索标题或提示词..."
                className="w-full px-4 py-2 pr-10 rounded-lg border border-border/60 bg-background focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 text-sm"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 text-red-500 mb-6">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl animate-shimmer" />
              ))}
            </div>
          ) : wallpapers.length === 0 ? (
            <div className="text-center py-20 text-text-tertiary">暂无壁纸</div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {wallpapers.map((wp) => {
                  const isEditing = editingId === wp.id;
                  const isDeleting = deleteConfirm === wp.id;

                  return (
                    <div
                      key={wp.id}
                      className="group relative bg-surface border border-border/60 rounded-xl overflow-hidden"
                    >
                      <div className="relative overflow-hidden aspect-square">
                        <Image
                          src={getDisplayUrl(wp)}
                          alt={wp.title || ""}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => startEdit(wp)}
                            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(wp.id)}
                            className="p-2 rounded-full bg-red-500/50 hover:bg-red-500/70 text-white transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="标题"
                              className="w-full px-2 py-1 text-sm rounded border border-border/60 bg-background focus:outline-none focus:ring-1 focus:ring-accent"
                            />
                            <input
                              type="text"
                              value={editTags}
                              onChange={(e) => setEditTags(e.target.value)}
                              placeholder='标签 (JSON数组格式，如 ["自然风光","城市"])'
                              className="w-full px-2 py-1 text-xs rounded border border-border/60 bg-background focus:outline-none focus:ring-1 focus:ring-accent"
                            />
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleEdit(wp.id)}
                                className="flex-1 py-1 rounded text-xs bg-accent text-white hover:bg-accent-dark transition-colors"
                              >
                                保存
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="flex-1 py-1 rounded text-xs bg-surface border border-border/60 hover:bg-surface-hover transition-colors"
                              >
                                取消
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-medium truncate">{wp.title || "无标题"}</p>
                            <p className="text-xs text-text-tertiary mt-1">
                              {formatDate(wp.created_at)} · {wp.view_count} 浏览
                            </p>
                          </>
                        )}
                      </div>

                      {isDeleting && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                          <div className="text-center p-4">
                            <p className="text-white text-sm mb-3">确定删除？</p>
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleDelete(wp.id)}
                                className="px-3 py-1.5 rounded text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
                              >
                                删除
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-3 py-1.5 rounded text-sm bg-white/20 text-white hover:bg-white/30 transition-colors"
                              >
                                取消
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-border/60 hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-text-secondary">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-border/60 hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

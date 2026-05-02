"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, Suspense } from "react";
import { Menu, X, Search, Monitor, Smartphone } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

function NavbarContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const orientation = searchParams.get("orientation") || "landscape";
  const isDetailPage = pathname?.startsWith("/wallpaper/");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/");
    }
  };

  const handleOrientationChange = (newOrientation: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("orientation", newOrientation);
    router.replace(`/?${params.toString()}`);
    window.scrollTo(0, 0);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/60">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => { window.location.href = window.location.origin; }}
            className="flex items-center gap-0.5 select-none cursor-pointer"
          >
            <span className="font-heading text-xl font-black tracking-tighter text-foreground">
              HD<span className="text-accent">wal</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleOrientationChange("landscape")}
              className={cn(
                "flex items-center gap-1.5 text-sm transition-colors",
                !isDetailPage && orientation === "landscape"
                  ? "text-accent font-medium"
                  : "text-text-tertiary hover:text-foreground"
              )}
            >
              <Monitor className="w-4 h-4" />
              桌面
            </button>
            <button
              onClick={() => handleOrientationChange("portrait")}
              className={cn(
                "flex items-center gap-1.5 text-sm transition-colors",
                !isDetailPage && orientation === "portrait"
                  ? "text-accent font-medium"
                  : "text-text-tertiary hover:text-foreground"
              )}
            >
              <Smartphone className="w-4 h-4" />
              竖屏
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索..."
                className="w-40 md:w-48 px-3 py-1.5 pr-8 rounded-full text-sm bg-surface border border-border/60 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-200 focus:w-64"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-accent transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          <button
            className="md:hidden p-1.5 rounded-md hover:bg-surface-hover transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-3">
            <div className="flex gap-1 mb-4">
              <button
                onClick={() => { handleOrientationChange("landscape"); setMobileOpen(false); }}
                className={cn(
                  "flex-1 px-3 py-2 rounded-md text-sm text-center flex items-center justify-center gap-1.5 transition-colors",
                  !isDetailPage && orientation === "landscape"
                    ? "text-accent font-medium bg-accent/10"
                    : "text-text-tertiary"
                )}
              >
                <Monitor className="w-4 h-4" />
                桌面
              </button>
              <button
                onClick={() => { handleOrientationChange("portrait"); setMobileOpen(false); }}
                className={cn(
                  "flex-1 px-3 py-2 rounded-md text-sm text-center flex items-center justify-center gap-1.5 transition-colors",
                  !isDetailPage && orientation === "portrait"
                    ? "text-accent font-medium bg-accent/10"
                    : "text-text-tertiary"
                )}
              >
                <Smartphone className="w-4 h-4" />
                竖屏
              </button>
            </div>
            <form onSubmit={handleSearch} className="w-full relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索壁纸..."
                className="w-full px-4 py-2 pr-10 rounded-full text-sm bg-surface border border-border/60 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-accent transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/60">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-0.5 select-none">
            <span className="font-heading text-xl font-black tracking-tighter text-foreground">
              HD<span className="text-accent">wal</span>
            </span>
          </Link>
        </nav>
      </header>
    }>
      <NavbarContent />
    </Suspense>
  );
}

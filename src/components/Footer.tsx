import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="font-heading text-sm font-black tracking-tighter text-foreground">
              HD<span className="text-accent">wal</span>
            </span>
            <p className="text-xs text-text-tertiary hidden sm:block">
              高清壁纸 · 免费下载 · 每日更新
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/about" className="text-xs text-text-tertiary hover:text-accent transition-colors">
              关于
            </Link>
            <p className="text-xs text-text-tertiary">
              © 2026 HDwal
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

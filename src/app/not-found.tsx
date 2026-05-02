import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-heading font-black text-foreground">404</h1>
      <p className="text-text-secondary mt-4 text-lg">页面未找到</p>
      <Link
        href="/"
        className="mt-6 px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
      >
        返回首页
      </Link>
    </div>
  );
}

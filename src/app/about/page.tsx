import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-12 pt-24">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-4">关于 HDwal</h1>
            <p className="text-text-secondary leading-relaxed">
              HDwal 是一个专注于高质量壁纸的分享平台，提供 AI 智能创作的高清壁纸，
              覆盖多种风格和主题，满足不同用户的个性化需求。
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-foreground mb-3">平台特色</h2>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <span>AI 智能创作，每日更新</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <span>2K 超高清分辨率</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <span>免费商用，无版权限制</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <span>多种风格和主题</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <span>响应式设计，适配各种设备</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-medium text-foreground mb-3">技术架构</h2>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <span>Cloudflare 全球边缘网络</span>
              </li>
              <li className="flex items-start gap-2 pl-4">
                <span className="text-text-tertiary">├─</span>
                <span>Workers 无服务器计算 - 毫秒级响应</span>
              </li>
              <li className="flex items-start gap-2 pl-4">
                <span className="text-text-tertiary">├─</span>
                <span>R2 对象存储 - 全球加速分发</span>
              </li>
              <li className="flex items-start gap-2 pl-4">
                <span className="text-text-tertiary">├─</span>
                <span>D1 边缘数据库 - 低延迟查询</span>
              </li>
              <li className="flex items-start gap-2 pl-4">
                <span className="text-text-tertiary">└─</span>
                <span>300+ 全球节点 - 就近访问</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-medium text-foreground mb-3">联系方式</h2>
            <p className="text-text-secondary">
              如有任何问题或建议，欢迎联系我们。
            </p>
            <p className="text-text-secondary mt-2">
              邮箱：<a href="mailto:375756675@qq.com" className="text-accent hover:underline">375756675@qq.com</a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-medium text-foreground mb-3">使用条款</h2>
            <p className="text-text-secondary leading-relaxed">
              所有壁纸由 AI 智能创作，可用于个人和商业用途。
              未经授权，请勿将壁纸用于违法或侵权行为。
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

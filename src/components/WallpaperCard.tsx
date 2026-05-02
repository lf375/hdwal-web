"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { formatCount, getDisplayUrl, cn } from "@/lib/utils";
import type { Wallpaper } from "@/lib/types";

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  orientation?: "landscape" | "portrait";
}

export default function WallpaperCard({ wallpaper, orientation = "landscape" }: WallpaperCardProps) {
  const [loaded, setLoaded] = useState(false);
  const prevUrlRef = useRef(wallpaper.url);
  const displayUrl = getDisplayUrl(wallpaper);
  const isPortrait = wallpaper.height > wallpaper.width && wallpaper.width > 0;
  const cardOrientation = orientation === "portrait" || isPortrait ? "portrait" : "landscape";

  useEffect(() => {
    if (prevUrlRef.current !== displayUrl) {
      setLoaded(false);
      prevUrlRef.current = displayUrl;
    }
  }, [displayUrl]);

  return (
    <div>
      <Link href={`/wallpaper/${wallpaper.id}`} className="block group">
        <div
          className={cn(
            "relative overflow-hidden rounded-xl bg-muted",
            cardOrientation === "portrait" ? "aspect-[2/3]" : "aspect-[3/2]"
          )}
          style={{
            isolation: "isolate",
            WebkitMaskImage: "-webkit-radial-gradient(white, black)"
          }}
        >
          {!loaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-muted via-surface to-muted animate-pulse" />
          )}
          {displayUrl && (
            <Image
              src={displayUrl}
              alt={wallpaper.title}
              fill
              loading="lazy"
              className={`object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] ${loaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setLoaded(true)}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <p className="text-white text-xs font-medium truncate mb-1 drop-shadow-md">{wallpaper.title}</p>
            <div className="flex items-center gap-3 text-white/80 text-xs">
              <span className="flex items-center gap-0.5 drop-shadow-md">
                <Download className="w-3 h-3" />
                {formatCount(wallpaper.download_count)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

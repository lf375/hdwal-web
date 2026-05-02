"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface IPhoneFrameProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function IPhoneFrame({ children, className, onClick }: IPhoneFrameProps) {
  return (
    <div
      className={cn("relative mx-auto", className)}
      style={{ width: "min(340px, 88vw)" }}
      onClick={onClick}
    >
      <div className="relative rounded-[2.8rem] bg-gradient-to-b from-[#d4d4d4] via-[#b0b0b0] to-[#999999] p-[2.5px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]">
        <div className="absolute top-[18%] -left-[1px] w-[2px] h-[14px] bg-[#888888] rounded-l-sm" />
        <div className="absolute top-[28%] -left-[1px] w-[2px] h-[22px] bg-[#888888] rounded-l-sm" />
        <div className="absolute top-[40%] -left-[1px] w-[2px] h-[22px] bg-[#888888] rounded-l-sm" />
        <div className="absolute top-[32%] -right-[1px] w-[2px] h-[28px] bg-[#888888] rounded-r-sm" />

        <div className="relative rounded-[2.65rem] bg-[#0a0a0a] p-[10px]">
          <div className="relative rounded-[2.1rem] bg-black overflow-hidden">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30">
              <div className="w-[85px] h-[26px] bg-black rounded-full flex items-center justify-center">
                <div className="w-[9px] h-[9px] rounded-full bg-[#0d0d0d] ring-[0.5px] ring-[#1a1a1a] relative overflow-hidden ml-1">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3.5px] h-[3.5px] rounded-full bg-[#1a1a2e]" />
                  <div className="absolute top-[1px] left-[1px] w-[2.5px] h-[2.5px] rounded-full bg-[#2a2a4a]/50" />
                </div>
              </div>
            </div>

            <div className="relative aspect-[9/19.5]">
              {children}
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[110px] h-[4.5px] bg-white/25 rounded-full z-20" />
          </div>
        </div>
      </div>

      <div className="h-[30px] mx-[15%] mt-1 bg-gradient-to-b from-black/20 to-transparent rounded-[50%] blur-md" />

      <div className="absolute inset-0 rounded-[2.8rem] pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[20%] w-[50%] h-[70%] bg-gradient-to-br from-white/[0.06] via-transparent to-transparent rotate-12 rounded-full" />
      </div>
    </div>
  );
}

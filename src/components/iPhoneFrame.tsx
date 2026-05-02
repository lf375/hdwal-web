"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface IPhoneFrameProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  size?: "default" | "sm";
}

export default function IPhoneFrame({ children, className, onClick, size = "default" }: IPhoneFrameProps) {
  const isSm = size === "sm";
  const frameWidth = isSm ? "min(280px, 70vw)" : "min(340px, 88vw)";

  return (
    <div
      className={cn("relative mx-auto", className)}
      style={{ width: frameWidth }}
      onClick={onClick}
    >
      <div className={cn(
        "relative bg-gradient-to-b from-[#d4d4d4] via-[#b0b0b0] to-[#999999] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]",
        isSm ? "rounded-[2.2rem] p-[2px]" : "rounded-[2.8rem] p-[2.5px]"
      )}>
        {!isSm && (
          <>
            <div className="absolute top-[18%] -left-[1px] w-[2px] h-[14px] bg-[#888888] rounded-l-sm" />
            <div className="absolute top-[28%] -left-[1px] w-[2px] h-[22px] bg-[#888888] rounded-l-sm" />
            <div className="absolute top-[40%] -left-[1px] w-[2px] h-[22px] bg-[#888888] rounded-l-sm" />
            <div className="absolute top-[32%] -right-[1px] w-[2px] h-[28px] bg-[#888888] rounded-r-sm" />
          </>
        )}

        <div className={cn(
          "relative bg-[#0a0a0a]",
          isSm ? "rounded-[2.1rem] p-[8px]" : "rounded-[2.65rem] p-[10px]"
        )}>
          <div className={cn(
            "relative bg-black overflow-hidden",
            isSm ? "rounded-[1.6rem]" : "rounded-[2.1rem]"
          )}>
            <div className={cn(
              "absolute left-1/2 -translate-x-1/2 z-30",
              isSm ? "top-2" : "top-3"
            )}>
              <div className={cn(
                "bg-black rounded-full flex items-center justify-center",
                isSm ? "w-[70px] h-[22px]" : "w-[85px] h-[26px]"
              )}>
                <div className={cn(
                  "rounded-full bg-[#0d0d0d] ring-[0.5px] ring-[#1a1a1a] relative overflow-hidden",
                  isSm ? "w-[7px] h-[7px] ml-0.5" : "w-[9px] h-[9px] ml-1"
                )}>
                  <div className={cn(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a1a2e]",
                    isSm ? "w-[3px] h-[3px]" : "w-[3.5px] h-[3.5px]"
                  )} />
                </div>
              </div>
            </div>

            <div className="relative aspect-[9/19.5]">
              {children}
            </div>

            <div className={cn(
              "absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/25 rounded-full z-20",
              isSm ? "w-[90px] h-[3.5px]" : "w-[110px] h-[4.5px]"
            )} />
          </div>
        </div>
      </div>

      <div className={cn(
        "mx-[15%] mt-1 bg-gradient-to-b from-black/20 to-transparent rounded-[50%] blur-md",
        isSm ? "h-[24px]" : "h-[30px]"
      )} />

      <div className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden",
        isSm ? "rounded-[2.2rem]" : "rounded-[2.8rem]"
      )}>
        <div className="absolute -top-[20%] -left-[20%] w-[50%] h-[70%] bg-gradient-to-br from-white/[0.06] via-transparent to-transparent rotate-12 rounded-full" />
      </div>
    </div>
  );
}

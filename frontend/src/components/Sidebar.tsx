"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BarChart3, Target, Settings, LogOut, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Trailer Audit",
    icon: BarChart3,
    href: "/trailer",
    color: "text-pulse",
  },
  {
    title: "Streamer Sniper",
    icon: Target,
    href: "/streamer",
    color: "text-plasma",
  },
  {
    title: "Launch System",
    icon: Zap,
    href: "#",
    color: "text-amber-500",
    disabled: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-carbon border-r border-slate-800 flex flex-col sticky top-0 h-screen z-20 overflow-hidden">
      {/* Background HUD Grid Effect */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #2DD4BF 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="p-8 space-y-12 relative z-10 flex flex-col h-full">
        {/* Logo Section */}
        <Link href="/" className="flex flex-col gap-1 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(45,212,191,0.25)] transition-all duration-1000 ease-in-out group-hover:rotate-12 shrink-0">
              <Image
                src="/logo.png"
                alt="IndieLauncher.AI Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xl font-black text-white font-mono tracking-tighter">
                INDIE<span className="text-plasma">LAUNCHER</span>
              </span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-pulse animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 font-mono tracking-[0.2em] uppercase">
                  Tactical OS
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Navigation - Scrollable area */}
        <nav className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] font-mono px-4">
              Modules
            </p>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group font-mono",
                    pathname === item.href
                      ? "bg-slate-850 border border-slate-800 text-white shadow-inner shadow-black/50"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/5",
                    item.disabled &&
                      "opacity-40 cursor-not-allowed pointer-events-none",
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-6",
                      pathname === item.href
                        ? item.color
                        : "text-slate-600 group-hover:text-slate-400",
                    )}
                  />
                  <span className="text-xs font-black tracking-widest">
                    {item.title}
                  </span>
                  {pathname === item.href && (
                    <div
                      className={cn(
                        "ml-auto w-1.5 h-4 rounded-full",
                        item.color.replace("text-", "bg-"),
                      )}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] font-mono px-4">
              Account
            </p>
            <div className="space-y-1">
              <Link
                href="#"
                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all font-mono"
              >
                <Settings className="w-5 h-5 text-slate-600" />
                <span className="text-xs font-black tracking-widest uppercase">
                  Preferences
                </span>
              </Link>
              <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all font-mono cursor-pointer">
                <LogOut className="w-5 h-5 text-slate-600" />
                <span className="text-xs font-black tracking-widest uppercase text-left">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </nav>

        {/* User Account Block */}
        <div className="mt-auto p-4 flex items-center gap-4 bg-white/5 rounded-2xl border border-white/5 transition-all hover:bg-white/10 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-plasma/10 border border-plasma/20 flex items-center justify-center text-plasma font-mono font-black shadow-[0_0_15px_rgba(45,212,191,0.1)] group-hover:scale-105 transition-transform">
            LA
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[11px] font-black text-white truncate font-mono">
              Leandro Alfonso
            </p>
            <p className="text-[9px] text-slate-500 font-mono truncate uppercase tracking-widest">
              Pro Member
            </p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-plasma animate-pulse shrink-0" />
        </div>
      </div>
    </aside>
  );
}

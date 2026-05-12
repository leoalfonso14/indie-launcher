"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart3,
  Target,
  Sparkles,
  History,
  Bookmark,
  Users,
  Zap,
  TrendingUp,
  Clock,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const recentAudits = [
    {
      title: "Roguelike_Trailer_Final",
      date: "2h ago",
      score: 88,
      status: "Excellent",
    },
    {
      title: "Steam_Next_Fest_Demo",
      date: "1d ago",
      score: 72,
      status: "Good",
    },
    { title: "Teaser_Announcement", date: "3d ago", score: 45, status: "Weak" },
  ];

  const watchlists = [
    { name: "S-Tier Influencers", count: 12, genre: "Action RPG" },
    { name: "Launch Candidates", count: 8, genre: "Roguelike" },
    { name: "Small Streamer Gems", count: 24, genre: "Platformer" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plasma/10 border border-plasma/20 text-[10px] font-black text-plasma uppercase tracking-[0.2em] font-mono">
            <ShieldCheck className="w-3 h-3" />
            Dashboard Overview
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white font-mono uppercase">
            Welcome, <span className="text-plasma">Leandro</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl font-medium">
            System ready. Intelligence gathered across 1,204 creator leads.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/trailer"
            className="px-6 py-3 bg-plasma text-carbon font-black font-mono rounded-xl shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:scale-105 transition-all text-[11px] uppercase tracking-widest cursor-pointer flex items-center gap-2"
          >
            New Audit <Zap className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Audits Run",
            value: "24",
            sub: "Total Scans",
            color: "text-pulse",
            icon: BarChart3,
          },
          {
            label: "Potential Reach",
            value: "1.2M",
            sub: "Combined Audience",
            color: "text-plasma",
            icon: Users,
          },
          {
            label: "Active Genre",
            value: "Roguelike",
            sub: "Current Focus",
            color: "text-plasma",
            icon: Target,
          },
          {
            label: "Saved Profiles",
            value: "48",
            sub: "In Watchlists",
            color: "text-amber-500",
            icon: Bookmark,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="hud-card p-6 border-slate-800/50 group hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-slate-700" />
            </div>
            <p className="text-2xl font-black text-white font-mono">
              {stat.value}
            </p>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono mt-1">
              {stat.label}
            </p>
            <p className="text-[8px] text-slate-700 font-mono mt-2">
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Intelligence Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-mono font-black text-white uppercase tracking-widest text-sm flex items-center gap-2">
              <History className="w-5 h-5 text-plasma" /> Recent content
              creators
            </h3>
            <Link
              href="/trailer"
              className="text-[10px] font-black text-slate-500 hover:text-plasma transition-colors uppercase font-mono tracking-widest cursor-pointer"
            >
              View All Audits
            </Link>
          </div>

          <div className="space-y-4">
            {recentAudits.map((audit, i) => (
              <div
                key={i}
                className="hud-card p-5 border-slate-800/50 flex items-center justify-between group hover:bg-white/5 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-xs border",
                      audit.score > 80
                        ? "bg-plasma/10 border-plasma/20 text-plasma"
                        : audit.score > 60
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                          : "bg-pulse/10 border-pulse/20 text-pulse",
                    )}
                  >
                    {audit.score}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white font-mono">
                      {audit.title}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {audit.date}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-black uppercase",
                          audit.score > 80
                            ? "bg-plasma/20 text-plasma"
                            : audit.score > 60
                              ? "bg-amber-500/20 text-amber-500"
                              : "bg-pulse/20 text-pulse",
                        )}
                      >
                        {audit.status}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-800 group-hover:text-plasma group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Watchlists Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-mono font-black text-white uppercase tracking-widest text-sm flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-pulse" /> Watchlists
            </h3>
            <button className="text-[10px] font-black text-slate-500 hover:text-pulse transition-colors uppercase font-mono tracking-widest cursor-pointer">
              New List
            </button>
          </div>

          <div className="space-y-4">
            {watchlists.map((list, i) => (
              <div
                key={i}
                className="hud-card p-6 border-slate-800/50 hover:border-pulse/30 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-pulse/10 border border-pulse/20 flex items-center justify-center text-pulse">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-white font-mono">
                    {list.count}
                  </span>
                </div>
                <p className="text-sm font-black text-white font-mono mb-1 group-hover:text-pulse transition-colors">
                  {list.name}
                </p>
                <p className="text-[9px] text-slate-500 uppercase font-mono tracking-widest">
                  {list.genre}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Signal Banner */}
      <div className="p-8 hud-card bg-linear-to-r from-plasma/10 to-transparent border-plasma/20 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-plasma/20 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.2)]">
            <Sparkles className="w-8 h-8 text-plasma" />
          </div>
          <div className="space-y-1">
            <p className="text-white font-black font-mono uppercase tracking-tight text-xl">
              Market Signal: Roguelike Surge
            </p>
            <p className="text-slate-400 text-sm max-w-lg">
              We detected a 40% increase in Roguelike viewers this week. 12 new
              high-conversion streamers just joined the database.
            </p>
          </div>
        </div>
        <Link
          href="/streamer"
          className="px-8 py-4 bg-carbon-light border border-slate-800 text-white font-black font-mono rounded-xl hover:bg-slate-800 transition-all cursor-pointer uppercase tracking-widest text-xs flex items-center gap-3 whitespace-nowrap"
        >
          Scan New Leads <ChevronRight className="w-4 h-4 text-plasma" />
        </Link>
      </div>
    </div>
  );
}

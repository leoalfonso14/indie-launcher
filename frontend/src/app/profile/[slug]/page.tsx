"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Target,
  Monitor,
  Video,
  CheckCircle,
  BarChart3,
  ShieldCheck,
  Zap,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StreamerProfile {
  id: string;
  name: string;
  platform: "twitch" | "youtube";
  matchScore: number;
  conversionPotential: "High" | "Medium" | "Low";
  tags: string[];
  avgViewers: string;
  reason: string;
}

export default function ProfilePage() {
  const { slug } = useParams();
  const router = useRouter();
  const [streamer, setStreamer] = useState<StreamerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${API_BASE_URL}/streamer/${slug}`);
        if (!response.ok) throw new Error("Profile link expired or invalid.");
        const data = await response.json();
        setStreamer(data);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Profile link expired or invalid.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-16 h-16 border-4 border-plasma/20 border-t-plasma rounded-full animate-spin" />
        <p className="font-mono text-xs text-plasma uppercase tracking-[0.3em] animate-pulse">
          Initializing Dossier...
        </p>
      </div>
    );
  }

  if (error || !streamer) {
    return (
      <div className="hud-card p-12 text-center space-y-6 max-w-lg mx-auto mt-20 border-pulse/30">
        <div className="w-16 h-16 bg-pulse/10 rounded-2xl flex items-center justify-center mx-auto border border-pulse/20">
          <ShieldCheck className="w-8 h-8 text-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white font-mono uppercase tracking-tighter">
            Access Denied
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            This profile link has expired or is unauthorized for this session.
          </p>
        </div>
        <button
          onClick={() => router.push("/streamer")}
          className="px-8 py-3 bg-carbon-light border border-slate-800 rounded-xl text-xs font-black text-white hover:bg-slate-800 transition-all cursor-pointer font-mono uppercase tracking-widest"
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header / Nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors cursor-pointer font-mono text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Back to creators
          </button>
        </div>

        <div className="flex items-center gap-3 bg-carbon-light px-4 py-2 rounded-2xl border border-slate-800 shadow-inner">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono cursor-default">
            Simulate Full Access
          </span>
          <button
            onClick={() => setIsSimulated(!isSimulated)}
            className={cn(
              "w-12 h-6 rounded-full transition-all relative border-2 cursor-pointer",
              isSimulated
                ? "bg-plasma border-plasma"
                : "bg-slate-800 border-slate-700",
            )}
          >
            <div
              className={cn(
                "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-md cursor-pointer",
                isSimulated ? "left-6" : "left-0.5",
              )}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Identity Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="hud-card p-8 hud-border-plasma relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div
                className={cn(
                  "w-32 h-32 rounded-3xl flex items-center justify-center shadow-inner border-2 transition-transform duration-700 hover:rotate-6",
                  streamer.platform === "twitch"
                    ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                    : "bg-red-500/10 border-red-500/30 text-red-500",
                )}
              >
                {streamer.platform === "twitch" ? (
                  <Monitor className="w-16 h-16" />
                ) : (
                  <Video className="w-16 h-16" />
                )}
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-white font-mono tracking-tighter">
                  {streamer.name}
                </h1>
                <p className="text-plasma font-mono text-[10px] font-black uppercase tracking-[0.4em]">
                  {streamer.platform} Creator
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {streamer.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-carbon border border-slate-800 text-slate-500 text-[9px] font-black font-mono uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button className="w-full py-4 bg-plasma text-carbon font-black font-mono rounded-2xl shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                Visit Channel <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="hud-card p-6 border-slate-800/50 space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
              Dossier Accuracy
            </h3>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-black text-white font-mono">
                {streamer.matchScore}%
              </span>
              <span className="text-[10px] text-plasma font-black font-mono mb-1">
                Elite Match
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-plasma shadow-[0_0_8px_rgba(45,212,191,0.4)]"
                style={{ width: `${streamer.matchScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Intelligence / Metrics */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="hud-card p-6 hud-border-plasma flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-plasma/10 flex items-center justify-center border border-plasma/20">
                <Users className="w-6 h-6 text-plasma" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">
                  Average Reach
                </p>
                <p className="text-2xl font-black text-white font-mono">
                  {streamer.avgViewers}
                </p>
              </div>
            </div>
            <div className="hud-card p-6 hud-border-pulse flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-pulse/10 flex items-center justify-center border border-pulse/20">
                <TrendingUp className="w-6 h-6 text-pulse" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">
                  Growth Signal
                </p>
                <p className="text-2xl font-black text-white font-mono">
                  Strong
                </p>
              </div>
            </div>
          </div>

          <div className="hud-card p-10 hud-border-plasma space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
              <BarChart3 className="w-40 h-40 text-plasma" />
            </div>
            <div className="relative z-10 space-y-6">
              <h3 className="font-mono font-black text-white uppercase tracking-widest text-sm flex items-center gap-2">
                <Target className="w-5 h-5 text-plasma" /> Strategic Fit
                Analysis
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                {streamer.reason}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-plasma uppercase tracking-widest font-mono flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" /> Acquisition Triggers
                  </h4>
                  <ul className="space-y-3">
                    {[
                      "High audience overlap",
                      "Verified conversion",
                      "Clean content style",
                    ].map((t) => (
                      <li
                        key={t}
                        className="flex items-center gap-3 text-xs text-slate-300 font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-plasma/50" />{" "}
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-pulse uppercase tracking-widest font-mono flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Best Contact Channel
                  </h4>
                  <div className="p-4 bg-carbon/50 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
                    {isSimulated ? (
                      <div className="space-y-1 animate-in fade-in zoom-in duration-300">
                        <p className="text-plasma">
                          DIRECT_UP_LINK:{" "}
                          {streamer.name.toLowerCase().replace(" ", ".")}
                          @creator-hub.com
                        </p>
                        <p className="opacity-70 text-[9px]">
                          Discord ID: {streamer.name.replace(" ", "")}#0001
                        </p>
                      </div>
                    ) : (
                      "Contact data locked: upgrade to full Launch Kit to view email and socials."
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 hud-card bg-linear-to-r from-plasma/10 to-transparent border-plasma/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-white font-black font-mono uppercase tracking-tight text-lg">
                Deploy a Campaign with {streamer.name}?
              </p>
              <p className="text-slate-400 text-sm">
                Our AI can draft a custom pitch deck tailored them.
              </p>
            </div>
            <button className="px-8 py-4 bg-plasma text-carbon font-black font-mono rounded-xl shadow-lg hover:scale-105 transition-all cursor-pointer uppercase tracking-widest text-xs whitespace-nowrap">
              Draft Pitch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

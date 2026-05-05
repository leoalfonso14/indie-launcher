"use client";

import React, { useState } from "react";
import {
  Play,
  Upload,
  AlertTriangle,
  CheckCircle,
  Zap,
  TrendingUp,
  BarChart3,
  Video,
  Target,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api-config";

export default function TrailerPage() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (isFull: boolean = false) => {
    if (!url) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/analyze-trailer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, simulate: true, isFullAudit: isFull }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze trailer. Check if backend is running.");
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* HUD Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pulse/10 border border-pulse/20 text-[10px] font-black text-pulse uppercase tracking-[0.2em] font-mono">
            <Sparkles className="w-3 h-3" />
            AI Analysis Active
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white font-mono">
            TRAILER <span className="text-pulse">AUDIT</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl font-medium">
            Deploy Vision-AI to scan your hook strength and retention probability.
          </p>
        </div>

        <div className="flex items-center gap-4 hud-card hud-border-pulse px-6 py-3 rounded-2xl">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">Avg Score</p>
            <p className="text-2xl font-black text-white font-mono">84.2<span className="text-pulse text-xs">%</span></p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-pulse/30 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-pulse" />
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="hud-card p-8 hud-border-plasma relative overflow-hidden group">
        <div className="relative z-10 space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-plasma uppercase tracking-[0.3em] font-mono block">
              Trailer URL (YouTube/MP4)
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 bg-carbon/50 border border-slate-800 rounded-2xl py-4 px-6 text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-plasma/50 transition-all placeholder:text-slate-600 shadow-inner"
              />
              <button
                onClick={() => handleAnalyze(false)}
                disabled={isAnalyzing || !url}
                className="px-8 py-4 bg-plasma text-carbon font-black font-mono rounded-2xl shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 uppercase tracking-widest text-xs cursor-pointer"
              >
                {isAnalyzing ? (
                  <><Zap className="w-4 h-4 animate-pulse" /> Scanning...</>
                ) : (
                  <><Zap className="w-4 h-4" /> Start Audit</>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-slate-600 font-mono text-[9px] font-black uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            Analysis Engine Active
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800 ml-4" />
            Latency: 12ms
          </div>
        </div>
      </div>

      {error && (
        <div className="p-6 hud-card border-red-500/30 bg-red-500/5 text-red-400 font-mono text-xs flex items-center gap-4 animate-in fade-in zoom-in duration-300">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-black uppercase tracking-widest">Analysis Error</p>
            <p className="opacity-70">{error}</p>
          </div>
        </div>
      )}

      {/* Results Section */}
      {analysisResult && (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Score Card */}
            <div className="hud-card p-10 hud-border-pulse flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-pulse/5 animate-pulse" />
              <div className="relative z-10 space-y-2">
                <p className="text-[10px] font-black text-pulse uppercase tracking-[0.4em] font-mono">Hook Score</p>
                <div className="text-8xl font-black text-white font-mono tracking-tighter">
                  {analysisResult.hookScore}
                </div>
                <div className="inline-flex px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black font-mono uppercase tracking-widest">
                  Excellent Signal
                </div>
              </div>
            </div>

            {/* Retention Heatmap (Vision Visualization) */}
            <div className="lg:col-span-2 hud-card p-10 hud-border-plasma space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="font-mono font-black text-white uppercase tracking-wider text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-plasma" /> Retention probability
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">AI Intensity scan over 40s timeline</p>
                </div>
                {!analysisResult.isFullAudit && (
                  <button 
                    onClick={() => handleAnalyze(true)}
                    className="px-4 py-2 bg-pulse/10 border border-pulse/20 text-pulse text-[9px] font-black font-mono rounded-lg hover:bg-pulse hover:text-carbon transition-all uppercase tracking-widest cursor-pointer"
                  >
                    Unlock Full Analysis
                  </button>
                )}
              </div>
              
              <div className="h-48 flex items-end gap-1 group/heatmap">
                {analysisResult.heatmapData.map((val: number, i: number) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-t-sm transition-all duration-500 relative group",
                      val > 0 ? (val > 70 ? "bg-plasma shadow-[0_0_10px_rgba(45,212,191,0.4)]" : "bg-plasma/40") : "bg-slate-900"
                    )}
                    style={{ height: `${Math.max(val, 5)}%` }}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-carbon border border-slate-700 px-2 py-1 rounded text-[8px] font-mono text-white whitespace-nowrap z-50">
                      {i}s: {val}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[8px] font-black text-slate-600 font-mono uppercase tracking-[0.4em]">
                <span>0:00</span>
                <span>0:20</span>
                <span>0:40</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Highlights */}
            <div className="hud-card p-10 hud-border-plasma space-y-8">
              <h3 className="font-mono font-black text-plasma uppercase tracking-widest text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Positive Signals
              </h3>
              <ul className="space-y-6">
                {analysisResult.highlights.map((h: string, i: number) => (
                  <li key={i} className="flex gap-4 group">
                    <div className="w-6 h-6 rounded-lg bg-plasma/10 border border-plasma/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-3 h-3 text-plasma" />
                    </div>
                    <p className="text-sm text-slate-300 font-medium leading-relaxed">{h}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="hud-card p-10 hud-border-pulse space-y-8">
              <h3 className="font-mono font-black text-pulse uppercase tracking-widest text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Retention Improvements
              </h3>
              <ul className="space-y-6">
                {analysisResult.improvements.map((imp: string, i: number) => (
                  <li key={i} className="flex gap-4 group">
                    <div className="w-6 h-6 rounded-lg bg-pulse/10 border border-pulse/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <AlertTriangle className="w-3 h-3 text-pulse" />
                    </div>
                    <div>
                      <p className={cn(
                        "text-sm font-medium leading-relaxed",
                        imp.includes("Upgrade") ? "text-slate-500 italic" : "text-slate-300"
                      )}>
                        {imp}
                      </p>
                      {imp.includes("Upgrade") && (
                        <button 
                          onClick={() => handleAnalyze(true)}
                          className="mt-3 text-[10px] font-black text-pulse hover:underline font-mono uppercase tracking-widest cursor-pointer"
                        >
                          Unlock Full Analysis
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

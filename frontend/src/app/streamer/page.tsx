"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Search,
  Target,
  Trophy,
  ExternalLink,
  Lock,
  Zap,
  TrendingUp,
  Video,
  Monitor,
  Filter,
  Loader2,
  ChevronDown,
  Sparkles,
  X,
  RotateCcw,
  Users,
} from "lucide-react";

import { API_BASE_URL } from "@/lib/api-config";

interface Streamer {
  id: string;
  name: string;
  platform: "twitch" | "youtube";
  matchScore: number;
  conversionPotential: "High" | "Medium" | "Low";
  tags: string[];
  avgViewers: string;
  isLocked: boolean;
  reason: string;
  slug: string;
  email?: string;
  discord?: string;
  twitter?: string;
}

type PlatformType = "all" | "twitch" | "youtube";
type SortOption =
  | "score-desc"
  | "score-asc"
  | "reach-desc"
  | "reach-asc"
  | "name-asc";

function StreamerSniperContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialGenre = searchParams.get("genre") || "All";
  const initialSearch = searchParams.get("search") || "";
  const initialPlatform =
    (searchParams.get("platform") as PlatformType) || "all";
  const initialMinScore = parseInt(searchParams.get("minScore") || "0");
  const initialContact = searchParams.get("contact") === "true";
  const initialMinReach = parseInt(searchParams.get("minReach") || "0");
  const initialSort = (searchParams.get("sort") as SortOption) || "score-desc";

  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [genre, setGenre] = useState(initialGenre);
  const [totalVetted, setTotalVetted] = useState(0);
  const [availableGenres, setAvailableGenres] = useState<string[]>([
    "All",
    "Roguelike",
    "Metroidvania",
    "Cozy / Farm Sim",
    "Strategy / Sim",
    "Deckbuilder",
    "Soulslike / Action",
    "Horror",
    "Puzzle / Brain",
  ]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isSimulated, setIsSimulated] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filter States (Premium only)
  const [showFilters, setShowFilters] = useState(false);
  const [platformFilter, setPlatformFilter] =
    useState<PlatformType>(initialPlatform);
  const [minScore, setMinScore] = useState(initialMinScore);
  const [hasContactFilter, setHasContactFilter] = useState(initialContact);
  const [minReach, setMinReach] = useState(initialMinReach);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (genre !== "All") params.set("genre", genre);
    if (searchQuery) params.set("search", searchQuery);
    if (platformFilter !== "all") params.set("platform", platformFilter);
    if (minScore > 0) params.set("minScore", minScore.toString());
    if (hasContactFilter) params.set("contact", "true");
    if (minReach > 0) params.set("minReach", minReach.toString());
    if (sortBy !== "score-desc") params.set("sort", sortBy);

    const queryString = params.toString();
    const url = `/streamer${queryString ? `?${queryString}` : ""}`;
    router.replace(url, { scroll: false });
  }, [
    genre,
    searchQuery,
    platformFilter,
    minScore,
    hasContactFilter,
    minReach,
    sortBy,
    router,
  ]);

  const parseReach = (val: string) => {
    if (!val) return 0;
    const clean = val
      .toLowerCase()
      .replace(/,/g, "")
      .replace(/\+/g, "")
      .replace("avg", "")
      .trim();
    if (clean.includes("k subs")) return parseFloat(clean) * 1000;
    if (clean.includes("m subs")) return parseFloat(clean) * 1000000;
    if (clean.includes("k")) return parseFloat(clean) * 1000;
    if (clean.includes("m")) return parseFloat(clean) * 1000000;
    return parseInt(clean) || 0;
  };

  const fetchStreamers = useCallback(
    async (selectedGenre: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/match-streamers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            genre: selectedGenre,
            isFullAccess: isSimulated,
          }),
        });
        const data = await response.json();

        // Safety check: ensure we have data before setting state
        if (data && data.streamers) {
          setStreamers(data.streamers);
          if (data.totalVetted) setTotalVetted(data.totalVetted);
          if (data.availableGenres) setAvailableGenres(data.availableGenres);
        } else {
          console.warn("Backend returned empty or malformed data:", data);
          setStreamers([]);
        }
      } catch (error) {
        console.error("Failed to fetch streamers:", error);
        // Optional: Set a hardcoded fallback here if we want to be ultra-safe
      } finally {
        setLoading(false);
      }
    },
    [isSimulated],
  );

  useEffect(() => {
    let ignore = false;
    Promise.resolve().then(() => {
      if (!ignore) fetchStreamers(genre);
    });
    return () => {
      ignore = true;
    };
  }, [fetchStreamers, genre, refreshKey]);

  const handleGenreChange = (newGenre: string) => {
    setLoading(true);
    setGenre(newGenre);
  };

  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey((prev) => prev + 1);
  };

  const clearAllFilters = () => {
    setPlatformFilter("all");
    setMinScore(0);
    setHasContactFilter(false);
    setMinReach(0);
    setSearchQuery("");
  };

  const handleToggleSimulated = () => {
    setLoading(true);
    setIsSimulated((prev) => !prev);
    if (isSimulated) {
      clearAllFilters();
      setShowFilters(false);
    }
  };

  const filteredStreamers = streamers
    .filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPlatform =
        platformFilter === "all" || s.platform === platformFilter;
      const matchesScore = s.matchScore >= minScore;
      const isReal = (val?: string) =>
        val &&
        val !== "Discovery Pending" &&
        val !== "Verified in Launch Kit" &&
        val !== "Unknown";

      const matchesContact =
        !hasContactFilter ||
        isReal(s.email) ||
        isReal(s.discord) ||
        isReal(s.twitter);
      const matchesReach = parseReach(s.avgViewers) >= minReach;
      return (
        matchesSearch &&
        matchesPlatform &&
        matchesScore &&
        matchesContact &&
        matchesReach
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score-desc":
          return b.matchScore - a.matchScore;
        case "score-asc":
          return a.matchScore - b.matchScore;
        case "reach-desc":
          return parseReach(b.avgViewers) - parseReach(a.avgViewers);
        case "reach-asc":
          return parseReach(a.avgViewers) - parseReach(b.avgViewers);
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plasma/10 border border-plasma/20 text-[10px] font-bold text-plasma uppercase tracking-widest mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-plasma animate-pulse" />
            Streamer Discovery
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white font-mono">
            STREAMER <span className="text-plasma">SNIPER</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl font-medium">
            Find creators whose audience already loves games like yours.
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3 bg-carbon-light px-4 py-2 rounded-2xl border border-slate-800 shadow-inner">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono cursor-default">
              Simulate Full Access
            </span>
            <button
              onClick={handleToggleSimulated}
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
          <div className="flex items-center gap-3 hud-card hud-border-plasma px-4 py-2 rounded-2xl">
            <TrendingUp className="w-4 h-4 text-plasma" />
            <span className="text-xs font-bold text-ghost uppercase tracking-wider font-mono">
              <span className="text-plasma">
                {totalVetted > 0 ? totalVetted : "..."}
              </span>{" "}
              vetted leads
            </span>
          </div>
        </div>
      </div>

      {/* Genre Selector */}
      <div className="flex flex-wrap gap-2 p-1 bg-carbon-light/50 rounded-2xl border border-slate-800/50">
        {availableGenres.map((g) => (
          <button
            key={g}
            onClick={() => handleGenreChange(g)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all border font-mono tracking-tight cursor-pointer",
              genre === g
                ? "bg-plasma text-carbon border-plasma shadow-[0_0_12px_rgba(45,212,191,0.2)]"
                : "bg-transparent text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5",
            )}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Control Bar */}
      <div className="space-y-4">
        <div className="hud-card p-4 flex flex-col md:flex-row gap-4 items-center hud-border-plasma">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or tags..."
              className="w-full bg-carbon/50 border border-slate-800 rounded-xl py-3 pl-12 pr-10 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-plasma/50 transition-all placeholder:text-slate-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-3 h-3 text-slate-500" />
              </button>
            )}
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black font-mono bg-carbon-light hover:bg-slate-800 text-white border border-slate-700 cursor-pointer appearance-none outline-none focus:ring-1 focus:ring-plasma/50 tracking-wider"
              >
                <option value="score-desc">Score ↓</option>
                <option value="score-asc">Score ↑</option>
                <option value="reach-desc">Reach ↓</option>
                <option value="reach-asc">Reach ↑</option>
                <option value="name-asc">Name A-Z</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
            </div>

            <div className="relative group flex-1 md:flex-none">
              <button
                onClick={() => isSimulated && setShowFilters(!showFilters)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold font-mono transition-all border tracking-wide",
                  !isSimulated
                    ? "bg-carbon-light/50 text-slate-600 border-slate-800 cursor-not-allowed"
                    : "bg-carbon-light hover:bg-slate-800 text-white border-slate-700 cursor-pointer",
                  showFilters && "bg-slate-800 border-plasma/50",
                )}
              >
                {!isSimulated ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <Filter className="w-3.5 h-3.5" />
                )}
                Filters
                {isSimulated && (
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform",
                      showFilters && "rotate-180",
                    )}
                  />
                )}
              </button>

              {!isSimulated && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 hud-card border-pulse/30 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-center">
                  <p className="text-[10px] font-black text-pulse uppercase mb-1 flex items-center justify-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Pro Feature
                  </p>
                  <p className="text-[10px] text-slate-400 leading-tight font-mono">
                    Advanced filters are available on the Launch Kit plan.
                  </p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-850" />
                </div>
              )}
            </div>

            <button
              onClick={handleRefresh}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-plasma hover:bg-plasma/90 text-carbon rounded-xl text-xs font-black font-mono shadow-[0_0_15px_rgba(45,212,191,0.15)] transition-all tracking-wide active:scale-95 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Target className="w-4 h-4" />
              )}
              Refresh
            </button>
          </div>
        </div>

        {/* Premium Filter Drawer */}
        {isSimulated && showFilters && (
          <div className="hud-card p-8 hud-border-plasma animate-in slide-in-from-top-2 duration-300 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-plasma uppercase tracking-widest flex items-center gap-2 font-mono">
                  <Monitor className="w-3 h-3" /> Platform
                </label>
                <div className="flex gap-2">
                  {(["all", "twitch", "youtube"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatformFilter(p)}
                      className={cn(
                        "flex-1 py-3 rounded-lg text-[10px] font-black border transition-all uppercase font-mono tracking-wider cursor-pointer",
                        platformFilter === p
                          ? "bg-plasma/10 border-plasma text-plasma shadow-[0_0_10px_rgba(45,212,191,0.1)]"
                          : "bg-carbon/50 border-slate-800 text-slate-500 hover:border-slate-700",
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-plasma uppercase tracking-widest flex items-center gap-2 font-mono">
                    <Sparkles className="w-3 h-3" /> Min. Match Score
                  </label>
                  <span className="text-xs font-black text-plasma font-mono">
                    {minScore}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="99"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-plasma"
                />
                <div className="flex justify-between text-[8px] text-slate-600 font-mono">
                  <span>All</span>
                  <span>Elite only</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-plasma uppercase tracking-widest flex items-center gap-2 font-mono">
                    <Users className="w-3 h-3" /> Min. Reach
                  </label>
                  <span className="text-xs font-black text-plasma font-mono">
                    {minReach >= 1000
                      ? `${(minReach / 1000).toFixed(0)}k+`
                      : minReach}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={minReach}
                  onChange={(e) => setMinReach(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-plasma"
                />
                <div className="flex justify-between text-[8px] text-slate-600 font-mono">
                  <span>0</span>
                  <span>100k+</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-plasma uppercase tracking-widest flex items-center gap-2 font-mono">
                  <Zap className="w-3 h-3" /> Contact Availability
                </label>
                <button
                  onClick={() => setHasContactFilter(!hasContactFilter)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border transition-all font-mono text-[10px] uppercase tracking-widest cursor-pointer",
                    hasContactFilter
                      ? "bg-plasma/10 border-plasma text-plasma shadow-[0_0_10px_rgba(45,212,191,0.1)]"
                      : "bg-carbon/50 border-slate-800 text-slate-500 hover:border-slate-700",
                  )}
                >
                  Has Contact Info Only
                  <div
                    className={cn(
                      "w-8 h-4 rounded-full relative transition-colors border",
                      hasContactFilter
                        ? "bg-plasma border-plasma"
                        : "bg-slate-900 border-slate-700",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all",
                        hasContactFilter ? "left-4.5" : "left-0.5",
                      )}
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-800/50">
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-slate-500 hover:text-plasma transition-colors group font-mono tracking-widest cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 group-hover:-rotate-90deg transition-transform" />
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Streamer Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-plasma animate-spin" />
            <Target className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-plasma/50" />
          </div>
          <p className="text-plasma/60 font-mono text-[10px] font-black tracking-[0.3em] uppercase animate-pulse">
            Scanning Social Frequency...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStreamers.length === 0 ? (
            <div className="col-span-full py-24 hud-card text-center space-y-6 border-dashed opacity-50">
              <div className="w-16 h-16 bg-carbon rounded-2xl flex items-center justify-center mx-auto border border-slate-800">
                <Search className="w-6 h-6 text-slate-700" />
              </div>
              <div className="space-y-2">
                <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">
                  No results
                </p>
                <p className="text-slate-600 text-[10px] font-medium">
                  No streamers match your current filters.
                </p>
              </div>
              <button
                onClick={clearAllFilters}
                className="text-plasma text-[10px] font-black font-mono hover:underline tracking-widest uppercase cursor-pointer"
              >
                Reset Frequency
              </button>
            </div>
          ) : (
            filteredStreamers.map((streamer) => (
              <div
                key={streamer.id}
                className={cn(
                  "hud-card overflow-hidden group transition-all duration-500",
                  streamer.isLocked
                    ? "hud-border-pulse grayscale-[0.8] opacity-70"
                    : "hud-border-plasma hover:-translate-y-1",
                )}
              >
                <div className="p-6 space-y-5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner border transition-all duration-500 group-hover:scale-110",
                          streamer.platform === "twitch"
                            ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                            : "bg-red-500/10 border-red-500/20 text-red-500",
                        )}
                      >
                        {streamer.platform === "twitch" ? (
                          <Monitor className="w-7 h-7" />
                        ) : (
                          <Video className="w-7 h-7" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-mono font-black text-white text-sm group-hover:text-plasma transition-colors tracking-tight">
                          {streamer.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                          <p className="text-[9px] text-slate-500 font-mono tracking-tighter">
                            {streamer.avgViewers.includes("subs")
                              ? streamer.avgViewers
                              : `${streamer.avgViewers}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white font-mono leading-none tracking-tighter">
                        {streamer.matchScore}
                        <span className="text-[10px] text-plasma ml-0.5">
                          %
                        </span>
                      </div>
                      <div className="text-[8px] font-black text-slate-600 uppercase font-mono tracking-widest">
                        ACCURACY
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {streamer.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-carbon border border-slate-800 text-slate-500 text-[8px] font-black font-mono uppercase tracking-wider group-hover:border-plasma/30 group-hover:text-plasma/70 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="bg-carbon/50 rounded-2xl p-4 border border-slate-800/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] font-mono">
                        Conversion Probability
                      </span>
                      <span
                        className={cn(
                          "text-[8px] font-black uppercase font-mono",
                          streamer.conversionPotential === "High"
                            ? "text-plasma"
                            : streamer.conversionPotential === "Medium"
                              ? "text-amber-500"
                              : "text-slate-600",
                        )}
                      >
                        {streamer.conversionPotential}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-1000",
                          streamer.conversionPotential === "High"
                            ? "bg-plasma/70"
                            : streamer.conversionPotential === "Medium"
                              ? "bg-amber-600/60"
                              : "bg-slate-700",
                        )}
                        style={{
                          width:
                            streamer.conversionPotential === "High"
                              ? "90%"
                              : streamer.conversionPotential === "Medium"
                                ? "60%"
                                : "30%",
                        }}
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <p
                      className={cn(
                        "text-[11px] leading-relaxed font-medium",
                        streamer.isLocked
                          ? "text-slate-700 italic blur-[3px]"
                          : "text-slate-400",
                      )}
                    >
                      {streamer.reason}
                    </p>
                    {streamer.isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center gap-2 bg-carbon/90 backdrop-blur-sm px-4 py-2 rounded-full border border-pulse/30 shadow-2xl">
                          <Lock className="w-3 h-3 text-pulse" />
                          <span className="text-[9px] font-black text-white uppercase tracking-widest font-mono">
                            Premium Lead
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      !streamer.isLocked &&
                      router.push(`/profile/${streamer.slug}`)
                    }
                    className={cn(
                      "w-full py-3.5 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-2 tracking-wide cursor-pointer",
                      streamer.isLocked
                        ? "bg-carbon text-slate-600 border border-dashed border-slate-800 hover:border-pulse/50 hover:text-slate-400"
                        : "bg-carbon-light hover:bg-plasma/10 hover:text-plasma hover:border-plasma/40 text-slate-400 border border-slate-800",
                    )}
                  >
                    {streamer.isLocked ? (
                      <>
                        <Zap className="w-3 h-3" />
                        Unlock Lead
                      </>
                    ) : (
                      <>
                        View Profile
                        <ExternalLink className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Bottom CTA for Free Users */}
      {!isSimulated && (
        <div className="hud-card p-12 md:p-20 text-center relative overflow-hidden group hud-border-plasma">
          <div className="absolute inset-0 bg-linear-to-r from-plasma/5 via-transparent to-pulse/5 opacity-50" />
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-3 bg-plasma/10 px-5 py-2 rounded-full border border-plasma/20">
              <Trophy className="w-4 h-4 text-plasma" />
              <span className="text-[10px] font-bold text-plasma uppercase tracking-widest font-mono">
                Ready to Scale
              </span>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-white max-w-2xl mx-auto font-mono tracking-tighter">
                Reach <span className="text-plasma">5,000+</span> vetted
                creators
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto font-medium text-lg">
                Stop guessing. Target creators with proven track records in your
                genre.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <button className="px-10 py-5 bg-plasma text-carbon font-bold rounded-2xl shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:scale-105 transition-all text-sm cursor-pointer">
                Unlock Full Database
              </button>
              <button className="px-10 py-5 bg-carbon-light text-white font-bold rounded-2xl border border-slate-800 hover:bg-slate-800 transition-all text-sm cursor-pointer">
                Compare Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StreamerSniperPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-plasma animate-spin" />
          </div>
        </div>
      }
    >
      <StreamerSniperContent />
    </Suspense>
  );
}

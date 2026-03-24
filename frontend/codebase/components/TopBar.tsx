"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, Zap, Loader2, User, CreditCard, LogOut } from "lucide-react";
import { analyzeRepo } from "@/lib/api";
import { useDashboard } from "@/components/DashboardProvider";

export default function TopBar() {
  const { status, setStatus, repoUrl, setRepoUrl, setResults } = useDashboard();
  const isAnalyzing = status === "analyzing";
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("User");
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.email || "User");
      }
    } catch (e) {
      console.error("Could not parse token", e);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    localStorage.removeItem("token");
    window.location.href = "/login"; // Force full page reload to ensure token is fully cleared and state resets
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    try {
      setStatus("analyzing");
      const data = await analyzeRepo(repoUrl);
      setResults(data);
      setStatus("chat");
    } catch (err: any) {
      console.error(err);
      alert(`Initialization failed: ${err.response?.data?.detail || err.message}`);
      setStatus("idle");
    }
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b border-white/5 bg-[#030305]/80 backdrop-blur-xl px-4 lg:px-6 z-10 sticky top-0">
      <div className="w-full flex-1 flex items-center gap-4 ml-4">
        <form onSubmit={handleAnalyze} className="w-full max-w-2xl hidden md:flex items-center gap-4">
          <div className="relative group w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-cyan-500 transition-colors" />
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="Inject Target GitHub Repository URL..."
              className="w-full appearance-none bg-[#0A0D14] text-gray-300 pl-10 rounded-none border border-[#1E232F] px-4 py-2.5 text-sm font-light outline-none transition-all placeholder:text-gray-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 shadow-inner"
              disabled={isAnalyzing}
            />
          </div>
        
          <button 
            type="submit"
            disabled={isAnalyzing || !repoUrl.trim()}
            className="group relative flex items-center justify-center gap-2 bg-white px-6 py-2.5 text-[11px] font-bold tracking-widest uppercase text-[#030305] hover:bg-gray-200 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed min-w-[170px] overflow-hidden"
          >
            <div className="absolute inset-0 w-1/4 bg-white/40 skew-x-[45deg] -translate-x-[150%] group-hover:translate-x-[500%] transition-transform duration-700"></div>
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#030305]" />
                Initializing
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 text-[#030305]" />
                Commence Scan
              </>
            )}
          </button>
        </form>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full hover:bg-white/5 p-2 text-gray-400 transition-colors focus:outline-none">
          <Bell className="h-5 w-5" />
          <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-500 border-2 border-[#030305]"></div>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="h-9 w-9 overflow-hidden rounded-full border border-gray-700 hover:border-cyan-500 transition-all focus:outline-none focus:border-cyan-500 shadow-sm"
          >
            <div className="h-full w-full bg-[#10131A] text-cyan-500 flex items-center justify-center text-sm font-bold uppercase shadow-inner">
              {userEmail.charAt(0)}
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-60 rounded-none border border-white/10 bg-[#0A0D14]/90 backdrop-blur-xl shadow-2xl py-2 z-50 transform origin-top-right transition-all">
              <div className="px-5 py-4 border-b border-[#1E232F] mb-1">
                <p className="text-sm font-semibold text-white truncate">{userEmail}</p>
                <p className="text-[10px] text-cyan-500 font-mono mt-1 uppercase tracking-widest font-bold">Level 4 Clearance</p>
              </div>
              <div className="py-2">
                <button className="w-full text-left px-5 py-2.5 text-xs tracking-wider uppercase font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" /> Identity Matrix
                </button>
                <button className="w-full text-left px-5 py-2.5 text-xs tracking-wider uppercase font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-gray-500" /> Resource Billing
                </button>
              </div>
              <div className="py-2 mt-1 border-t border-[#1E232F]">
                <button 
                  type="button"
                  onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); handleLogout(); }}
                  className="w-full text-left px-5 py-2.5 text-xs tracking-wider uppercase font-bold text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors flex items-center gap-3"
                >
                  <LogOut className="h-4 w-4 pointer-events-none" /> Terminate Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

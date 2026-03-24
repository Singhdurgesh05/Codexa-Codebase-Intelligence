"use client";

import { useDashboard } from "@/components/DashboardProvider";
import AnalyzingView from "@/components/AnalyzingView";
import ChatView from "@/components/ChatView";
import { Cpu, Network, ShieldCheck } from "lucide-react";

// The Idle UI component
function IdleView() {
  return (
    <div className="flex flex-col min-h-full bg-transparent px-4 py-16 lg:py-24 relative overflow-y-auto overflow-x-hidden">
      
      {/* Background glow specific to core */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full flex flex-col items-center relative z-10">
        
        {/* Central Engine Core */}
        <div className="mb-12 relative group">
          <div className="absolute inset-0 bg-rose-500 rounded-2xl blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-[#10131A] to-[#0A0D14] border border-[#1E232F] flex items-center justify-center relative z-10 shadow-2xl skew-y-3 transform-gpu group-hover:skew-y-0 transition-transform duration-500 cursor-crosshair">
            <Cpu className="h-10 w-10 text-rose-500 drop-shadow-[0_0_15px_rgba(255,51,102,0.5)]" />
            <div className="absolute -inset-0 border border-rose-500/30 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 rounded-2xl"></div>
          </div>
        </div>

        {/* Hero Text */}
        <h1 className="font-[family-name:var(--font-syne)] text-4xl md:text-6xl font-extrabold tracking-tight text-center mb-6 max-w-3xl leading-tight">
          <span className="text-white block mb-2">Initialize Architecture</span>
          <span className="bg-gradient-to-r from-gray-200 via-rose-100 to-rose-500 bg-clip-text text-transparent">
            Semantic Extractor.
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl text-center max-w-2xl mb-20 font-light">
          Input a valid repository URL into the top console to begin high-dimensional vector ingestion and architectural mapping.
        </p>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
          <div className="group bg-gradient-to-b from-[#10131A] to-[#0A0D14] border border-white/5 rounded-none p-8 hover:border-white/20 transition-all cursor-default">
            <div className="mb-6">
              <Network className="h-8 w-8 text-cyan-500 group-hover:scale-110 transition-transform origin-left" />
            </div>
            <h3 className="text-white font-bold text-base tracking-wide uppercase mb-3 text-[13px]">Deep Semantics</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-light font-[family-name:var(--font-jb-mono)]">
              Extracts context and syntax trees, bypassing superficial string matching entirely.
            </p>
          </div>

          <div className="group bg-gradient-to-b from-[#10131A] to-[#0A0D14] border border-white/5 rounded-none p-8 hover:border-white/20 transition-all cursor-default">
            <div className="mb-6">
              <ShieldCheck className="h-8 w-8 text-rose-500 group-hover:scale-110 transition-transform origin-left" />
            </div>
            <h3 className="text-white font-bold text-base tracking-wide uppercase mb-3 text-[13px]">Structural Audits</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-light font-[family-name:var(--font-jb-mono)]">
              Proactively visualizes software dependencies and cyclical bottlenecks automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { status } = useDashboard();

  if (status === "analyzing") {
    return <AnalyzingView />;
  }

  if (status === "chat") {
    return <ChatView />;
  }

  return <IdleView />;
}

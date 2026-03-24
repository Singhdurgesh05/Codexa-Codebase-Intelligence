"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "./DashboardProvider";
import { Check, Network, Database, BrainCircuit, Terminal, Hexagon } from "lucide-react";

export default function AnalyzingView() {
  const { repoUrl } = useDashboard();
  const repoName = repoUrl.split("/").pop()?.replace(".git", "") || "Target_Repository";
  
  const [progress, setProgress] = useState(68);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => (p < 99 ? p + 2 : p));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-300 w-full max-w-6xl mx-auto px-4 py-8 relative">
      
      {/* Background glow specific to core */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Header section */}
      <div className="mb-10 relative z-10">
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-rose-500 mb-4 uppercase font-[family-name:var(--font-jb-mono)]">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
          Signal Lock: 7F3A9E2
        </div>
        <h1 className="font-[family-name:var(--font-syne)] text-4xl font-extrabold tracking-tight text-white mb-3 capitalize">
          Ingesting {repoName}
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl font-light">
          Engine kinetic process initialized. Extracting semantic architecture and structural dependencies for high-dimensional vector mapping.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1 relative z-10">
        
        {/* Left main panel: Stepper */}
        <div className="col-span-2 bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 p-8 shadow-2xl relative overflow-hidden">
          {/* Step 1 */}
          <div className="flex gap-6 mb-8 relative">
            <div className="absolute left-[20px] top-[48px] bottom-[-32px] w-[1px] bg-rose-500/20"></div>
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center bg-rose-500/10 text-rose-500 border border-rose-500/30">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-rose-500 mb-1 uppercase font-[family-name:var(--font-jb-mono)]">Phase 01</div>
              <h3 className="text-xl font-bold text-white mb-1">Cloning Repository</h3>
              <p className="text-gray-500 font-[family-name:var(--font-jb-mono)] text-xs">{repoUrl || "github.com/org/alpha-core.git"} [42.8 MB]</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6 mb-8 relative">
            <div className="absolute left-[20px] top-[48px] bottom-[-32px] w-[1px] bg-cyan-500/20"></div>
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Network className="h-5 w-5" />
            </div>
            <div className="w-full">
              <div className="text-[10px] font-bold tracking-widest text-cyan-400 mb-1 uppercase font-[family-name:var(--font-jb-mono)]">Phase 02</div>
              <div className="flex justify-between items-end mb-2">
                <h3 className="text-xl font-bold text-white">Parsing AST Nodes</h3>
                <span className="text-cyan-400 font-[family-name:var(--font-jb-mono)] text-xs font-bold">{progress}%</span>
              </div>
              
              <div className="h-1 w-full bg-[#1E232F] overflow-hidden mb-3">
                <div 
                  className="h-full bg-cyan-500 transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-gray-600 font-[family-name:var(--font-jb-mono)] text-[10px] uppercase">Digesting: src/core/engine_v2.ts ...</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6 mb-8 relative">
            <div className="absolute left-[20px] top-[48px] bottom-[-32px] w-[1px] bg-[#1E232F]"></div>
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center bg-[#10131A] text-gray-600 border border-[#1E232F]">
              <Database className="h-5 w-5" />
            </div>
            <div className="w-full opacity-50">
              <div className="text-[10px] font-bold tracking-widest text-gray-500 mb-1 uppercase font-[family-name:var(--font-jb-mono)]">Phase 03</div>
              <h3 className="text-xl font-bold text-white mb-1">Embedding High-D Vectors</h3>
              <p className="text-gray-500 font-[family-name:var(--font-jb-mono)] text-[10px] uppercase">Awaiting chunk sequence...</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-6">
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center bg-[#10131A] text-gray-600 border border-[#1E232F]">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div className="w-full opacity-50">
              <div className="text-[10px] font-bold tracking-widest text-gray-500 mb-1 uppercase font-[family-name:var(--font-jb-mono)]">Phase 04</div>
              <h3 className="text-xl font-bold text-white mb-1">Compiling Semantic Map</h3>
              <p className="text-gray-500 font-[family-name:var(--font-jb-mono)] text-[10px] uppercase">Queue position: 1</p>
            </div>
          </div>
        </div>

        {/* Right panels */}
        <div className="col-span-1 flex flex-col gap-6">
          {/* Logs */}
          <div className="bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 p-5 h-64 overflow-hidden flex flex-col font-[family-name:var(--font-jb-mono)] text-[11px]">
            <div className="flex justify-between items-center mb-4 border-b border-[#1E232F] pb-3 text-gray-500">
              <div className="font-bold tracking-widest uppercase">System Terminal</div>
              <div className="text-rose-500 flex items-center gap-2 font-bold uppercase">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                Stream
              </div>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto text-gray-400 pb-2">
              <div><span className="text-gray-600">[0.00s]</span> Init remote fetch...</div>
              <div className="text-cyan-400"><span className="text-gray-600">[0.41s]</span> Git clone: OK</div>
              <div><span className="text-gray-600">[0.42s]</span> Starting AST walker...</div>
              <div><span className="text-gray-600">[1.13s]</span> Tokenizing 482 files...</div>
              <div className="text-rose-400"><span className="text-gray-600">[2.14s]</span> Map module: @auth/provider</div>
              <div className="text-rose-400"><span className="text-gray-600">[3.45s]</span> Map module: @db/schema</div>
              <div className="animate-pulse opacity-50"><span className="text-gray-600">[...]</span> Scanning dependencies...</div>
            </div>
          </div>

          {/* Hardware status */}
          <div className="bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 p-6">
            <div className="font-bold tracking-widest uppercase text-gray-500 mb-6 text-[10px] font-[family-name:var(--font-jb-mono)] border-b border-[#1E232F] pb-3">Node Cluster Status</div>
            
            <div className="mb-6">
              <div className="flex justify-between text-[11px] text-gray-400 mb-2 font-[family-name:var(--font-jb-mono)] uppercase">
                <span>Core Load</span>
                <span className="text-rose-400">42.4%</span>
              </div>
              <div className="h-1 w-full bg-[#1E232F] overflow-hidden">
                <div className="h-full bg-rose-500 w-[42.4%] shadow-[0_0_10px_rgba(255,51,102,0.5)]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-gray-400 mb-2 font-[family-name:var(--font-jb-mono)] uppercase">
                <span>VRAM (64GB)</span>
                <span className="text-cyan-400">18.9GB</span>
              </div>
              <div className="h-1 w-full bg-[#1E232F] overflow-hidden">
                <div className="h-full bg-cyan-500 w-[30%] shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

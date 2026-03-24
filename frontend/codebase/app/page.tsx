"use client";

import Link from "next/link";
import { ArrowRight, Terminal, Network, Shield, Cpu, Code2, Grid, Hexagon } from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#030305] text-gray-200 overflow-hidden relative selection:bg-rose-500/30 selection:text-white pb-32">
      
      {/* Hardware / Cyber Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Dynamic Glow Mesh */}
      {isMounted && (
        <div 
          className="fixed inset-0 z-0 pointer-events-none opacity-50 transition-transform duration-100 ease-out"
          style={{
            background: `
              radial-gradient(circle 800px at ${mousePos.x}px ${mousePos.y}px, rgba(255, 51, 102, 0.06), transparent 50%), 
              radial-gradient(circle 600px at ${window.innerWidth - mousePos.x}px ${window.innerHeight - mousePos.y}px, rgba(0, 240, 255, 0.04), transparent 50%)
            `
          }}
        />
      )}

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Hexagon className="h-6 w-6 text-rose-500 fill-rose-500/20" />
          <span className="font-[family-name:var(--font-syne)] font-bold text-xl tracking-wide uppercase text-white">Codexa</span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-sm font-semibold tracking-wide text-gray-400 hover:text-white transition-colors">SignIn</Link>
          <Link 
             href="/dashboard"
             className="relative overflow-hidden group px-6 py-2.5 rounded-none border border-white/20 hover:border-white/60 transition-colors bg-white/5 backdrop-blur-md"
          >
            <span className="relative z-10 text-xs font-bold tracking-widest uppercase text-white">Enter Console</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 mt-20 lg:mt-32">
        {/* Section: Hero */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 mb-8 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-rose-400 font-[family-name:var(--font-jb-mono)]">System v2.4 Online</span>
            </div>
            
            <h1 className="font-[family-name:var(--font-syne)] text-5xl sm:text-7xl lg:text-[84px] font-extrabold leading-[1.05] tracking-tight text-white mb-8">
              Understand <br/>
              <span className="bg-gradient-to-r from-white via-rose-100 to-rose-500 bg-clip-text text-transparent">Complex Systems.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 max-w-xl leading-relaxed mb-12 font-light">
              We ingest your raw code repositories and synthesize deep architectural intelligence. Complete semantic vector maps for modern engineering teams.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto font-[family-name:var(--font-jb-mono)]">
              <Link 
                href="/dashboard"
                className="group relative flex items-center justify-center gap-4 bg-white text-black px-8 py-4 text-sm font-bold tracking-wider uppercase hover:bg-gray-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                Start Analysis
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/login"
                className="group flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold tracking-wider uppercase border border-gray-800 hover:border-gray-500 bg-[#0A0D14]/80 text-white transition-all backdrop-blur-sm"
              >
                <Terminal className="h-4 w-4 text-rose-500" />
                Documentation
              </Link>
            </div>
          </div>

          {/* Abstract Data Visual */}
          <div className="relative h-[400px] lg:h-[600px] w-full hidden sm:flex items-center justify-center">
            {/* Inner rings and glowing components mimicking an AI core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[300px] w-[300px] rounded-full border border-white/5 border-dashed animate-[spin_60s_linear_infinite]"></div>
              <div className="absolute h-[200px] w-[200px] rounded-full border border-rose-500/20 animate-[spin_40s_linear_infinite_reverse]"></div>
              <div className="absolute h-32 w-32 bg-rose-500/5 rounded-full blur-3xl"></div>
              
              {/* Central Core Element */}
              <div className="absolute h-24 w-24 bg-gradient-to-br from-[#10131A] to-[#0A0D14] border border-gray-800 flex items-center justify-center transform hover:scale-105 transition-transform duration-500 cursor-crosshair group shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                 <Cpu className="h-8 w-8 text-gray-500 group-hover:text-rose-500 transition-colors" />
                 <div className="absolute -inset-0 border border-rose-500/50 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></div>
              </div>

              {/* Orbiting nodes */}
              <div className="absolute h-2 w-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,1)] translate-x-[150px] animate-pulse"></div>
              <div className="absolute h-2 w-2 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(255,51,102,1)] -translate-x-[100px] translate-y-[100px] animate-pulse delay-300"></div>
            </div>

            {/* Floating Terminal Snippet */}
            <div className="absolute bottom-10 right-0 bg-[#05070A]/80 backdrop-blur-xl border border-[#1E232F] p-5 w-64 shadow-2xl skew-y-3 transform-gpu">
              <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-3 border-b border-[#1E232F] pb-2 font-[family-name:var(--font-jb-mono)]">System.Log</div>
              <div className="font-[family-name:var(--font-jb-mono)] text-[11px] text-gray-400 space-y-1">
                <div className="flex gap-2"><span className="text-rose-500">❯</span> <span>init engine_core</span></div>
                <div className="flex gap-2"><span className="text-rose-500">❯</span> <span>embedding vectors...</span></div>
                <div className="flex gap-2"><span className="text-green-500">✔</span> <span className="text-gray-300">synapse connected</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Features */}
        <section className="mt-32 lg:mt-48">
          <div className="max-w-xl mb-16">
            <h2 className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-white mb-6">
              Surgical precision applied to raw syntax.
            </h2>
            <p className="text-gray-400 font-light">
              We extract high-dimensional semantic meaning from thousands of files, rendering a clean interface to explore and interrogate your software.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-gradient-to-b from-[#10131A] to-[#0A0D14] p-8 border border-white/5 hover:border-white/20 transition-all">
               <Network className="h-8 w-8 text-blue-500 mb-6 group-hover:scale-110 transition-transform origin-left" />
               <h3 className="font-bold text-white tracking-wide mb-3">Architectural Maps</h3>
               <p className="text-sm text-gray-400 leading-relaxed font-light">
                 Visualizes deep cyclical dependencies and modular structure automatically upon instantiation.
               </p>
            </div>
            
            <div className="group bg-gradient-to-b from-[#10131A] to-[#0A0D14] p-8 border border-white/5 hover:border-white/20 transition-all">
               <Code2 className="h-8 w-8 text-rose-500 mb-6 group-hover:scale-110 transition-transform origin-left" />
               <h3 className="font-bold text-white tracking-wide mb-3">AST Embeddings</h3>
               <p className="text-sm text-gray-400 leading-relaxed font-light">
                 Parses abstract syntax trees into high-density Qdrant vectors for instant semantic QA.
               </p>
            </div>

            <div className="group bg-gradient-to-b from-[#10131A] to-[#0A0D14] p-8 border border-white/5 hover:border-white/20 transition-all">
               <Shield className="h-8 w-8 text-purple-500 mb-6 group-hover:scale-110 transition-transform origin-left" />
               <h3 className="font-bold text-white tracking-wide mb-3">Security Audits</h3>
               <p className="text-sm text-gray-400 leading-relaxed font-light">
                 Identifies architectural hotspots and highly-coupled vulnerabilities before deployment.
               </p>
            </div>

            <div className="group bg-gradient-to-b from-[#10131A] to-[#0A0D14] p-8 border border-white/5 hover:border-white/20 transition-all">
               <Terminal className="h-8 w-8 text-green-500 mb-6 group-hover:scale-110 transition-transform origin-left" />
               <h3 className="font-bold text-white tracking-wide mb-3">Polyglot Parsing</h3>
               <p className="text-sm text-gray-400 leading-relaxed font-light">
                 Natively digests over 20+ programming languages without requiring custom configuration.
               </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/5 bg-[#030305] mt-32 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-center">
          <div className="text-gray-600 font-[family-name:var(--font-jb-mono)] text-xs text-center">
            © {new Date().getFullYear()} Codexa. All systems operational.
          </div>
        </div>
      </footer>
    </div>
  );
}

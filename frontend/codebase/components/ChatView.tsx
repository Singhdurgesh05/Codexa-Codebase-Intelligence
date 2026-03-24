"use client";

import { useState } from "react";
import { useDashboard } from "./DashboardProvider";
import { chatInteraction } from "@/lib/api";
import { Send, Terminal, Hexagon, Loader2, User } from "lucide-react";

export default function ChatView() {
  const { results, repoUrl } = useDashboard();
  
  const collectionName = results?.data?.collection_name || results?.collection_name;
  
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Analysis compilation complete. I have successfully projected **${repoUrl}** into the semantic vector space. Input architectural queries below.` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      if (!collectionName) throw new Error("Missing collection_name from the active index.");
      const data = await chatInteraction(userMsg, collectionName);
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `System Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#05070A]/80 backdrop-blur-xl border border-white/5 rounded-none overflow-hidden shadow-2xl m-4 relative">
      <div className="p-5 border-b border-[#1E232F] bg-[#0A0D14] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <Hexagon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-white font-[family-name:var(--font-syne)] font-bold tracking-wide uppercase">Semantic Decoder</h2>
            <p className="text-[10px] text-gray-500 font-[family-name:var(--font-jb-mono)] uppercase tracking-widest">{collectionName || "Active Vector Session"}</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-transparent relative">
        {/* Subtle grid in chat background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        {messages.map((msg, i) => (
          <div key={i} className={`relative z-10 flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`h-8 w-8 shrink-0 flex items-center justify-center mt-1 outline outline-1 outline-offset-4 ${
              msg.role === "user" ? "bg-rose-500 text-white outline-rose-500/30" : "bg-[#10131A] border border-[#1E232F] text-cyan-400 outline-cyan-500/10"
            }`}>
              {msg.role === "user" ? <User className="h-4 w-4" /> : <Terminal className="h-4 w-4" />}
            </div>
            <div className={`max-w-[80%] px-6 py-4 shadow-sm ${
              msg.role === "user" 
                ? "bg-rose-500/10 border border-rose-500/20 text-gray-100" 
                : "bg-[#10131A]/80 backdrop-blur-sm border border-[#1E232F] text-gray-300"
            }`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed font-light">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="relative z-10 flex gap-4">
            <div className="h-8 w-8 shrink-0 bg-[#10131A] border border-[#1E232F] text-cyan-400 outline outline-1 outline-offset-4 outline-cyan-500/10 flex items-center justify-center mt-1">
              <Terminal className="h-4 w-4" />
            </div>
            <div className="bg-[#10131A]/80 backdrop-blur-sm border border-[#1E232F] px-6 py-4 flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-500" />
              <span className="text-xs text-gray-500 font-[family-name:var(--font-jb-mono)] tracking-wider uppercase">Synthesizing vectors...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#0A0D14] border-t border-[#1E232F] shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Execute query bounds (e.g. Map the authentication module)..."
            className="w-full bg-[#030305] border border-[#1E232F] pl-5 pr-14 py-4 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600 disabled:opacity-50 font-light"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 p-2 bg-white text-black hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

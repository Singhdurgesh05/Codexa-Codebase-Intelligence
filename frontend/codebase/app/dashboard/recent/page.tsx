"use client";

import { useEffect, useState, useRef } from "react";
import { getRecentRepos, getChatHistory, chatInteraction } from "@/lib/api";
import { Clock, Loader2, Send, Search, Hexagon, History, Terminal, User } from "lucide-react";

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function RecentPage() {
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingChats, setLoadingChats] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  useEffect(() => {
    getRecentRepos()
      .then(res => {
        setRepos(res.data || []);
        setLoadingRepos(false);
        if (res.data && res.data.length > 0) {
          setSelectedRepo(res.data[0]);
        }
      })
      .catch(err => {
        console.error(err);
        setLoadingRepos(false);
      });
  }, []);

  useEffect(() => {
    if (selectedRepo) {
      setLoadingChats(true);
      getChatHistory(selectedRepo.id)
        .then(res => {
          setMessages(res.data || []);
          setLoadingChats(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingChats(false);
        });
    }
  }, [selectedRepo]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending || !selectedRepo) return;
    
    const userMsg = input;
    setInput("");
    
    const tempUserMessage = { role: "user", content: userMsg, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, tempUserMessage]);
    setSending(true);

    try {
      const data = await chatInteraction(userMsg, selectedRepo.collection_name);
      const tempAiMessage = { role: "assistant", content: data.response, created_at: new Date().toISOString() };
      setMessages(prev => [...prev, tempAiMessage]);
    } catch (err: any) {
      const errorMsg = { role: "assistant", content: `Error: ${err.message}`, created_at: new Date().toISOString() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full bg-transparent text-gray-200 p-4 gap-6 max-w-[1600px] mx-auto">
      
      {/* LEFT PANE: Repository List */}
      <div className="w-[340px] shrink-0 flex flex-col bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 rounded-none overflow-hidden relative shadow-2xl">
        <div className="p-6 border-b border-[#1E232F] bg-[#0A0D14] sticky top-0 relative z-10">
          <h2 className="text-white font-[family-name:var(--font-syne)] font-bold tracking-wide uppercase flex items-center gap-3 mb-5">
            <History className="h-5 w-5 text-rose-500" />
            Sector History
          </h2>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-rose-500 transition-colors" />
            <input
              type="text"
              placeholder="Search data sectors..."
              className="w-full bg-[#030305] border border-[#1E232F] rounded-none pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-colors placeholder:text-gray-600 font-light"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 z-10 relative">
          {loadingRepos ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
            </div>
          ) : repos.length === 0 ? (
            <div className="text-center p-6 text-gray-500 text-xs">
              <Hexagon className="h-8 w-8 mx-auto mb-3 opacity-20" />
              No architecture mapped yet.
            </div>
          ) : (
            <div className="space-y-2">
              {repos.map((repo) => (
                <button
                  key={repo.id}
                  onClick={() => setSelectedRepo(repo)}
                  className={`w-full text-left p-4 rounded-none border transition-all relative overflow-hidden group ${
                    selectedRepo?.id === repo.id 
                      ? "bg-rose-500/10 border-rose-500/30" 
                      : "bg-[#030305]/50 border-white/5 hover:border-white/20 hover:bg-[#1E232F]"
                  }`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${selectedRepo?.id === repo.id ? "bg-rose-500" : "bg-transparent group-hover:bg-gray-700"} transition-colors`}></div>
                  <h3 className={`font-bold text-[13px] tracking-wide truncate mb-2 ml-1 ${selectedRepo?.id === repo.id ? "text-white" : "text-gray-300"}`}>
                    {repo.repo_name}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 font-[family-name:var(--font-jb-mono)] font-bold uppercase tracking-widest ml-1">
                    <span className="flex items-center gap-1 shrink-0 bg-[#030305] px-2 py-0.5 border border-[#1E232F]">
                      <Clock className="h-3 w-3" />
                      {timeAgo(repo.created_at)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Chat View (Matching ChatView styles) */}
      <div className="flex-1 flex flex-col bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 rounded-none overflow-hidden relative shadow-2xl">
        {selectedRepo ? (
          <>
            <div className="p-6 border-b border-[#1E232F] bg-[#0A0D14] flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] shrink-0">
                  <Hexagon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-white font-[family-name:var(--font-syne)] font-bold tracking-wide uppercase truncate">{selectedRepo.repo_name}</h2>
                  <a href={selectedRepo.repo_url} target="_blank" rel="noreferrer" className="text-[10px] tracking-widest uppercase font-bold text-cyan-500 hover:text-cyan-400 transition-colors font-[family-name:var(--font-jb-mono)] truncate block mt-0.5">
                    {selectedRepo.collection_name}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-transparent relative">
              <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              </div>

              {loadingChats ? (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                </div>
              ) : null}

              {messages.length === 0 && !loadingChats && (
                <div className="text-center p-10 text-gray-500 relative z-10 w-full flex flex-col items-center">
                  <Terminal className="h-12 w-12 mb-4 opacity-20 text-cyan-500" />
                  <p className="font-[family-name:var(--font-syne)] text-lg text-gray-300 mb-1">Vector Empty</p>
                  <p className="text-xs font-light">Execute semantic queries against {selectedRepo.repo_name}.</p>
                </div>
              )}

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
                    {msg.created_at && (
                      <div className={`text-[9px] mt-3 font-[family-name:var(--font-jb-mono)] font-bold uppercase tracking-widest text-[#4B5563] text-right`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="relative z-10 flex gap-4">
                  <div className="h-8 w-8 shrink-0 bg-[#10131A] border border-[#1E232F] text-cyan-400 outline outline-1 outline-offset-4 outline-cyan-500/10 flex items-center justify-center mt-1">
                    <Terminal className="h-4 w-4" />
                  </div>
                  <div className="bg-[#10131A]/80 backdrop-blur-sm border border-[#1E232F] px-6 py-4 flex items-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-500" />
                    <span className="text-xs text-gray-500 font-[family-name:var(--font-jb-mono)] tracking-wider uppercase font-bold">Querying Neural Core...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-[#0A0D14] border-t border-[#1E232F] shrink-0">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={sending || loadingChats || !selectedRepo}
                  placeholder={`Intercept structural metrics from ${selectedRepo.repo_name}...`}
                  className="w-full bg-[#030305] border border-[#1E232F] pl-5 pr-14 py-4 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600 disabled:opacity-50 font-light"
                />
                <button 
                  type="submit"
                  disabled={sending || !input.trim() || loadingChats || !selectedRepo}
                  className="absolute right-3 p-2 bg-white text-black hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 relative z-10">
            <Hexagon className="h-16 w-16 mb-6 opacity-10 text-cyan-500" />
            <h2 className="text-2xl font-[family-name:var(--font-syne)] font-bold tracking-wide uppercase mb-2 text-gray-400">Initialize Selection</h2>
            <p className="text-sm font-light max-w-xs text-center">Allocate a memory vector from the left sector to commence semantic analysis.</p>
          </div>
        )}
      </div>

    </div>
  );
}

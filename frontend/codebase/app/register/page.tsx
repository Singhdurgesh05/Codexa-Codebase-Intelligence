"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth";
import Link from "next/link";
import { Mail, Lock, Loader2, Hexagon, ArrowRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    try {
      await registerUser(email, password);
      alert("Clearance granted. You may now authenticate.");
      router.push("/login");
    } catch (err) {
      alert("Registration failed. Please attempt again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-gray-200 flex flex-col items-center justify-center p-6 relative overflow-hidden font-outfit selection:bg-rose-500/30">
      
      {/* Background Mesh Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.03]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-10 group">
          <Hexagon className="h-8 w-8 text-rose-500 fill-rose-500/20 group-hover:fill-rose-500/40 transition-all duration-500" />
          <span className="font-[family-name:var(--font-syne)] font-bold text-2xl tracking-widest uppercase text-white">Codexa</span>
        </Link>

        {/* Auth Card */}
        <div className="bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent"></div>

          <div className="mb-8 text-center">
            <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-white mb-2">Initialize Account</h2>
            <p className="text-sm text-gray-400 font-light tracking-wide">Configure new node identity for Codexa.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-widest uppercase text-gray-500 font-[family-name:var(--font-jb-mono)]">Operator Email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-rose-500 transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full bg-[#10131A] border border-[#1E232F] rounded-none py-3 pl-10 pr-4 text-sm text-gray-200 outline-none transition-all focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 shadow-inner placeholder:text-gray-700"
                  placeholder="new_admin@codexa.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-widest uppercase text-gray-500 font-[family-name:var(--font-jb-mono)]">Encryption Key (Password)</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-rose-500 transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full bg-[#10131A] border border-[#1E232F] rounded-none py-3 pl-10 pr-4 text-sm text-gray-200 outline-none transition-all focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 shadow-inner placeholder:text-gray-700"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex items-center justify-center gap-3 bg-white text-[#030305] py-3.5 mt-2 text-[13px] font-bold tracking-widest uppercase hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 w-1/4 bg-white/20 skew-x-[45deg] -translate-x-[150%] group-hover:translate-x-[500%] transition-transform duration-700"></div>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#030305]" />
              ) : (
                <>
                  Register Identity
                  <ShieldCheck className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-[13px] text-gray-500">
              Already have clearance?{" "}
              <Link
                href="/login"
                className="text-white hover:text-rose-400 border-b border-transparent hover:border-rose-500/30 transition-all pb-0.5 ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info line */}
        <div className="mt-8 text-center flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-gray-600 font-[family-name:var(--font-jb-mono)]">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500/50 block"></span>
          256-bit Vector Encryption Active
        </div>
      </div>
    </div>
  );
}
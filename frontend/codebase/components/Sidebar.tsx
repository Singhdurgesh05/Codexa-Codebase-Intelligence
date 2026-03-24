"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart2, Clock, Hexagon } from "lucide-react";

const navigation = [
  { name: "Console", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { name: "Recently Analyzed", href: "/dashboard/recent", icon: Clock },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col bg-[#05070A]/80 backdrop-blur-xl border-r border-[#1E232F]">
      <div className="flex h-16 items-center border-b border-[#1E232F] px-4 lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-3 font-semibold group">
          <Hexagon className="h-5 w-5 text-rose-500 fill-rose-500/20 group-hover:fill-rose-500/40 transition-colors" />
          <span className="font-[family-name:var(--font-syne)] font-bold text-lg tracking-widest uppercase text-white">Codexa</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-6">
        <nav className="grid items-start px-3 text-[13px] font-bold tracking-wider lg:px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 transition-all uppercase ${
                  isActive 
                    ? "bg-rose-500/10 text-rose-400 border-l-[3px] border-rose-500" 
                    : "text-gray-500 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent"
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? "text-rose-400" : "text-gray-500"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-[#1E232F]">
        <div className="flex items-center gap-2 text-[10px] font-[family-name:var(--font-jb-mono)] tracking-widest text-gray-500 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse block"></span>
          System Online
        </div>
      </div>
    </div>
  );
}

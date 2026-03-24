"use client";

import { useDashboard } from "@/components/DashboardProvider";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { Activity, Database, Code2, Cpu, FileCode2, Zap, FolderOpen } from "lucide-react";

// Fallback Mock Data
const defaultQueryData = [
  { name: "Mon", count: 120 }, { name: "Tue", count: 230 },
  { name: "Wed", count: 180 }, { name: "Thu", count: 390 },
  { name: "Fri", count: 290 }, { name: "Sat", count: 150 },
  { name: "Sun", count: 400 },
];

const defaultLanguageData = [
  { name: "TypeScript", value: 65, color: "#06B6D4" }, // Cyan
  { name: "Python", value: 25, color: "#F43F5E" },      // Rose
  { name: "Go", value: 7, color: "#A855F7" },          // Purple
  { name: "Rust", value: 3, color: "#F59E0B" },        // Amber
];

const COLORS = ['#06B6D4', '#F43F5E', '#A855F7', '#F59E0B', '#3B82F6', '#10B981'];

export default function AnalyticsPage() {
  const { results } = useDashboard();
  const data = results?.data;
  const stats = data?.stats;

  const hasRealData = !!stats;
  
  const totalFiles = stats?.total_files || "4,203";
  const totalFunctions = stats?.total_functions || "1.2M";
  const repoName = data?.repo_name || "Global";
  const largestFile = stats?.largest_file ? stats.largest_file.split('/').pop() : "React Core";

  let dynamicLanguageData = defaultLanguageData;
  if (hasRealData && stats.functions_per_file) {
    const langCounts: Record<string, number> = {};
    Object.keys(stats.functions_per_file).forEach(file => {
      const ext = file.includes('.') ? file.substring(file.lastIndexOf('.')).toLowerCase() : '';
      const name = ['.ts', '.tsx'].includes(ext) ? 'TypeScript' :
                   ['.js', '.jsx'].includes(ext) ? 'JavaScript' :
                   ext === '.py' ? 'Python' :
                   ext === '.go' ? 'Go' : 
                   ext === '.rs' ? 'Rust' : 'Other';
      langCounts[name] = (langCounts[name] || 0) + stats.functions_per_file[file];
    });
    
    const total = Object.values(langCounts).reduce((a,b)=>a+b, 0) || 1;
    dynamicLanguageData = Object.entries(langCounts).map(([name, count], i) => ({
      name,
      value: Math.round((count / total) * 100),
      color: COLORS[i % COLORS.length]
    })).sort((a,b) => b.value - a.value);
  }

  let distributionData = defaultQueryData;
  let chartTitle = "Semantic Query Volume";
  let chartSub = "Inferences over the last 7 days";
  
  if (hasRealData && stats.functions_per_file) {
    chartTitle = "File Complexity Distribution";
    chartSub = "Total AST nodes extracted per file";
    const sortedFiles = Object.entries(stats.functions_per_file as Record<string, number>)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
      
    distributionData = sortedFiles.map(([filePath, count]) => ({
      name: filePath.split('/').pop() || 'Unknown',
      count: count
    }));
  }

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-200 px-4 py-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="font-[family-name:var(--font-syne)] text-4xl font-extrabold tracking-tight text-white mb-3">System Telemetry</h1>
        <p className="text-gray-400 font-light">
          {hasRealData 
            ? `Viewing live extraction metrics for target: ${repoName}` 
            : "Monitor neural indexing, vector capacity, and inference workloads."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Stat Card 1 */}
        <div className="bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 p-6 hover:border-white/20 transition-all rounded-none relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="font-[family-name:var(--font-jb-mono)] text-[10px] tracking-widest text-gray-500 uppercase font-bold">{hasRealData ? "Active Analysis" : "Indexed Repositories"}</div>
            <div className="text-cyan-500">
              <Database className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-[family-name:var(--font-syne)] font-bold text-white truncate" title={repoName}>
            {hasRealData ? repoName : "14"}
          </div>
          <div className="text-[10px] font-[family-name:var(--font-jb-mono)] text-cyan-400 mt-2 flex items-center gap-2 uppercase tracking-widest font-bold">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse block"></div>
            <span>{hasRealData ? "Loaded in Qdrant Vector Space" : "Cluster OK"}</span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 p-6 hover:border-white/20 transition-all rounded-none relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="font-[family-name:var(--font-jb-mono)] text-[10px] tracking-widest text-gray-500 uppercase font-bold">{hasRealData ? "Mapped Nodes" : "Ingested Topology"}</div>
            <div className="text-green-500">
              <FileCode2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-[family-name:var(--font-syne)] font-bold text-white">{totalFunctions}</div>
          <div className="text-[10px] font-[family-name:var(--font-jb-mono)] text-gray-500 mt-2 uppercase tracking-widest font-bold">
            <span>{hasRealData ? `Across ${totalFiles} distinct files` : "Across 4,203 files total"}</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 p-6 hover:border-white/20 transition-all rounded-none relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="font-[family-name:var(--font-jb-mono)] text-[10px] tracking-widest text-gray-500 uppercase font-bold">{hasRealData ? "Core Mass (Largest File)" : "Engine Queries (30d)"}</div>
            <div className="text-rose-500">
              {hasRealData ? <FolderOpen className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
            </div>
          </div>
          <div className="text-3xl font-[family-name:var(--font-syne)] font-bold text-white truncate" title={largestFile as string}>{hasRealData ? largestFile : "8,459"}</div>
          <div className="text-[10px] font-[family-name:var(--font-jb-mono)] text-rose-400 mt-2 uppercase tracking-widest font-bold truncate" title={stats?.largest_file}>
            <span>{hasRealData ? stats?.largest_file : "~1.4M Neural Tokens Computed"}</span>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 p-6 hover:border-white/20 transition-all rounded-none relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="font-[family-name:var(--font-jb-mono)] text-[10px] tracking-widest text-gray-500 uppercase font-bold">Vector Persistence Volume</div>
            <div className="text-purple-500">
              <Cpu className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-[family-name:var(--font-syne)] font-bold text-white">18.9<span className="text-xl text-gray-500 ml-1">GB</span></div>
          <div className="w-full bg-[#1E232F] h-1.5 mt-4 overflow-hidden">
            <div className="bg-purple-500 h-full w-[30%] shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Main Chart */}
        <div className="col-span-2 bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 p-8 rounded-none">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-lg font-[family-name:var(--font-syne)] font-bold text-white tracking-wide">{chartTitle}</h2>
              <p className="text-xs text-gray-500 font-light mt-1">{chartSub}</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-[family-name:var(--font-jb-mono)] font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 px-3 py-1.5 border border-cyan-500/20">
              <Activity className="h-3 w-3 text-cyan-400" />
              <span>LIVE</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorQuery" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E232F" vertical={false} />
                <XAxis dataKey="name" stroke="#4B5563" tick={{fill: '#8B949E', fontSize: 10, fontFamily: 'var(--font-jb-mono)'}} dy={10} axisLine={false} tickLine={false} interval={0} angle={-30} textAnchor="end" height={60} />
                <YAxis stroke="#4B5563" tick={{fill: '#8B949E', fontSize: 10, fontFamily: 'var(--font-jb-mono)'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0D14', borderColor: '#1E232F', borderRadius: '0px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#06B6D4' }}
                  formatter={(value: any) => [value, hasRealData ? "Nodes" : "Queries"] as any}
                />
                <Area type="monotone" dataKey="count" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorQuery)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="col-span-1 bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 p-8 flex flex-col rounded-none">
          <div>
            <h2 className="text-lg font-[family-name:var(--font-syne)] font-bold text-white tracking-wide">Topology Matrix</h2>
            <p className="text-xs text-gray-500 font-light mt-1">{hasRealData ? "Analyzed segments mapped by source tech stack" : "Aggregation across all isolated sectors"}</p>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center relative min-h-[250px] mt-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={dynamicLanguageData}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {dynamicLanguageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0D14', borderColor: '#1E232F', borderRadius: '0px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: any) => [`${value}%`, "Density"] as any}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-4">
              <div className="text-center">
                <Code2 className="h-6 w-6 text-gray-500 mx-auto mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-widest font-[family-name:var(--font-jb-mono)] text-gray-600">AST Indexed</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-4">
            {dynamicLanguageData.map((lang) => (
              <div key={lang.name} className="flex items-center gap-2 text-xs">
                <div className="h-2 w-2 rounded-none shrink-0" style={{ backgroundColor: lang.color }}></div>
                <span className="text-gray-300 truncate font-light" title={lang.name}>{lang.name}</span>
                <span className="text-gray-500 font-[family-name:var(--font-jb-mono)] font-bold ml-auto text-[10px]">{lang.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

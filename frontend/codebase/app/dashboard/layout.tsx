import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { DashboardProvider } from "@/components/DashboardProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] bg-[#030305] font-outfit selection:bg-rose-500/30">
        
        {/* Grid Background Effect */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.02]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <div className="hidden md:block fixed inset-y-0 left-0 w-[240px] z-20">
          <Sidebar />
        </div>
        
        {/* Spacer for fixed sidebar */}
        <div className="hidden md:block w-[240px]"></div>
        
        <div className="flex flex-col flex-1 min-w-0 md:pl-[240px] absolute inset-0 text-gray-200">
          <TopBar />
          <main className="flex-1 overflow-auto h-[calc(100vh-64px)] relative z-0">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}

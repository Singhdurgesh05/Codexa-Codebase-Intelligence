"use client";

import React, { createContext, useContext, useState } from "react";

export type DashboardStatus = "idle" | "analyzing" | "chat";

interface DashboardContextType {
  status: DashboardStatus;
  setStatus: (s: DashboardStatus) => void;
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  results: any;
  setResults: (data: any) => void;
}

const DashboardContext = createContext<DashboardContextType>({} as any);

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<DashboardStatus>("idle");
  const [repoUrl, setRepoUrl] = useState("");
  const [results, setResults] = useState<any>(null);

  return (
    <DashboardContext.Provider value={{ status, setStatus, repoUrl, setRepoUrl, results, setResults }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);

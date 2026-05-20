"use client";

import type { AnalyzeResult } from "@/types";
import { Tabs, type DashboardTab } from "./Tabs";
import { KusBakisiTab } from "./KusBakisiTab";
import { MimariYolHaritasiTab } from "./MimariYolHaritasiTab";
import { MentorChatTab } from "./MentorChatTab";
import { LayoutDashboard } from "lucide-react";
import { useState } from "react";

interface DashboardProps {
  result: AnalyzeResult;
}

export function Dashboard({ result }: DashboardProps) {
  const [tab, setTab] = useState<DashboardTab>("kus-bakisi");

  if (!result.success || !result.parsed || !result.reports) {
    return null;
  }

  const { parsed, reports } = result;

  return (
    <section className="mt-8 rounded-xl border border-surface-border bg-surface-elevated shadow-lg">
      <div className="border-b border-surface-border px-6 pt-6">
        <div className="mb-4 flex items-center gap-2 text-slate-300">
          <LayoutDashboard className="h-5 w-5 text-accent-muted" />
          <span className="text-sm">
            Analiz:{" "}
            <code className="text-xs text-slate-400">{parsed.rootPath}</code>
          </span>
        </div>
        <Tabs active={tab} onChange={setTab} />
      </div>

      <div className="p-6">
        {tab === "kus-bakisi" && (
          <KusBakisiTab parsed={parsed} reports={reports} />
        )}
        {tab === "mimari" && (
          <MimariYolHaritasiTab reports={reports} />
        )}
        {tab === "mentor" && (
          <MentorChatTab parsed={parsed} reports={reports} />
        )}
      </div>
    </section>
  );
}

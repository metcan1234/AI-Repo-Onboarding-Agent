"use client";

import type { OnboardingReports } from "@/types";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Database, GitBranch } from "lucide-react";
import { useState } from "react";

interface MimariYolHaritasiTabProps {
  reports: OnboardingReports;
}

export function MimariYolHaritasiTab({ reports }: MimariYolHaritasiTabProps) {
  const flow = reports.veri_akisi_haritasi;
  const sortedSteps = [...flow.adimlar].sort((a, b) => a.sira - b.sira);
  const [expanded, setExpanded] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(sortedSteps.map((s) => [s.sira, true]))
  );

  const toggle = (sira: number) => {
    setExpanded((prev) => ({ ...prev, [sira]: !prev[sira] }));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-surface-border bg-surface p-4">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
          <GitBranch className="h-5 w-5 text-accent-muted" />
          {flow.baslik || "Veri Akış Haritası"}
        </h2>
        <p className="text-sm text-slate-400">
          <span className="font-medium text-slate-300">Giriş:</span>{" "}
          {flow.giris_noktasi}
        </p>
      </div>

      <ol className="relative space-y-0 border-l border-surface-border pl-6">
        {sortedSteps.map((step, index) => {
          const isOpen = expanded[step.sira] ?? true;
          const isLast = index === sortedSteps.length - 1;

          return (
            <li key={step.sira} className="relative pb-6">
              <span className="absolute -left-[1.65rem] flex h-6 w-6 items-center justify-center rounded-full border border-accent bg-surface-elevated text-xs font-bold text-accent-muted">
                {step.sira}
              </span>

              <button
                type="button"
                onClick={() => toggle(step.sira)}
                className="flex w-full items-start gap-2 rounded-lg border border-surface-border bg-surface-elevated p-4 text-left transition hover:border-accent/50"
              >
                {isOpen ? (
                  <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                ) : (
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent-muted">
                      {step.katman}
                    </span>
                    <span className="truncate font-medium text-white">
                      {step.dosya_veya_modul}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "mt-2 text-sm text-slate-400",
                      !isOpen && "line-clamp-1"
                    )}
                  >
                    {step.aciklama}
                  </p>
                </div>
              </button>

              {!isLast && (
                <div className="ml-3 mt-2 h-4 w-px bg-surface-border" />
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
        <Database className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
        <div>
          <h3 className="text-sm font-semibold text-emerald-300">
            Kalıcı katman
          </h3>
          <p className="text-sm text-slate-300">
            {flow.veritabani_veya_kalici_katman}
          </p>
        </div>
      </div>

      <section className="rounded-lg border border-surface-border bg-surface p-4">
        <h3 className="mb-2 text-sm font-semibold text-white">
          İlk Görev Önerisi
        </h3>
        <p className="font-medium text-accent-muted">
          {reports.ilk_gorev_onerisi.gorev_basligi}
        </p>
        <p className="mt-2 text-sm text-slate-400">
          {reports.ilk_gorev_onerisi.aciklama}
        </p>
      </section>
    </div>
  );
}

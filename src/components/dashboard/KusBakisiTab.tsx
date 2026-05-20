"use client";

import type { OnboardingReports, ParsedRepository } from "@/types";
import { Code2, Cpu, FileCode, Heart } from "lucide-react";

interface KusBakisiTabProps {
  parsed: ParsedRepository;
  reports: OnboardingReports;
}

export function KusBakisiTab({ parsed, reports }: KusBakisiTabProps) {
  const kalp = reports.projenin_kalbi;

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
          <Cpu className="h-5 w-5 text-accent-muted" />
          Teknolojiler
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <TechCard
            title="Diller"
            items={parsed.languages}
            empty="Tespit edilemedi"
          />
          <TechCard
            title="Framework'ler"
            items={parsed.frameworks}
            empty="Tespit edilemedi"
          />
          <TechCard
            title="Giriş Noktaları"
            items={parsed.entryPoints}
            empty="Belirsiz"
          />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {parsed.metadata.totalFilesScanned} dosya tarandı
          {parsed.metadata.truncated ? " (liste kısaltıldı)" : ""}.
        </p>
      </section>

      <section className="rounded-lg border border-surface-border bg-surface p-5">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
          <Heart className="h-5 w-5 text-rose-400" />
          {kalp.baslik || "Projenin Kalbi"}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          {kalp.ozet}
        </p>
        <ul className="space-y-3">
          {kalp.kritik_ogeler.map((item, i) => (
            <li
              key={i}
              className="rounded-lg border border-surface-border bg-surface-elevated p-4"
            >
              <div className="mb-1 flex items-center gap-2 font-medium text-accent-muted">
                <FileCode className="h-4 w-4" />
                {item.dosya_veya_fonksiyon}
              </div>
              <p className="text-sm text-slate-400">{item.neden_kritik}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-dashed border-surface-border p-4">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
          <Code2 className="h-4 w-4" />
          Mimari özet
        </h3>
        <p className="text-sm text-slate-400">
          {reports.veri_akisi_haritasi.giris_noktasi} üzerinden başlayan akış,{" "}
          {reports.veri_akisi_haritasi.adimlar.length} adımda{" "}
          {reports.veri_akisi_haritasi.veritabani_veya_kalici_katman} katmanına
          ulaşıyor.
        </p>
      </section>
    </div>
  );
}

function TechCard({
  title,
  items,
  empty,
}: {
  title: string;
  items: string[];
  empty: string;
}) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface p-4">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      {items.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-full bg-accent/15 px-3 py-1 text-xs text-accent-muted"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <span className="text-sm text-slate-500">{empty}</span>
      )}
    </div>
  );
}

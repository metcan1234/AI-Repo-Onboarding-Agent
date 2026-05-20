"use client";

import { FolderSearch, Loader2, Sparkles } from "lucide-react";

interface PathInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  error?: string | null;
}

export function PathInput({
  value,
  onChange,
  onAnalyze,
  loading,
  error,
}: PathInputProps) {
  return (
    <section className="rounded-xl border border-surface-border bg-surface-elevated p-6 shadow-lg">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-accent/20 p-2">
          <Sparkles className="h-5 w-5 text-accent-muted" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">
            AI Repo Onboarding Agent
          </h1>
          <p className="text-sm text-slate-400">
            Yerel bir proje yolunu tarayın; Claude mimari oryantasyon raporu
            üretsin.
          </p>
        </div>
      </div>

      <label className="mb-2 block text-sm font-medium text-slate-300">
        Yerel proje yolu
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FolderSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && onAnalyze()}
            placeholder="C:\Users\Can\projects\my-app"
            className="w-full rounded-lg border border-surface-border bg-surface py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            disabled={loading}
          />
        </div>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={loading || !value.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analiz ediliyor…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analiz Et
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <p className="mt-3 text-xs text-slate-500">
        Windows’ta tam mutlak yol kullanın. İsteğe bağlı:{" "}
        <code className="text-slate-400">ALLOWED_SCAN_ROOTS</code> ile tarama
        köklerini kısıtlayın.
      </p>
    </section>
  );
}

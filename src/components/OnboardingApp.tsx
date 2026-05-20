"use client";

import { analyzeRepository } from "@/actions/analyze";
import type { AnalyzeResult } from "@/types";
import { useState } from "react";
import { PathInput } from "./PathInput";
import { Dashboard } from "./dashboard/Dashboard";

export function OnboardingApp() {
  const [projectPath, setProjectPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeRepository(projectPath);
      if (!data.success) {
        setError(data.error ?? "Analiz başarısız.");
        return;
      }
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 sm:px-6">
      <PathInput
        value={projectPath}
        onChange={setProjectPath}
        onAnalyze={handleAnalyze}
        loading={loading}
        error={error}
      />

      {result?.success && <Dashboard result={result} />}

      {!result && !loading && !error && (
        <p className="mt-12 text-center text-sm text-slate-500">
          Başlamak için yerel bir proje klasörünün tam yolunu girin.
        </p>
      )}
    </main>
  );
}

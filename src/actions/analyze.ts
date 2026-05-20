"use server";

import { generateOnboardingReports } from "@/lib/claude/analyze";
import {
  parseRepository,
  PathSecurityError,
  validateProjectPath,
} from "@/lib/parser";
import type { AnalyzeResult } from "@/types";

export async function analyzeRepository(
  projectPath: string
): Promise<AnalyzeResult> {
  try {
    const safePath = await validateProjectPath(projectPath);
    const parsed = await parseRepository(safePath);
    const reports = await generateOnboardingReports(parsed);

    return {
      success: true,
      parsed,
      reports,
    };
  } catch (err) {
    const message =
      err instanceof PathSecurityError
        ? err.message
        : err instanceof Error
          ? err.message
          : "Analiz sırasında beklenmeyen bir hata oluştu.";
    return { success: false, error: message };
  }
}

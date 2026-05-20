import { MAX_CONTEXT_JSON_CHARS } from "@/lib/constants";
import type { OnboardingReports, ParsedRepository } from "@/types";
import { CLAUDE_MODEL, getAnthropicClient } from "./client";
import {
  ONBOARDING_TOOL_NAME,
  onboardingReportsTool,
  parseToolReports,
} from "./tools";

function buildContextPayload(parsed: ParsedRepository): string {
  const compact = {
    rootPath: parsed.rootPath,
    languages: parsed.languages,
    frameworks: parsed.frameworks,
    entryPoints: parsed.entryPoints,
    keyFiles: parsed.keyFiles.map((k) => ({
      path: k.path,
      role: k.role,
      preview: k.preview?.slice(0, 800),
    })),
    structure: parsed.structure,
    metadata: parsed.metadata,
  };

  let json = JSON.stringify(compact);
  if (json.length > MAX_CONTEXT_JSON_CHARS) {
    json = json.slice(0, MAX_CONTEXT_JSON_CHARS) + "…[truncated]";
  }
  return json;
}

export async function generateOnboardingReports(
  parsed: ParsedRepository
): Promise<OnboardingReports> {
  const anthropic = getAnthropicClient();
  const contextJson = buildContextPayload(parsed);

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    system: `Sen deneyimli bir yazılım mimarı ve oryantasyon mentorusun.
Kullanıcı yabancı bir kod deposunu öğrenmek istiyor. Verilen JSON repo özeti ve dosya önizlemelerine dayanarak
Türkçe, net ve eyleme dönük raporlar üret. Tahmin yapıyorsan bunu açıkça belirt.
Mutlaka submit_onboarding_reports aracını kullan; serbest metin yanıt verme.`,
    messages: [
      {
        role: "user",
        content: `Aşağıdaki yerel repo analiz sonucuna göre üç raporu üret:

1) "Projenin Kalbi" — en kritik 3 dosya/fonksiyon ve nedenleri
2) "Veri Akış Haritası" — isteğin girişinden veritabanı/kalıcı katmana kadar sıralı mimari yol
3) "İlk Görev Önerisi" — projeyi öğrenmek için küçük refactor veya ekleme görevi

Repo özeti (JSON):
${contextJson}`,
      },
    ],
    tools: [onboardingReportsTool],
    tool_choice: { type: "tool", name: ONBOARDING_TOOL_NAME },
  });

  const toolBlock = response.content.find(
    (block) => block.type === "tool_use" && block.name === ONBOARDING_TOOL_NAME
  );

  if (!toolBlock || toolBlock.type !== "tool_use") {
    throw new Error("Claude yapılandırılmış rapor aracını çağırmadı.");
  }

  return parseToolReports(toolBlock.input);
}

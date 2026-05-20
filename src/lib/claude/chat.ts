import type {
  ChatMessage,
  MentorChatResponse,
  OnboardingReports,
  ParsedRepository,
} from "@/types";
import { CLAUDE_MODEL, getAnthropicClient } from "./client";

function buildMentorSystemContext(
  parsed: ParsedRepository,
  reports: OnboardingReports
): string {
  return `Sen yalnızca analiz edilmiş tek bir kod deposunun mimarisi hakkında Türkçe cevap veren bir AI mentorusun.
Başka projeler, genel programlama veya repo dışı konularda konuşma; kibarca yönlendir.

Repo kökü: ${parsed.rootPath}
Diller: ${parsed.languages.join(", ") || "bilinmiyor"}
Framework'ler: ${parsed.frameworks.join(", ") || "bilinmiyor"}
Giriş noktaları: ${parsed.entryPoints.join(", ") || "bilinmiyor"}

Önceden üretilmiş raporlar:
${JSON.stringify(reports, null, 2)}

Yanıtlarını kısa, net ve dosya yollarına referans vererek yaz.`;
}

export async function mentorChat(
  messages: ChatMessage[],
  parsed: ParsedRepository,
  reports: OnboardingReports
): Promise<MentorChatResponse> {
  try {
    const anthropic = getAnthropicClient();
    const system = buildMentorSystemContext(parsed, reports);

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const reply =
      textBlock && textBlock.type === "text"
        ? textBlock.text
        : "Yanıt oluşturulamadı.";

    return { success: true, reply };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sohbet hatası.";
    return { success: false, error: message };
  }
}

import Anthropic from "@anthropic-ai/sdk";
import { CLAUDE_MODEL } from "@/lib/constants";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY tanımlı değil. .env dosyanıza ekleyin."
    );
  }
  if (!client) {
    client = new Anthropic({ apiKey });
  }
  return client;
}

export { CLAUDE_MODEL };

"use client";

import type {
  ChatMessage,
  MentorChatResponse,
  OnboardingReports,
  ParsedRepository,
} from "@/types";
import { Loader2, Send } from "lucide-react";
import { useRef, useState } from "react";

interface MentorChatTabProps {
  parsed: ParsedRepository;
  reports: OnboardingReports;
}

export function MentorChatTab({ parsed, reports }: MentorChatTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Merhaba! Bu reponun mimarisi hakkında sorularınızı yanıtlayabilirim. Örneğin: \"İstek hangi dosyadan geçiyor?\" veya \"Veritabanı nerede bağlanıyor?\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          parsed,
          reports,
        }),
      });

      const data = (await res.json()) as MentorChatResponse;
      if (!data.success || !data.reply) {
        throw new Error(data.error ?? "Yanıt alınamadı.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply! },
      ]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sohbet hatası.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[min(520px,60vh)] flex-col rounded-lg border border-surface-border bg-surface">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-auto max-w-[85%] rounded-lg bg-accent px-4 py-2 text-sm text-white"
                : "mr-auto max-w-[90%] rounded-lg border border-surface-border bg-surface-elevated px-4 py-2 text-sm text-slate-300"
            }
          >
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="border-t border-surface-border px-4 py-2 text-xs text-red-400">
          {error}
        </p>
      )}

      <form
        className="flex gap-2 border-t border-surface-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Mimari hakkında soru sorun…"
          disabled={loading}
          className="flex-1 rounded-lg border border-surface-border bg-surface-elevated px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Gönder
        </button>
      </form>
    </div>
  );
}

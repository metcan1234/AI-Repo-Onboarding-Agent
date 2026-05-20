import { mentorChat } from "@/lib/claude/chat";
import type { MentorChatRequest } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MentorChatRequest;

    if (!body?.messages?.length || !body.parsed || !body.reports) {
      return NextResponse.json(
        { success: false, error: "Geçersiz istek gövdesi." },
        { status: 400 }
      );
    }

    const result = await mentorChat(
      body.messages,
      body.parsed,
      body.reports
    );

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Sohbet API hatası.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

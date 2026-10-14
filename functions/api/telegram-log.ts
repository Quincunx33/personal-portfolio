interface TelegramEnv {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

interface PagesFunctionContext {
  request: Request;
  env: TelegramEnv;
}

export async function onRequestPost({ request, env }: PagesFunctionContext): Promise<Response> {
  const token = env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    return Response.json({ error: "Telegram service unavailable" }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { text?: unknown };
    if (typeof body.text !== "string" || !body.text.trim()) {
      return Response.json({ error: "Missing text" }, { status: 400 });
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: body.text.slice(0, 4096),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );

    const result = await telegramResponse.json();
    return Response.json(result, { status: telegramResponse.ok ? 200 : 502 });
  } catch {
    return Response.json({ error: "Telegram service unavailable" }, { status: 502 });
  }
}

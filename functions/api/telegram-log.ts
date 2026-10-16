interface TelegramEnv {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

interface PagesFunctionContext {
  request: Request;
  env: TelegramEnv;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function onRequestPost({ request, env }: PagesFunctionContext): Promise<Response> {
  const token = env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    return Response.json(
      { error: "Telegram bot credentials not configured in Cloudflare environment" },
      { status: 503, headers: CORS_HEADERS }
    );
  }

  try {
    const body = (await request.json()) as {
      text?: unknown;
      name?: unknown;
      replyContact?: unknown;
      message?: unknown;
    };

    let text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text && typeof body.message === "string" && body.message.trim()) {
      const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "Anonymous";
      const contact = typeof body.replyContact === "string" && body.replyContact.trim() ? body.replyContact.trim() : "Not provided";
      text = `⚡ <b>DIRECT TELEGRAM RELAY MESSAGE</b>\n\n👤 <b>Name:</b> ${name}\n💬 <b>Contact:</b> ${contact}\n\n📝 <b>Message:</b>\n${body.message.trim()}`;
    }

    if (!text) {
      return Response.json({ error: "Missing message text" }, { status: 400, headers: CORS_HEADERS });
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text.slice(0, 4096),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );

    const result = await telegramResponse.json();
    return Response.json(result, {
      status: telegramResponse.ok ? 200 : 502,
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return Response.json(
      { error: "Telegram service relay error", details: err?.message },
      { status: 502, headers: CORS_HEADERS }
    );
  }
}

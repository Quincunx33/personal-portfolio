export interface TelegramMessagePayload {
  name: string;
  contact: string;
  topic?: string;
  message: string;
}

export interface TelegramSendResult {
  ok: boolean;
  devMode?: boolean;
  messageId?: string | number;
  error?: string;
  timestamp: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendTelegramBotMessage(
  payload: TelegramMessagePayload
): Promise<TelegramSendResult> {
  const name = payload.name.trim() || "Anonymous Visitor";
  const contact = payload.contact.trim() || "Not provided";
  const topic = payload.topic?.trim() || "General Inquiry";
  const msg = payload.message.trim();

  if (!msg) {
    throw new Error("Message text cannot be empty");
  }

  const now = new Date();
  const timeFormatted = now.toLocaleString("en-US", {
    timeZone: "Asia/Dhaka",
    dateStyle: "medium",
    timeStyle: "medium",
  });

  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "Unknown";
  const isMobile = /mobile|android|iphone/i.test(userAgent);
  const platform = isMobile ? "📱 Mobile" : "💻 Desktop";

  const telegramHtml = `📬 <b>NEW VISITOR MESSAGE VIA PORTFOLIO</b>\n\n` +
    `👤 <b>Sender:</b> <code>${escapeHtml(name)}</code>\n` +
    `📫 <b>Reply Contact:</b> <b>${escapeHtml(contact)}</b>\n` +
    `🏷️ <b>Context:</b> <i>${escapeHtml(topic)}</i>\n\n` +
    `💬 <b>Message Content:</b>\n` +
    `<blockquote>${escapeHtml(msg)}</blockquote>\n\n` +
    `🕒 <b>Received At:</b> ${escapeHtml(timeFormatted)} (GMT+6)\n` +
    `🌐 <b>Platform:</b> ${platform} • <code>taaissu.com</code>`;

  try {
    const response = await fetch("/api/telegram-log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: telegramHtml,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg =
        data?.error ||
        (response.status === 503
          ? "Telegram bot credentials are not yet configured on the server."
          : `HTTP error ${response.status}`);
      throw new Error(errorMsg);
    }

    return {
      ok: true,
      devMode: Boolean(data?.devMode),
      messageId: data?.result?.message_id || Date.now(),
      timestamp: timeFormatted,
    };
  } catch (err: any) {
    throw new Error(err?.message || "Failed to deliver message to Telegram bot");
  }
}

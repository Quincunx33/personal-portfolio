import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, Plugin } from "vite";

function telegramRelayDevPlugin(): Plugin {
  return {
    name: "telegram-relay-dev-middleware",
    configureServer(server) {
      server.middlewares.use("/api/telegram-log", async (req, res) => {
        if (req.method === "OPTIONS") {
          res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          });
          return res.end();
        }
        if (req.method !== "POST") {
          res.writeHead(405, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Method Not Allowed" }));
        }

        let bodyStr = "";
        req.on("data", (chunk) => {
          bodyStr += chunk;
        });
        req.on("end", async () => {
          try {
            const body = JSON.parse(bodyStr || "{}");
            const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
            const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

            let text = typeof body.text === "string" ? body.text.trim() : "";
            if (!text && typeof body.message === "string" && body.message.trim()) {
              const name = body.name?.trim() || "Anonymous";
              const contact = body.replyContact?.trim() || "Not provided";
              text = `⚡ <b>DIRECT TELEGRAM RELAY MESSAGE</b>\n\n👤 <b>Name:</b> ${name}\n💬 <b>Contact:</b> ${contact}\n\n📝 <b>Message:</b>\n${body.message.trim()}`;
            }

            if (!text) {
              res.writeHead(400, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Missing message text" }));
            }

            if (token && chatId) {
              const telegramRes = await fetch(
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
              const data = await telegramRes.json();
              res.writeHead(telegramRes.ok ? 200 : 502, {
                "Content-Type": "application/json",
              });
              return res.end(JSON.stringify(data));
            } else {
              console.log("[Dev Telegram Relay] Message received:", { text });
              res.writeHead(200, { "Content-Type": "application/json" });
              return res.end(
                JSON.stringify({
                  ok: true,
                  devMode: true,
                  message: "Message received by dev relay",
                })
              );
            }
          } catch (err: any) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ error: err?.message || "Internal server error" })
            );
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), telegramRelayDevPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    target: "es2019",
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});

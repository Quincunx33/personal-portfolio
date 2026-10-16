import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";

function devApiPlugin(): Plugin {
  return {
    name: "dev-api-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/api/telegram-log" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk: any) => {
            body += chunk;
          });
          req.on("end", async () => {
            try {
              const data = JSON.parse(body || "{}");
              const text = data.text;
              if (!text) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Missing text" }));
                return;
              }

              const env = loadEnv("development", process.cwd(), "");
              const botToken = env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
              const chatId = env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

              if (botToken && chatId) {
                const tgRes = await fetch(
                  `https://api.telegram.org/bot${botToken}/sendMessage`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      chat_id: chatId,
                      text: text,
                      parse_mode: "HTML",
                      disable_web_page_preview: true,
                    }),
                  }
                );
                const result = await tgRes.json();
                res.statusCode = tgRes.ok ? 200 : 502;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(result));
                return;
              }

              // Dev mode fallback
              console.log("[Dev Server Telegram Relay] Message received:", text.slice(0, 100) + "...");
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  ok: true,
                  devMode: true,
                  message: "Message received in dev mode.",
                  result: { message_id: Math.floor(Math.random() * 90000) + 10000 },
                })
              );
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: err?.message || "Internal error" }));
            }
          });
          return;
        }

        if (req.url === "/api/counter" && req.method === "GET") {
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              username: "quincunx33",
              total: "96807",
              event: { recorded: true },
            })
          );
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devApiPlugin()],
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

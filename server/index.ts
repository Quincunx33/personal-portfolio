import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createPortraitEnvelope } from "./portrait.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Security: Disable X-Powered-By
  app.disable("x-powered-by");

  // HTTP Security Headers Middleware
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=()"
    );
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://f5f66k.bot-keep.xyz; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.github.com https://ipwho.is https://ipapi.co https://api.ipify.org https://api.telegram.org https://f5f66k.bot-keep.xyz; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests;"
    );
    next();
  });

  app.use(express.json());

  // The portrait is fetch-only. Address-bar navigation and ordinary hotlink or
  // scraper requests do not carry the canvas-client marker and are rejected.
  const securePortrait = async (req: express.Request, res: express.Response) => {
    if (
      req.get("X-Portrait-Client") !== "canvas-v1" ||
      req.get("Sec-Fetch-Dest") === "document"
    ) {
      return res.status(403).type("text").send("Direct Access Blocked");
    }
    try {
      const { envelope, sessionKey } = await createPortraitEnvelope();
      res.set({
        "Content-Type": "application/octet-stream",
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
        "X-Portrait-Key": sessionKey,
        "Cross-Origin-Resource-Policy": "same-origin",
      });
      res.write(envelope.subarray(0, 16));
      return res.end(envelope.subarray(16));
    } catch (error) {
      console.error("[Portrait Error]", error);
      return res.status(503).type("text").send("Portrait unavailable");
    }
  };
  app.get("/api/secure-media/portrait", securePortrait);
  app.get("/api/portrait", securePortrait);
  app.use("/secure", (_req, res) =>
    res.status(403).type("text").send("Direct Access Blocked")
  );



  // Realtime GitHub Visitor Counter Proxy for @quincunx33
  app.get("/api/counter", async (_req, res) => {
    try {
      const response = await fetch("https://f5f66k.bot-keep.xyz/api/v1/counter/quincunx33", {
        headers: {
          Accept: "application/json",
          "User-Agent": "taaissu-portfolio/1.0",
        },
      });
      if (!response.ok) {
        throw new Error(`Upstream counter HTTP ${response.status}`);
      }
      const data = await response.json();
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.json(data);
    } catch (err: any) {
      console.error("[Counter Proxy Error]:", err?.message);
      return res.json({
        username: "quincunx33",
        total: "96807",
        event: { recorded: false, reason: "fallback" },
      });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // SEO Files: explicitly set MIME types & caching
  app.get("/sitemap.xml", (_req, res) => {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.sendFile(path.join(staticPath, "sitemap.xml"));
  });

  app.get("/robots.txt", (_req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.sendFile(path.join(staticPath, "robots.txt"));
  });

  app.get("/404", (_req, res) => {
    res.status(404).sendFile(path.join(staticPath, "404.html"));
  });

  // Return a real 404 for unknown routes rather than serving the homepage shell.
  app.get("*", (_req, res) => {
    res.status(404).sendFile(path.join(staticPath, "404.html"));
  });

  const port = Number(process.env.PORT) || 3000;

  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}/`);
  });
}

startServer().catch(console.error);

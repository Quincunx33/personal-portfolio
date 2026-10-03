import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory store for the active tracking token
let activeAdminToken: string | null = null;

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Route for admin to register their active OAuth token
  app.post("/api/admin/token", (req, res) => {
    const { token } = req.body;
    if (token) {
      activeAdminToken = token;
      console.log("Admin OAuth token registered successfully on server.");
      return res.json({ success: true, message: "Token registered" });
    }
    return res.status(400).json({ success: false, error: "No token provided" });
  });

  // Anonymous visitor tracking route
  app.post("/api/track", async (req, res) => {
    const { sheetId, actionType, contextUrl, userAgent, ip, values } = req.body;

    // Read the authorization header first (stateless token approach)
    let token = activeAdminToken;
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    if (!token) {
      console.warn("Backend /api/track skipped: No OAuth token provided or registered yet.");
      return res.status(200).json({ success: false, warning: "No active authenticated session." });
    }

    const data = values || [
      new Date().toLocaleString('en-US', { timeZoneName: 'short' }),
      ip || req.ip || 'Unknown IP',
      actionType || 'Page View',
      contextUrl || '',
      userAgent || req.headers['user-agent'] || '',
    ];

    try {
      // Append across columns A:Y (25 columns)
      const range = encodeURIComponent('Sheet1!A:Y');
      const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;
      
      console.log(`Sending payload to Google Sheets API with token: ${sheetsUrl}`);
      const sheetsResponse = await fetch(sheetsUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: [data] }),
      });

      if (!sheetsResponse.ok) {
        const errorText = await sheetsResponse.text();
        let parsedError = errorText;
        try {
          const jsonErr = JSON.parse(errorText);
          parsedError = jsonErr.error?.message || errorText;
        } catch (e) {}
        console.error("Failed to write to Google Sheets on backend. Status:", sheetsResponse.status, "Error:", errorText);
        return res.status(500).json({ success: false, error: parsedError });
      }

      console.log("Successfully logged row to Google Sheet.");
      return res.json({ success: true });
    } catch (e: any) {
      console.error("Backend tracking routing exception:", e.message);
      return res.status(500).json({ success: false, error: e.message });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = Number(process.env.PORT) || 3000;

  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}/`);
  });
}

startServer().catch(console.error);

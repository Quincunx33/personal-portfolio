interface PortraitEnv {
  PORTRAIT_ENCRYPTED_ASSET?: string;
  PORTRAIT_IMAGE_KEY?: string;
  ASSETS?: { fetch(input: Request | URL | string): Promise<Response> };
}
interface PagesFunctionContext { request: Request; env: PortraitEnv; }
const MAGIC = new TextEncoder().encode("GPR1");
const noStoreHeaders = { "Cache-Control": "private, no-store, max-age=0", "X-Content-Type-Options": "nosniff", "Cross-Origin-Resource-Policy": "same-origin", "Referrer-Policy": "no-referrer" };
function decodeBase64(value: string) { const normalized = value.replace(/-/g, "+").replace(/_/g, "/"); const binary = atob(normalized + "=".repeat((4 - normalized.length % 4) % 4)); return Uint8Array.from(binary, c => c.charCodeAt(0)); }
function encodeBase64(value: Uint8Array) { let binary = ""; value.forEach(byte => binary += String.fromCharCode(byte)); return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, ""); }
export async function onRequestGet({ request, env }: PagesFunctionContext): Promise<Response> {
  if (request.headers.get("X-Portrait-Client") !== "canvas-v1" || request.headers.get("Sec-Fetch-Dest") === "document") return new Response("Direct Access Blocked", { status: 403, headers: noStoreHeaders });
  try {
    if (!env.PORTRAIT_IMAGE_KEY) throw new Error("portrait key missing");
    const stored = env.PORTRAIT_ENCRYPTED_ASSET
      ? decodeBase64(env.PORTRAIT_ENCRYPTED_ASSET)
      : env.ASSETS
        ? new Uint8Array(await (await env.ASSETS.fetch(new URL("/secure/guitar-portrait.enc", request.url))).arrayBuffer())
        : new Uint8Array();
    const master = decodeBase64(env.PORTRAIT_IMAGE_KEY.trim());
    if (master.length !== 32 || stored.length < 33 || !stored.slice(0, 4).every((byte, i) => byte === MAGIC[i])) throw new Error("invalid asset");
    const source = await crypto.subtle.decrypt({ name: "AES-GCM", iv: stored.slice(4, 16), tagLength: 128 }, await crypto.subtle.importKey("raw", master, "AES-GCM", false, ["decrypt"]), stored.slice(16));
    const sessionKey = crypto.getRandomValues(new Uint8Array(32)), iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv, tagLength: 128 }, await crypto.subtle.importKey("raw", sessionKey, "AES-GCM", false, ["encrypt"]), source));
    const envelope = new Uint8Array(16 + encrypted.length); envelope.set(MAGIC); envelope.set(iv, 4); envelope.set(encrypted, 16);
    return new Response(envelope, { headers: { ...noStoreHeaders, "Content-Type": "application/octet-stream", "X-Portrait-Key": encodeBase64(sessionKey) } });
  } catch { return new Response("Portrait unavailable", { status: 503, headers: noStoreHeaders }); }
}

import { useEffect, useRef, useState } from "react";

const MAGIC = "GPR1";
const IV_BYTES = 12;
const TAG_BYTES = 16;
const FALLBACK_TEXTURE = "/assets/taaissu-hero-texture.jpg";

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export function SecurePortraitCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let disposed = false;
    let bitmap: ImageBitmap | undefined;
    const controller = new AbortController();

    async function drawFallbackCanvas(canvas: HTMLCanvasElement) {
      try {
        const img = new Image();
        img.src = FALLBACK_TEXTURE;
        await new Promise<void>((resolve, reject) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = reject;
          }
        });
        if (disposed) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = img.naturalWidth || 600;
        canvas.height = img.naturalHeight || 800;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        if (!disposed) setLoaded(true);
      } catch {
        // Fallback drawing failure handled safely
      }
    }

    async function render() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        const response = await fetch("/api/secure-media/portrait", {
          credentials: "same-origin",
          headers: { "X-Portrait-Client": "canvas-v1" },
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          await drawFallbackCanvas(canvas);
          return;
        }

        const keyHeader = response.headers.get("X-Portrait-Key");
        if (!keyHeader) {
          await drawFallbackCanvas(canvas);
          return;
        }

        const envelope = new Uint8Array(await response.arrayBuffer());
        const header = new TextDecoder().decode(envelope.subarray(0, 4));
        if (header !== MAGIC || envelope.length <= 4 + IV_BYTES + TAG_BYTES) {
          await drawFallbackCanvas(canvas);
          return;
        }

        const key = await crypto.subtle.importKey(
          "raw",
          decodeBase64Url(keyHeader),
          { name: "AES-GCM" },
          false,
          ["decrypt"]
        );
        const plaintext = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv: envelope.slice(4, 4 + IV_BYTES), tagLength: 128 },
          key,
          envelope.slice(4 + IV_BYTES)
        );
        if (disposed) return;

        const decodedBitmap = await createImageBitmap(new Blob([plaintext]));
        if (disposed) {
          decodedBitmap.close();
          return;
        }
        bitmap = decodedBitmap;
        const context = canvas.getContext("2d");
        if (!context) return;
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        context.drawImage(bitmap, 0, 0);
        if (!disposed) setLoaded(true);
      } catch (error) {
        if (!disposed && (error as Error).name !== "AbortError") {
          if (canvas) {
            await drawFallbackCanvas(canvas);
          }
        }
      }
    }

    void render();
    return () => {
      disposed = true;
      controller.abort();
      bitmap?.close();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="Tasfiya Tabassum portrait visual — systems & web engineer"
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        if (event.button === 2) event.preventDefault();
      }}
    >
      {loaded ? "Tasfiya Tabassum portrait" : "Loading portrait"}
    </canvas>
  );
}

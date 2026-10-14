import { useEffect, useRef, useState } from "react";

const MAGIC = "GPR1";
const IV_BYTES = 12;
const TAG_BYTES = 16;

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export function SecurePortraitCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    let bitmap: ImageBitmap | undefined;
    const controller = new AbortController();

    async function render() {
      try {
        const response = await fetch("/api/secure-media/portrait", {
          credentials: "same-origin",
          headers: { "X-Portrait-Client": "canvas-v1" },
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Portrait request failed: ${response.status}`);
        const keyHeader = response.headers.get("X-Portrait-Key");
        if (!keyHeader) throw new Error("Portrait key missing");

        const envelope = new Uint8Array(await response.arrayBuffer());
        const header = new TextDecoder().decode(envelope.subarray(0, 4));
        if (header !== MAGIC || envelope.length <= 4 + IV_BYTES + TAG_BYTES) {
          throw new Error("Invalid portrait envelope");
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
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas unavailable");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        context.drawImage(bitmap, 0, 0);
      } catch (error) {
        if (!disposed && (error as Error).name !== "AbortError") {
          console.error("[Secure portrait]", error);
          setFailed(true);
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
      aria-label={failed ? "Portrait unavailable" : "Tasfiya Tabassum playing guitar on a wooden balcony in the Himalayan hills"}
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        if (event.button === 2) event.preventDefault();
      }}
    >
      {failed ? "Portrait unavailable" : "Loading portrait"}
    </canvas>
  );
}

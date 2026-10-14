interface PortraitEnv {
  PORTRAIT_IMAGE_KEY?: string;
  ASSETS: {
    fetch(input: Request | URL | string): Promise<Response>;
  };
}

interface PagesFunctionContext {
  request: Request;
  env: PortraitEnv;
}

const noStoreHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Referrer-Policy": "no-referrer",
};

function decodeBase64(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export async function onRequestGet({ request, env }: PagesFunctionContext): Promise<Response> {
  if (!env.PORTRAIT_IMAGE_KEY) {
    return new Response("Portrait secret is not configured.", {
      status: 503,
      headers: noStoreHeaders,
    });
  }

  let keyBytes: Uint8Array;
  try {
    keyBytes = decodeBase64(env.PORTRAIT_IMAGE_KEY.trim());
  } catch {
    return new Response("Portrait secret is invalid.", {
      status: 503,
      headers: noStoreHeaders,
    });
  }

  if (keyBytes.byteLength !== 32) {
    return new Response("Portrait secret is invalid.", {
      status: 503,
      headers: noStoreHeaders,
    });
  }

  try {
    const encryptedAsset = await env.ASSETS.fetch(
      new URL("/secure/guitar-portrait.enc", request.url)
    );
    if (!encryptedAsset.ok) {
      return new Response("Portrait asset is unavailable.", {
        status: 404,
        headers: noStoreHeaders,
      });
    }

    const envelope = new Uint8Array(await encryptedAsset.arrayBuffer());
    const header = new TextDecoder().decode(envelope.subarray(0, 4));
    if (header !== "GPR1" || envelope.byteLength < 32) {
      return new Response("Portrait asset is invalid.", {
        status: 500,
        headers: noStoreHeaders,
      });
    }

    const iv = envelope.slice(4, 16);
    const ciphertextAndTag = envelope.slice(16);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );
    const image = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv, tagLength: 128 },
      cryptoKey,
      ciphertextAndTag
    );

    return new Response(image, {
      headers: {
        ...noStoreHeaders,
        "Content-Type": "image/webp",
        "Content-Disposition": 'inline; filename="guitar-portrait.webp"',
      },
    });
  } catch {
    return new Response("Portrait could not be decrypted.", {
      status: 500,
      headers: noStoreHeaders,
    });
  }
}

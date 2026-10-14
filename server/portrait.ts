import { randomBytes, createDecipheriv, createCipheriv } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const MAGIC = Buffer.from("GPR1");
const IV_BYTES = 12;
const KEY_BYTES = 32;
const TAG_BYTES = 16;
const PRIVATE_ASSET = path.resolve(process.cwd(), "server/private/guitar-portrait.enc");

function base64Url(value: Buffer) {
  return value.toString("base64url");
}

function readMasterKey() {
  const encoded = process.env.PORTRAIT_IMAGE_KEY?.trim();
  if (!encoded) throw new Error("PORTRAIT_IMAGE_KEY is not configured");
  const key = Buffer.from(encoded, "base64url");
  if (key.length !== KEY_BYTES) throw new Error("PORTRAIT_IMAGE_KEY must decode to 32 bytes");
  return key;
}

async function decryptStoredEnvelope(envelope: Buffer) {
  if (!envelope.subarray(0, 4).equals(MAGIC) || envelope.length < 4 + IV_BYTES + TAG_BYTES + 1) {
    throw new Error("Invalid portrait envelope");
  }
  const iv = envelope.subarray(4, 4 + IV_BYTES);
  const ciphertext = envelope.subarray(4 + IV_BYTES, -TAG_BYTES);
  const tag = envelope.subarray(-TAG_BYTES);
  const decipher = createDecipheriv("aes-256-gcm", readMasterKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

export async function createPortraitEnvelope() {
  const stored = await readFile(PRIVATE_ASSET);
  const image = await decryptStoredEnvelope(stored);
  const sessionKey = randomBytes(KEY_BYTES);
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", sessionKey, iv);
  const ciphertext = Buffer.concat([cipher.update(image), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    envelope: Buffer.concat([MAGIC, iv, ciphertext, tag]),
    sessionKey: base64Url(sessionKey),
  };
}

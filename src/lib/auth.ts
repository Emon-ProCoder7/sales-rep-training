// Signed-cookie auth for the single shared site password.
// Uses Web Crypto (crypto.subtle) so it works identically in the Edge
// middleware runtime and the Node API route runtime.

export const AUTH_COOKIE_NAME = "beige_auth";

const encoder = new TextEncoder();

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signToken(secret: string, expiresAtMs: number): Promise<string> {
  const key = await getKey(secret);
  const payload = String(expiresAtMs);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${toHex(sig)}`;
}

export async function verifyToken(secret: string, token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payload, sigHex] = token.split(".");
  if (!payload || !sigHex) return false;

  const expiresAtMs = Number(payload);
  if (!Number.isFinite(expiresAtMs) || Date.now() > expiresAtMs) return false;

  const key = await getKey(secret);
  const expectedSig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const expectedHex = toHex(expectedSig);

  if (expectedHex.length !== sigHex.length) return false;
  let diff = 0;
  for (let i = 0; i < expectedHex.length; i++) {
    diff |= expectedHex.charCodeAt(i) ^ sigHex.charCodeAt(i);
  }
  return diff === 0;
}

export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

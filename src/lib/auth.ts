import crypto from "crypto";

const SESSION_COOKIE_NAME = "advaita_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Configurable credentials with secure fallbacks
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "advaita@2026";
const ADMIN_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.ADMIN_JWT_SECRET ||
  "advaita-tattva-heritage-admin-secret-2026";

export interface SessionPayload {
  username: string;
  iat: number;
  exp: number;
}

export function getAdminCredentials() {
  return {
    username: ADMIN_USERNAME,
    // Provide masked password indication
    isCustomPassword: Boolean(process.env.ADMIN_PASSWORD),
  };
}

export function verifyCredentials(username: string, password: string): boolean {
  if (!username || !password) return false;
  const usernameMatch = username.trim().toLowerCase() === ADMIN_USERNAME.toLowerCase();
  const passwordMatch = password === ADMIN_PASSWORD;
  return usernameMatch && passwordMatch;
}

export function createSessionToken(username: string): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    username,
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): {
  valid: boolean;
  username?: string;
} {
  if (!token || typeof token !== "string") {
    return { valid: false };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false };
  }

  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(encodedPayload)
    .digest("base64url");

  // Constant time comparison to prevent timing attacks
  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expectedSignature);
  if (
    sigBuffer.length !== expBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expBuffer)
  ) {
    return { valid: false };
  }

  try {
    const payloadJson = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const payload: SessionPayload = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now) {
      return { valid: false };
    }

    return { valid: true, username: payload.username };
  } catch {
    return { valid: false };
  }
}

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS };

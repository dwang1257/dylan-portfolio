import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const OWNER_COOKIE = "krillion_owner";

export const OWNER_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

export function safeEqual(a, b) {
  const x = createHash("sha256").update(a).digest();
  const y = createHash("sha256").update(b).digest();
  return timingSafeEqual(x, y);
}

export function ownerToken() {
  const passcode = process.env.KRILLION_PASSCODE;
  if (!passcode) return null;
  return createHmac("sha256", passcode).update("krillion-owner").digest("hex");
}

export function isOwnerToken(value) {
  const token = ownerToken();
  return Boolean(token && value && safeEqual(value, token));
}

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { Redis } from "@upstash/redis";

export const PLAYERS = [
  { id: "dylan", name: "Dylan", start: 0 },
  { id: "akshay", name: "Akshay", start: 1 },
];

export const OWNER_COOKIE = "krillion_owner";
export const UPLOAD_PREFIX = "krillion/";
export const CAPTION_LIMIT = 280;

const SCORES_KEY = "krillion:scores";
const SHOTS_KEY = "krillion:shots";
const UNLOCK_ATTEMPTS = 10;
const UNLOCK_WINDOW_SECONDS = 15 * 60;

let client;

function redis() {
  client ??= new Redis({
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  return client;
}

function safeEqual(a, b) {
  const x = createHash("sha256").update(a).digest();
  const y = createHash("sha256").update(b).digest();
  return timingSafeEqual(x, y);
}

export function ownerToken() {
  const passcode = process.env.KRILLION_PASSCODE;
  if (!passcode) return null;
  return createHmac("sha256", passcode).update("krillion-owner").digest("hex");
}

export function passcodeMatches(input) {
  const passcode = process.env.KRILLION_PASSCODE;
  return Boolean(passcode) && safeEqual(input, passcode);
}

export async function isOwner() {
  const token = ownerToken();
  const value = (await cookies()).get(OWNER_COOKIE)?.value;
  return Boolean(token && value && safeEqual(value, token));
}

export async function assertOwner() {
  if (!(await isOwner())) throw new Error("Unauthorized");
}

export async function consumeUnlockAttempt() {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const key = `krillion:unlock:${ip}`;
  const [attempts] = await redis()
    .multi()
    .incr(key)
    .expire(key, UNLOCK_WINDOW_SECONDS, "NX")
    .exec();
  return attempts <= UNLOCK_ATTEMPTS;
}

export async function getScores() {
  const stored = (await redis().hgetall(SCORES_KEY)) ?? {};
  return PLAYERS.map(({ id, name, start }) => ({
    id,
    name,
    score: Number(stored[id] ?? start),
  }));
}

export async function changeScore(id, delta) {
  const tx = redis().multi();
  PLAYERS.forEach((player) => tx.hsetnx(SCORES_KEY, player.id, player.start));
  tx.hincrby(SCORES_KEY, id, delta);
  const results = await tx.exec();
  if (results.at(-1) < 0) await redis().hset(SCORES_KEY, { [id]: 0 });
}

export async function getShots() {
  const stored = (await redis().hgetall(SHOTS_KEY)) ?? {};
  return Object.values(stored).sort((a, b) => b.createdAt - a.createdAt);
}

export async function getShot(id) {
  return redis().hget(SHOTS_KEY, id);
}

export async function saveShot(shot) {
  await redis().hset(SHOTS_KEY, { [shot.id]: shot });
}

export async function removeShot(id) {
  await redis().hdel(SHOTS_KEY, id);
}

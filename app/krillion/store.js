import { cookies, headers } from "next/headers";
import { Redis } from "@upstash/redis";
import { OWNER_COOKIE, isOwnerToken, safeEqual } from "./session";

export const PLAYERS = [
  { id: "dylan", name: "Dylan", start: 0 },
  { id: "akshay", name: "Akshay", start: 1 },
];

export const UPLOAD_PREFIX = "krillion/";
export const CAPTION_LIMIT = 280;

const RESULTS_KEY = "krillion:results";
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

export function passcodeMatches(input) {
  const passcode = process.env.KRILLION_PASSCODE;
  return Boolean(passcode) && safeEqual(input, passcode);
}

export async function isOwner() {
  return isOwnerToken((await cookies()).get(OWNER_COOKIE)?.value);
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

export async function getDays() {
  const stored = (await redis().hgetall(RESULTS_KEY)) ?? {};
  const days = new Map();
  for (const [field, score] of Object.entries(stored)) {
    const [date, id] = field.split(":");
    if (!days.has(date)) {
      days.set(date, { date, ...Object.fromEntries(PLAYERS.map((player) => [player.id, null])) });
    }
    days.get(date)[id] = Number(score);
  }
  return [...days.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export async function saveResults(date, scores) {
  const tx = redis().multi();
  for (const [id, score] of Object.entries(scores)) {
    const field = `${date}:${id}`;
    if (score === null) tx.hdel(RESULTS_KEY, field);
    else tx.hset(RESULTS_KEY, { [field]: score });
  }
  await tx.exec();
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

"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { del, head } from "@vercel/blob";
import { OWNER_COOKIE, OWNER_COOKIE_OPTIONS, ownerToken } from "./session";
import {
  CAPTION_LIMIT,
  PLAYERS,
  UPLOAD_PREFIX,
  assertOwner,
  consumeUnlockAttempt,
  getShot,
  passcodeMatches,
  removeShot,
  saveResults,
  saveShot,
} from "./store";
import { currentDay } from "./day";

function cleanCaption(caption) {
  return String(caption ?? "").trim().slice(0, CAPTION_LIMIT);
}

export async function unlock(_state, formData) {
  if (!(await consumeUnlockAttempt())) {
    return { error: "Too many attempts. Try again later." };
  }
  const passcode = String(formData.get("passcode") ?? "");
  if (!passcodeMatches(passcode)) return { error: "Wrong passcode." };
  (await cookies()).set(OWNER_COOKIE, ownerToken(), OWNER_COOKIE_OPTIONS);
  redirect("/krillion");
}

export async function lock() {
  (await cookies()).delete(OWNER_COOKIE);
}

function cleanScore(value) {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const score = Number(value);
  if (!Number.isInteger(score) || Math.abs(score) > 1e9) throw new Error("Invalid score");
  return score;
}

export async function saveDay(date, scores) {
  await assertOwner();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || date > currentDay()) {
    throw new Error("Invalid date");
  }
  await saveResults(
    date,
    Object.fromEntries(PLAYERS.map((player) => [player.id, cleanScore(scores?.[player.id])]))
  );
  refresh();
}

export async function addShot({ url, width, height }) {
  await assertOwner();
  const blob = await head(url);
  if (!blob.pathname.startsWith(UPLOAD_PREFIX) || !blob.contentType.startsWith("image/")) {
    throw new Error("Invalid screenshot");
  }
  await saveShot({
    id: randomUUID(),
    url: blob.url,
    width: Math.round(Number(width)) || 1600,
    height: Math.round(Number(height)) || 1000,
    caption: "",
    createdAt: Date.now(),
  });
  refresh();
}

export async function updateCaption(id, caption) {
  await assertOwner();
  const shot = await getShot(id);
  if (!shot) return;
  await saveShot({ ...shot, caption: cleanCaption(caption) });
  refresh();
}

export async function deleteShot(id) {
  await assertOwner();
  const shot = await getShot(id);
  if (!shot) return;
  await del(shot.url);
  await removeShot(id);
  refresh();
}

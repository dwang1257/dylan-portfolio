"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { del, head } from "@vercel/blob";
import {
  CAPTION_LIMIT,
  OWNER_COOKIE,
  PLAYERS,
  UPLOAD_PREFIX,
  assertOwner,
  changeScore,
  consumeUnlockAttempt,
  getShot,
  ownerToken,
  passcodeMatches,
  removeShot,
  saveShot,
} from "./store";

function cleanCaption(caption) {
  return String(caption ?? "").trim().slice(0, CAPTION_LIMIT);
}

export async function unlock(_state, formData) {
  if (!(await consumeUnlockAttempt())) {
    return { error: "Too many attempts. Try again later." };
  }
  const passcode = String(formData.get("passcode") ?? "");
  if (!passcodeMatches(passcode)) return { error: "Wrong passcode." };
  (await cookies()).set(OWNER_COOKIE, ownerToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  redirect("/krillion");
}

export async function lock() {
  (await cookies()).delete(OWNER_COOKIE);
}

export async function adjustScore(id, delta) {
  await assertOwner();
  if (!PLAYERS.some((player) => player.id === id) || ![1, -1].includes(delta)) {
    throw new Error("Invalid score change");
  }
  await changeScore(id, delta);
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

"use client";

import { useActionState } from "react";
import { lock, unlock } from "./actions";

export default function OwnerControls({ owner, unlocking }) {
  const [state, formAction, pending] = useActionState(unlock, { error: null });

  if (owner) {
    return (
      <form action={lock}>
        <button type="submit" className="text-gray-700 hover:text-white transition-colors duration-200">
          lock
        </button>
      </form>
    );
  }

  if (!unlocking) return null;

  return (
    <form action={formAction} className="flex flex-col items-end gap-2">
      <input
        type="password"
        name="passcode"
        autoFocus
        required
        autoComplete="current-password"
        aria-label="Passcode"
        className="w-40 bg-transparent border-b border-gray-800 focus:border-gray-500 outline-none text-white py-1 text-right"
      />
      {pending && <span className="text-sm text-gray-500">checking…</span>}
      {!pending && state.error && <span className="text-sm text-gray-400">{state.error}</span>}
    </form>
  );
}

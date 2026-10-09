"use client";

import { useActionState, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { lock, unlock } from "./actions";

function typing(target) {
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

export default function OwnerControls({ owner, unlocking }) {
  const [state, formAction, pending] = useActionState(unlock, { error: null });
  const [open, setOpen] = useState(unlocking);

  useEffect(() => {
    if (owner) return;
    function reveal() {
      flushSync(() => setOpen(true));
    }
    function onKey(event) {
      if (event.key !== "e" || event.metaKey || event.ctrlKey || event.altKey) return;
      if (typing(event.target) || document.querySelector("[aria-modal]")) return;
      event.preventDefault();
      reveal();
    }
    window.addEventListener("krillion:unlock", reveal);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("krillion:unlock", reveal);
      window.removeEventListener("keydown", onKey);
    };
  }, [owner]);

  if (owner) {
    return (
      <form action={lock}>
        <button type="submit" className="text-gray-700 hover:text-white transition-colors duration-200">
          lock
        </button>
      </form>
    );
  }

  if (!open) return null;

  return (
    <form action={formAction} className="h-0 -mt-1 flex flex-col items-end gap-2">
      <input
        type="text"
        name="username"
        value="dylan"
        readOnly
        tabIndex={-1}
        autoComplete="username"
        aria-hidden="true"
        className="sr-only"
      />
      <input
        type="password"
        name="passcode"
        autoFocus
        required
        autoComplete="current-password"
        aria-label="Passcode"
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="w-40 bg-transparent border-b border-gray-800 focus:border-gray-500 outline-none text-white py-1 text-right"
      />
      <button type="submit" tabIndex={-1} className="sr-only">
        Unlock
      </button>
      {pending && <span className="text-sm text-gray-500">checking…</span>}
      {!pending && state.error && <span className="text-sm text-gray-400">{state.error}</span>}
    </form>
  );
}

"use client";

import { useEffect } from "react";

const SKIP_CLASS = "skip-animations";

export default function SkipAnimations() {
  useEffect(() => {
    const root = document.documentElement;
    function skip() {
      root.classList.add(SKIP_CLASS);
    }

    window.addEventListener("pointerdown", skip, { once: true });
    return () => {
      window.removeEventListener("pointerdown", skip);
      root.classList.remove(SKIP_CLASS);
    };
  }, []);

  return null;
}

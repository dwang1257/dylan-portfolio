"use client";

import { useEffect } from "react";

export default function SkipAnimations() {
  useEffect(() => {
    function finish() {
      document.getAnimations().forEach((animation) => animation.finish());
    }

    window.addEventListener("pointerdown", finish, { once: true });
    return () => window.removeEventListener("pointerdown", finish);
  }, []);

  return null;
}

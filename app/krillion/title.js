"use client";

import { useRef } from "react";

export default function Title() {
  const taps = useRef({ count: 0, last: 0 });

  function onClick(event) {
    const now = event.timeStamp;
    taps.current.count = now - taps.current.last < 500 ? taps.current.count + 1 : 1;
    taps.current.last = now;
    if (taps.current.count < 3) return;
    taps.current.count = 0;
    window.getSelection()?.removeAllRanges();
    window.dispatchEvent(new Event("krillion:unlock"));
  }

  return (
    <h1 onClick={onClick} className="text-xl sm:text-2xl font-semibold text-gray-200 touch-manipulation">
      krillion
    </h1>
  );
}

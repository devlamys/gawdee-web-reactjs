/* Developed by Grafizen International PVT. LTD. */
"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ScrollableRow({ children }) {
  const scrollRef = useRef(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;

    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft < maxScroll - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });

    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">

      {!isTouchDevice && showLeft && (
        <div className="absolute left-0 top-0 h-full w-[60px] bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none z-10" />
      )}

      {!isTouchDevice && showRight && (
        <div className="absolute right-0 top-0 h-full w-[60px] bg-gradient-to-l from-white via-white/50 to-transparent pointer-events-none z-10" />
      )}

      {!isTouchDevice && showLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {!isTouchDevice && showRight && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur"
        >
          <ChevronRight size={22} />
        </button>
      )}

      <div
        ref={scrollRef}
        className="
          flex gap-5 px-2 py-[10px]
          overflow-x-auto overflow-y-hidden
          no-scrollbar scroll-smooth
          touch-pan-x
        "
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </div>
    </div>
  );
}
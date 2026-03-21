"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { animate } from "framer-motion";

const COLOURS = [
  "#0D0D0D", // 0 Hero
  "#F0EDE8", // 1 Why
  "#0D0D0D", // 2 About
  "#F0EDE8", // 3 Guilt
  "#0D0D0D", // 4 Ratings
  "#0D0D0D", // 5 FAQ
  "#00A862", // 6 Leaderboard
  "#F0EDE8", // 7 StillNotConvinced
];

/** Colour flood finishes first; scroll is slower and ends after the blend. */
const FLOOD_DURATION = 0.95;
const SCROLL_DURATION = 1.45;
const SCROLL_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

export default function SnapController({
  children,
}: {
  children: React.ReactNode[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const floodRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const currentIndex = useRef(0);
  const [bgColour, setBgColour] = useState(COLOURS[0]);
  const touchStartY = useRef(0);

  const goTo = useCallback((index: number) => {
    if (isAnimating.current) return;
    const clamped = Math.max(0, Math.min(index, COLOURS.length - 1));
    if (clamped === currentIndex.current) return;

    isAnimating.current = true;
    const nextColour = COLOURS[clamped];

    const target = clamped * window.innerHeight;

    if (floodRef.current) {
      floodRef.current.style.backgroundColor = nextColour;
      floodRef.current.style.transform = "scaleY(0)";
    }

    const floodAnim = floodRef.current
      ? animate(
          floodRef.current,
          { scaleY: [0, 1] },
          { duration: FLOOD_DURATION, ease: SCROLL_EASE }
        )
      : null;

    const scrollAnim = animate(containerRef.current!.scrollTop, target, {
      duration: SCROLL_DURATION,
      ease: SCROLL_EASE,
      onUpdate: (v) => {
        if (containerRef.current) containerRef.current.scrollTop = v;
      },
    });

    Promise.all([
      scrollAnim.then(() => undefined),
      floodAnim ? floodAnim.then(() => undefined) : Promise.resolve(),
    ]).then(() => {
      setBgColour(nextColour);
      if (floodRef.current) {
        floodRef.current.style.transition = "none";
        floodRef.current.style.transform = "scaleY(0)";
      }
      currentIndex.current = clamped;
      isAnimating.current = false;
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1;
      goTo(currentIndex.current + dir);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 30)
        goTo(currentIndex.current + (delta > 0 ? 1 : -1));
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [goTo]);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        position: "relative",
        backgroundColor: bgColour,
      }}
    >
      <div
        ref={floodRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          transform: "scaleY(0)",
          transformOrigin: "bottom",
          pointerEvents: "none",
          backgroundColor: "transparent",
        }}
      />
      <div
        id="snap-container"
        ref={containerRef}
        style={{
          height: "100vh",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}


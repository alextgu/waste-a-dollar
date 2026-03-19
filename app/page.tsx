"use client";

import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import WhySection from "@/components/WhySection";
import AboutAlex from "@/components/AboutAlex";
import GuiltSection from "@/components/GuiltSection";
import Ratings from "@/components/Ratings";
import Leaderboard from "@/components/Leaderboard";
import FAQ from "@/components/FAQ";
import StillNotConvinced from "@/components/StillNotConvinced";
import DonateModal from "@/components/DonateModal";
import Footer from "@/components/Footer";

export default function Home() {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donationCount, setDonationCount] = useState(0);
  const [donationTotal, setDonationTotal] = useState(0);
  const videoSrc: string | undefined = undefined;
  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  const prevSectionRef = useRef<number>(0);
  const didTriggerWhyExitDownRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch("/api/donations/stats", { cache: "no-store" });
        const json = (await res.json()) as { count?: unknown; total?: unknown };
        const count =
          typeof json.count === "number" && Number.isFinite(json.count)
            ? json.count
            : 0;
        const total =
          typeof json.total === "number" && Number.isFinite(json.total)
            ? json.total
            : 0;
        if (!cancelled) {
          setDonationCount(count);
          setDonationTotal(total);
        }
      } catch (e) {
        console.error("Failed to fetch donation count:", e);
      }
    };

    const id = setTimeout(() => void run(), 0);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, []);

  // Trigger when user scrolls down past page 2 (WhySection) into page 3 (AboutAlex).
  // Emits a window event you can hook animations into:
  //   window.addEventListener("why:exitDown", () => { ... })
  useEffect(() => {
    const root = scrollRootRef.current;
    if (!root) return;

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("[data-snap-section]")
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most-visible section
        let bestIdx = -1;
        let bestRatio = 0;
        for (const e of entries) {
          const idx = Number(
            (e.target as HTMLElement).getAttribute("data-snap-index")
          );
          if (Number.isFinite(idx) && e.intersectionRatio > bestRatio) {
            bestRatio = e.intersectionRatio;
            bestIdx = idx;
          }
        }

        if (bestIdx < 0) return;
        const prev = prevSectionRef.current;
        if (
          !didTriggerWhyExitDownRef.current &&
          prev === 1 &&
          bestIdx === 2
        ) {
          didTriggerWhyExitDownRef.current = true;
          window.dispatchEvent(new CustomEvent("why:exitDown"));
        }
        prevSectionRef.current = bestIdx;
      },
      {
        root,
        threshold: [0.55, 0.7, 0.85],
      }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // (Removed) Custom wheel/slow scroll hijack — back to native CSS snap.

  return (
    <div
      ref={scrollRootRef}
      id="snap-container"
      className="no-scrollbar h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory bg-[#0D0D0D]"
    >
      <div
        data-snap-section
        data-snap-index="0"
        className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden bg-[#F0EDE8]"
      >
        <Hero
          onDonateClick={() => setIsDonateModalOpen(true)}
          videoSrc={videoSrc}
          donationCount={donationCount}
          donationTotal={donationTotal}
        />
      </div>

      <div
        data-snap-section
        data-snap-index="1"
        className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden"
      >
        <WhySection onDonateClick={() => setIsDonateModalOpen(true)} />
      </div>

      <div
        data-snap-section
        data-snap-index="2"
        className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden"
      >
        <AboutAlex />
      </div>

      <div
        data-snap-section
        data-snap-index="3"
        className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden"
      >
        <GuiltSection onDonateClick={() => setIsDonateModalOpen(true)} />
      </div>

      <div
        data-snap-section
        data-snap-index="4"
        className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden"
      >
        <Ratings />
      </div>

      <div
        data-snap-section
        data-snap-index="5"
        className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden"
      >
        <FAQ />
      </div>

      <div
        data-snap-section
        data-snap-index="6"
        className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden"
      >
        <Leaderboard />
      </div>

      <div
        data-snap-section
        data-snap-index="7"
        className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden"
      >
        <StillNotConvinced onDonateClick={() => setIsDonateModalOpen(true)} />
        <Footer />
      </div>

      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
      />
    </div>
  );
}

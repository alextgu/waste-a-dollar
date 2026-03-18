"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import TheCase from "@/components/TheCase";
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

  return (
    <div className="no-scrollbar h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory bg-[#0D0D0D]">
      {/* First snap panel is slightly taller than viewport to allow a small scroll-through graphic,
          then snap continues to the next panel as normal. */}
      <div className="no-scrollbar h-[120vh] shrink-0 snap-start overflow-hidden">
        <Hero
          onDonateClick={() => setIsDonateModalOpen(true)}
          videoSrc={videoSrc}
          donationCount={donationCount}
          donationTotal={donationTotal}
        />

        {/* Scroll-through graphic placeholder (replace later) */}
        <div className="mx-auto flex h-[20vh] max-w-6xl items-center justify-center px-6">
          <div className="w-full rounded-[28px] border border-black/10 bg-white/40 px-6 py-5 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-medium text-black/70">
                Scroll a bit. There is more.
              </div>
              <div className="text-sm font-semibold text-[#00A862]">
                (Graphic goes here)
              </div>
            </div>
            <div className="mt-3 h-[10px] w-full overflow-hidden rounded-full bg-black/10">
              <div className="h-full w-[35%] rounded-full bg-[#00A862]" />
            </div>
          </div>
        </div>
      </div>

      <div className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden">
        <TheCase />
      </div>

      <div className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden">
        <AboutAlex />
      </div>

      <div className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden">
        <GuiltSection onDonateClick={() => setIsDonateModalOpen(true)} />
      </div>

      <div className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden">
        <Ratings />
      </div>

      <div className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden">
        <FAQ />
      </div>

      <div className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden">
        <Leaderboard />
      </div>

      <div className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden">
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

"use client";

import { useEffect, useState } from "react";
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
      <div className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden bg-[#F0EDE8]">
        <Hero
          onDonateClick={() => setIsDonateModalOpen(true)}
          videoSrc={videoSrc}
          donationCount={donationCount}
          donationTotal={donationTotal}
        />
      </div>

      <div className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden">
        <WhySection onDonateClick={() => setIsDonateModalOpen(true)} />
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

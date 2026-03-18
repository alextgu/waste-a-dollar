"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
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
  const [totalDonations, setTotalDonations] = useState(0);

  useEffect(() => {
    const fetchDonationCount = async () => {
      try {
        const response = await fetch("/api/donations");
        const json = (await response.json()) as { data?: unknown[] };
        setTotalDonations(Array.isArray(json.data) ? json.data.length : 0);
      } catch (error) {
        console.error("Failed to fetch donation count:", error);
      }
    };

    fetchDonationCount();
  }, []);

  return (
    <div className="no-scrollbar h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory bg-[#0D0D0D]">
      <Navbar onDonateClick={() => setIsDonateModalOpen(true)} />

      <div className="no-scrollbar h-screen shrink-0 snap-start overflow-hidden">
        <Hero
          onDonateClick={() => setIsDonateModalOpen(true)}
          totalDonations={totalDonations}
        />
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

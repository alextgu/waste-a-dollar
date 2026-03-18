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
    <main className="min-h-screen">
      <Navbar onDonateClick={() => setIsDonateModalOpen(true)} />
      <Hero
        onDonateClick={() => setIsDonateModalOpen(true)}
        totalDonations={totalDonations}
      />
      <TheCase />
      <AboutAlex />
      <GuiltSection onDonateClick={() => setIsDonateModalOpen(true)} />
      <Ratings />
      <Leaderboard />
      <FAQ />
      <StillNotConvinced onDonateClick={() => setIsDonateModalOpen(true)} />
      <Footer />
      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
      />
    </main>
  );
}

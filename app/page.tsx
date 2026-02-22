import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import HeroTwo from "./sections/HeroTwo";
import WhatYourMoneyCanDo from "./sections/WhatYourMoneyCanDo";
import Ratings from "./sections/Ratings";
import FAQ from "./sections/FAQ";
import Leaderboard from "./sections/Leaderboard";
import StillNotConvinced from "./sections/StillNotConvinced";
import Footer from "./sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <HeroTwo />
        <WhatYourMoneyCanDo />
        <Ratings />
        <FAQ />
        <Leaderboard />
        <StillNotConvinced />
      </main>
      <Footer />
    </div>
  );
}

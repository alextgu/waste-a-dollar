import {
  HeroOne as Hero,
  HeroTwo,
  MoneyCanDoThree as WhatYourMoneyCanDo,
  RatingsFour as Ratings,
  FAQFive as FAQ,
  LeaderboardSix as Leaderboard,
  StillNotConvincedSeven as StillNotConvinced,
} from "./sections";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
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

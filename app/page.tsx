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
    <div className="no-scrollbar h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory bg-[var(--color-background)]">
      <Navbar />
      <main>
        <Hero />
        <WhatYourMoneyCanDo />
        <HeroTwo />
        <Ratings />
        <FAQ />
        <Leaderboard />
        <div className="no-scrollbar h-screen shrink-0 snap-start overflow-y-auto overflow-x-hidden">
          <StillNotConvinced connectFooter />
          <Footer />
        </div>
      </main>
    </div>
  );
}

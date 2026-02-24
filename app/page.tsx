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
    <div className="h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory bg-[var(--color-background)]">
      <Navbar />
      <main>
        <Hero />
        <WhatYourMoneyCanDo />
        <HeroTwo />
        <Ratings />
        <FAQ />
        <Leaderboard />
        <StillNotConvinced />
      </main>
      {/* Last page: full viewport but free scroll inside so user can see all footer content */}
      <div className="h-screen shrink-0 snap-start overflow-y-auto overflow-x-hidden">
        <Footer />
      </div>
    </div>
  );
}

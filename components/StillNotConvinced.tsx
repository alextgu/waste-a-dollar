"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import CoinGame from "./CoinGame";

interface StillNotConvincedProps {
  onDonateClick: () => void;
}

export default function StillNotConvinced({
  onDonateClick,
}: StillNotConvincedProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showCoinGame, setShowCoinGame] = useState(false);

  const games = [
    {
      title: "Story Mode",
      description:
        "Experience a short narrative about Alex and the dollar. It is brief. It is dramatic.",
      status: "Coming Soon",
      available: false,
    },
    {
      title: "Roll the Coin",
      description:
        "Watch your dollar roll into a donation collector, like at McDonald's.",
      status: "Play",
      available: true,
    },
    {
      title: "Claw Machine",
      description: "Attempt to win Alex's approval via claw machine.",
      status: "Coming Soon",
      available: false,
    },
  ];

  const handleGameClick = (game: (typeof games)[number]) => {
    if (game.available) setShowCoinGame(true);
  };

  const handleCoinGameClose = () => setShowCoinGame(false);

  const handleDonateFromCoinGame = () => {
    setShowCoinGame(false);
    onDonateClick();
  };

  return (
    <>
      <section className="bg-[#F0EDE8] py-32 text-[#0D0D0D]">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="mb-16 text-center"
          >
            <motion.p
              variants={fadeUp}
              className="mb-4 text-sm font-medium tracking-wide text-[#FFD600]"
            >
              A LAST RESORT
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mb-4 text-5xl font-bold tracking-tight md:text-6xl"
              style={{ letterSpacing: "-0.03em" }}
            >
              Fine. Play a game.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto max-w-3xl text-xl font-light text-gray-700"
            >
              We have provided entertainment. In exchange, consider the dollar.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-3"
          >
            {games.map((game, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className={`group border border-[rgba(255,214,0,0.15)] bg-white p-8 transition-all duration-300 ${
                  game.available
                    ? "cursor-pointer hover:border-[#FFD600]"
                    : "opacity-60"
                }`}
                whileHover={game.available ? { y: -4 } : {}}
                onClick={() => handleGameClick(game)}
              >
                <h3
                  className="mb-4 text-2xl font-bold tracking-tight"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {game.title}
                </h3>
                <p className="mb-6 font-light leading-relaxed text-gray-700">
                  {game.description}
                </p>
                <motion.button
                  className={`w-full py-3 font-medium ${
                    game.available
                      ? "bg-[#FFD600] text-[#0D0D0D] hover:shadow-[0_0_20px_rgba(255,214,0,0.4)]"
                      : "cursor-not-allowed bg-gray-200 text-gray-500"
                  }`}
                  whileHover={game.available ? { scale: 1.03 } : {}}
                  whileTap={game.available ? { scale: 0.98 } : {}}
                  disabled={!game.available}
                >
                  {game.status}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showCoinGame && (
          <CoinGame
            onClose={handleCoinGameClose}
            onDonateClick={handleDonateFromCoinGame}
          />
        )}
      </AnimatePresence>
    </>
  );
}


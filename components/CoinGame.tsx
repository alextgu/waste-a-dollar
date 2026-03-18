"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CoinGameProps {
  onClose: () => void;
  onDonateClick: () => void;
}

export default function CoinGame({ onClose, onDonateClick }: CoinGameProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handlePlay = () => {
    setIsAnimating(true);
    setShowMessage(false);

    setTimeout(() => {
      setIsAnimating(false);
      setShowMessage(true);
    }, 3000);
  };

  useEffect(() => {
    const id = setTimeout(() => {
      handlePlay();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative w-full max-w-2xl bg-[#F0EDE8] p-8 text-[#0D0D0D]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl transition-colors hover:text-[#FFD600]"
        >
          ×
        </button>

        <h3
          className="mb-2 text-3xl font-bold tracking-tight"
          style={{ letterSpacing: "-0.03em" }}
        >
          Roll the Coin
        </h3>
        <p className="mb-8 font-light text-gray-700">
          Watch your dollar roll into a donation collector, like at McDonald&apos;s.
        </p>

        <div className="relative mb-6 h-96 overflow-hidden rounded-lg bg-gradient-to-b from-[#0D0D0D] to-[#1a1a1a]">
          <svg
            className="h-full w-full"
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="coinGradient">
                <stop offset="0%" stopColor="#FFD600" />
                <stop offset="100%" stopColor="#FFA500" />
              </radialGradient>
            </defs>

            <path
              d="M 200 50 Q 250 100, 200 150 Q 150 200, 200 250 Q 250 300, 200 350"
              fill="none"
              stroke="rgba(255,214,0,0.2)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />

            <circle cx="200" cy="360" r="30" fill="rgba(255,214,0,0.1)" />
            <circle cx="200" cy="360" r="20" fill="rgba(255,214,0,0.2)" />
            <circle cx="200" cy="360" r="10" fill="rgba(255,214,0,0.3)" />

            <AnimatePresence>
              {isAnimating && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.circle
                    cx="200"
                    cy="50"
                    r="20"
                    fill="url(#coinGradient)"
                    stroke="#FFA500"
                    strokeWidth="2"
                    animate={{
                      cy: [50, 150, 250, 350],
                      cx: [200, 250, 150, 200],
                      rotate: [0, 360, 720, 1080],
                    }}
                    transition={{
                      duration: 3,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  />
                  <motion.text
                    x="200"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#0D0D0D"
                    fontSize="16"
                    fontWeight="bold"
                    animate={{
                      y: [50, 150, 250, 350],
                      x: [200, 250, 150, 200],
                    }}
                    transition={{
                      duration: 3,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    $1
                  </motion.text>
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
        </div>

        <AnimatePresence>
          {showMessage ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 text-center"
            >
              <p className="text-xl font-light">
                That felt good. Now do it for real.
              </p>
              <div className="flex justify-center gap-4">
                <motion.button
                  onClick={onDonateClick}
                  className="bg-[#FFD600] px-8 py-3 font-medium text-[#0D0D0D]"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Donate Now
                </motion.button>
                <motion.button
                  onClick={handlePlay}
                  className="border border-[#0D0D0D] px-8 py-3 font-medium text-[#0D0D0D]"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Watch Again
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center font-light text-gray-600"
            >
              Watching the coin roll...
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}


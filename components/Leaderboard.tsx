"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { fadeUp, slideInLeft, staggerContainer } from "@/lib/animations";

interface LeaderboardEntry {
  rank: number;
  name: string;
  created_at: string;
}

export default function Leaderboard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/donations/leaderboard");
      const result = (await response.json()) as { data?: LeaderboardEntry[] };
      setData(result.data ?? []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      void fetchLeaderboard();
    }, 0);
    const interval = setInterval(() => {
      void fetchLeaderboard();
    }, 30000);
    return () => {
      clearTimeout(id);
      clearInterval(interval);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const visibleRows = data.slice(0, 8);

  return (
    <section className="flex h-full items-center bg-[#F0EDE8] py-12 text-[#0D0D0D] md:py-16">
      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="mb-10 text-center md:mb-12"
        >
          <motion.p
            variants={fadeUp}
            className="mb-4 text-sm font-medium tracking-wide text-[#FFD600]"
          >
            THE BOARD
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-bold tracking-tight md:text-5xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            People who made the correct decision.
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="overflow-hidden border border-[rgba(255,214,0,0.15)] bg-white"
        >
          {loading ? (
            <div className="p-10 text-center font-light text-gray-500">
              Loading the board...
            </div>
          ) : data.length === 0 ? (
            <motion.div variants={fadeUp} className="p-10 text-center">
              <p className="text-xl font-light text-gray-700">
                The board is empty. You could be first. Think about that.
              </p>
            </motion.div>
          ) : (
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#0D0D0D] text-white">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium tracking-wide md:px-6 md:py-4 md:text-sm">
                      RANK
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium tracking-wide md:px-6 md:py-4 md:text-sm">
                      NAME
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium tracking-wide md:px-6 md:py-4 md:text-sm">
                      DATE DONATED
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((entry, index) => (
                    <motion.tr
                      key={`${entry.rank}-${entry.created_at}-${index}`}
                      custom={index}
                      initial="hidden"
                      animate={isInView ? "visible" : "hidden"}
                      variants={slideInLeft}
                      className={`cursor-pointer border-b border-gray-200 transition-colors duration-200 hover:bg-[#FFD600] hover:bg-opacity-10 ${
                        entry.rank === 1 ? "bg-[#FFD600] bg-opacity-20" : ""
                      }`}
                    >
                      <td className="px-5 py-3 md:px-6 md:py-4">
                        <span
                          className={`font-bold ${
                            entry.rank === 1 ? "text-xl text-[#FFD600]" : ""
                          }`}
                        >
                          #{entry.rank}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-medium md:px-6 md:py-4 md:text-base">
                        {entry.name}
                      </td>
                      <td className="px-5 py-3 text-sm font-light text-gray-600 md:px-6 md:py-4 md:text-base">
                        {formatDate(entry.created_at)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-6 text-center text-sm font-light text-gray-500"
        >
          Updates every 30 seconds{data.length > visibleRows.length ? " • Showing latest 8" : ""}
        </motion.p>
      </div>
    </section>
  );
}


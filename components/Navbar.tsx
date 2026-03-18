"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface NavbarProps {
  onDonateClick: () => void;
}

export default function Navbar({ onDonateClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed left-0 right-0 top-0 z-50 bg-[#0D0D0D] transition-all duration-300 ${
        scrolled ? "border-b border-[#FFD600]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <motion.div
          className="text-xl font-bold tracking-tight text-[#FFD600]"
          style={{ letterSpacing: "-0.03em" }}
        >
          waste a dollar.
        </motion.div>

        <motion.button
          onClick={onDonateClick}
          className="bg-[#FFD600] px-6 py-2.5 font-medium text-[#0D0D0D] transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,214,0,0.4)]"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            boxShadow: [
              "0 0 0px rgba(255,214,0,0)",
              "0 0 15px rgba(255,214,0,0.3)",
              "0 0 0px rgba(255,214,0,0)",
            ],
          }}
          transition={{
            boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          Donate $1
        </motion.button>
      </div>
    </motion.nav>
  );
}


"use client";
import { motion } from "framer-motion";

export const SectionWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: false, margin: "-10%" }}
    transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
    className="min-h-screen w-full flex flex-col items-center justify-center p-8"
  >
    {children}
  </motion.div>
);
"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="border-t border-[#FFD600] bg-[#0D0D0D] py-12 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <motion.div
            className="text-xl font-bold tracking-tight text-[#FFD600]"
            style={{ letterSpacing: "-0.03em" }}
            whileHover={{ scale: 1.05 }}
          >
            waste a dollar.
          </motion.div>

          <div className="text-center font-light text-gray-400">
            © {new Date().getFullYear()} Alex. All dollars reserved.
          </div>

          <div className="flex gap-6 text-sm">
            <motion.a
              href="#"
              className="group relative font-light text-gray-400 transition-colors hover:text-[#FFD600]"
              whileHover={{ y: -2 }}
            >
              Privacy
              <span className="absolute bottom-0 left-0 h-px w-0 bg-[#FFD600] transition-all duration-300 group-hover:w-full" />
            </motion.a>
            <motion.a
              href="#"
              className="group relative font-light text-gray-400 transition-colors hover:text-[#FFD600]"
              whileHover={{ y: -2 }}
            >
              Contact
              <span className="absolute bottom-0 left-0 h-px w-0 bg-[#FFD600] transition-all duration-300 group-hover:w-full" />
            </motion.a>
            <motion.a
              href="#"
              className="group relative font-light text-gray-400 transition-colors hover:text-[#FFD600]"
              whileHover={{ y: -2 }}
            >
              Certificate Portal
              <span className="absolute bottom-0 left-0 h-px w-0 bg-[#FFD600] transition-all duration-300 group-hover:w-full" />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
}


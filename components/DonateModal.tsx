"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutResponse =
  | { url: string }
  | { error: string };

export default function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const resetAndClose = () => {
    setName("");
    setEmail("");
    setError("");
    setShowExitConfirm(false);
    onClose();
  };

  const handleClose = () => {
    if (!showExitConfirm && (name || email)) {
      setShowExitConfirm(true);
      return;
    }
    resetAndClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = (await response.json()) as CheckoutResponse;
      if (!response.ok) {
        throw new Error("error" in data ? data.error : "Failed to start checkout");
      }

      if (!("url" in data) || !data.url) {
        throw new Error("Stripe did not return a checkout URL.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="relative w-full max-w-md bg-[#F0EDE8] p-8 text-[#0D0D0D]"
            onClick={(e) => e.stopPropagation()}
          >
            {!showExitConfirm && (
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 transition-colors hover:text-[#FFD600]"
              >
                <X className="h-6 w-6" />
              </button>
            )}

            {showExitConfirm ? (
              <div className="text-center">
                <h3
                  className="mb-4 text-3xl font-bold tracking-tight"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  Are you sure?
                </h3>
                <p className="mb-8 font-light text-gray-700">
                  You were so close to making the correct decision.
                </p>
                <div className="flex flex-col gap-3">
                  <motion.button
                    onClick={() => setShowExitConfirm(false)}
                    className="bg-[#FFD600] py-3 font-medium text-[#0D0D0D]"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue Donating
                  </motion.button>
                  <motion.button
                    onClick={resetAndClose}
                    className="border border-gray-400 py-3 font-medium text-gray-600"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Leave Anyway
                  </motion.button>
                </div>
              </div>
            ) : (
              <>
                <h3
                  className="mb-2 text-3xl font-bold tracking-tight"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  Confirm Your Dollar.
                </h3>
                <p className="mb-8 font-light text-gray-700">
                  You are about to do the right thing.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 bg-white px-4 py-3 transition-colors focus:border-[#FFD600] focus:outline-none"
                      required
                      disabled={isSubmitting}
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 bg-white px-4 py-3 transition-colors focus:border-[#FFD600] focus:outline-none"
                      required
                      disabled={isSubmitting}
                      autoComplete="email"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700"
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    className="w-full bg-[#FFD600] py-4 text-lg font-medium text-[#0D0D0D] transition-shadow hover:shadow-[0_0_30px_rgba(255,214,0,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
                    whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Redirecting..." : "Confirm Donation — $1"}
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={handleClose}
                    className="w-full border border-gray-400 py-3 font-medium text-gray-600"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                  >
                    Are you sure you want to leave?
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


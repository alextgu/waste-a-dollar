"use client";

import { useEffect } from "react";
import { BMC_URL } from "./BMCButton";

type DonateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function DonateModal({ isOpen, onClose }: DonateModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <span className="text-sm font-medium text-zinc-300">
            Buy me a coffee
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <iframe
          title="Buy me a coffee"
          src={BMC_URL}
          className="h-full w-full flex-1 border-0"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
}

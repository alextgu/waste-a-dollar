"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is this a real donation page?",
    a: "Yes, the Stripe flow is real — but this FAQ is just a visual mock for now.",
  },
  {
    q: "Where does the money go?",
    a: "Straight to Alex’s account, not a charity. This is fully about vibes.",
  },
  {
    q: "Can I get a refund?",
    a: "Treat this like tipping your favorite creator — psychologically non-refundable.",
  },
  {
    q: "Why does everything look so expensive?",
    a: "The palette does most of the heavy lifting: Aero Loonie Gold, Expensive Black, and Cream White.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      className="flex h-screen shrink-0 snap-start snap-always items-center justify-center bg-[var(--color-white)] px-6 py-20 text-[var(--color-black)]"
      data-bg="white"
    >
      <div className="w-full max-w-xl">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold leading-tight text-[var(--color-black)]">
            Frequently asked questions
          </h1>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-black)]/70">
            faq · ask questions to me
          </p>
          <p className="mt-1 text-xs text-[var(--color-black)]/60">
            Curious, skeptical, overthinking it — this is where you put it into
            words.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <button
                key={item.q}
                type="button"
                onClick={() => setOpenIndex(idx === openIndex ? -1 : idx)}
                className={[
                  "group flex w-full flex-col rounded-2xl border px-4 py-3 text-left transition-all duration-300",
                  "border-[rgba(13,13,13,0.12)] bg-[rgba(240,237,232,0.65)] backdrop-blur-md",
                  isOpen
                    ? "scale-[1.01] border-[var(--color-gold)] shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                    : "hover:border-[rgba(13,13,13,0.32)] hover:bg-[rgba(240,237,232,0.9)]",
                ].join(" ")}
                style={{
                  transitionTimingFunction: isOpen
                    ? "cubic-bezier(0.16, 1, 0.3, 1)"
                    : "cubic-bezier(0.33, 1, 0.68, 1)",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[var(--color-black)]">
                    {item.q}
                  </span>
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-[rgba(13,13,13,0.18)] bg-[rgba(255,255,255,0.4)] text-[10px] text-[var(--color-black)]/80">
                    <span
                      className="block transition-transform duration-200 group-hover:scale-110"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      +
                    </span>
                  </span>
                </div>

                <div
                  className="overflow-hidden text-xs text-[var(--color-black)]/75 transition-[max-height,opacity,transform] duration-300"
                  style={{
                    maxHeight: isOpen ? "120px" : "0px",
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? "translateY(0px)" : "translateY(-6px)",
                    backdropFilter: "blur(18px)",
                  }}
                >
                  <div className="mt-2 rounded-2xl border border-[rgba(13,13,13,0.08)] bg-[rgba(255,255,255,0.8)] px-3 py-2">
                    {item.a}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

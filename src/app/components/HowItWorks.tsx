"use client";

import { HowItWorksProps } from "./types";

const STEPS = [
  { number: "1", label: "Paste or select a message" },
  { number: "2", label: "Dual-layer analysis runs" },
  { number: "3", label: "Get an explained verdict" },
] as const;

export default function HowItWorks({ className = "" }: HowItWorksProps) {
  return (
    <div className={`flex items-center justify-center gap-8 px-6 py-6 ${className}`} role="list" aria-label="How it works">
      {STEPS.map((step, i) => (
        <div key={i} className="flex flex-col items-center gap-2" role="listitem">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-accent bg-background text-accent font-bold text-sm font-mono-tight z-10">
            {step.number}
          </div>
          {i < STEPS.length - 1 && (
            <div className="absolute left-full w-8 h-0.5 bg-card-border -ml-4" aria-hidden="true" />
          )}
          <span className="text-xs text-muted-foreground text-center max-w-[120px] leading-snug">{step.label}</span>
        </div>
      ))}
      <style jsx>{`
        .flex.flex-col.items-center.gap-2 { position: relative; }
        .flex.flex-col.items-center.gap-2:last-child .absolute { display: none; }
      `}</style>
    </div>
  );
}
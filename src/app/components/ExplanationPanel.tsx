"use client";

import { ExplanationPanelProps } from "./types";

export default function ExplanationPanel({ explanation, className = "" }: ExplanationPanelProps) {
  return (
    <div
      className={`p-4 rounded-[6px] border border-card-border bg-card ${className}`}
      role="region"
      aria-label="Analysis explanation"
    >
      <h3 className="label-text mb-2">
        Why this verdict
      </h3>
      <p className="text-sm leading-relaxed text-foreground">{explanation}</p>
    </div>
  );
}
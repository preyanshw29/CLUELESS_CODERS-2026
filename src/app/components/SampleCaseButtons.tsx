"use client";

import { SampleCaseButtonsProps } from "./types";
import { Loader2 } from "lucide-react";

const SAMPLES = [
  { id: "bank", label: "Fake Bank KYC", description: "Urgent account verification request" },
  { id: "hr", label: "HR Phishing Email", description: "Fake policy update with malicious link" },
  { id: "legitimate", label: "Legitimate Notice", description: "Routine security notification" },
] as const;

export default function SampleCaseButtons({ onLoadSample, isLoading, className = "" }: SampleCaseButtonsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`} role="group" aria-label="Sample cases">
      {SAMPLES.map((sample) => (
        <button
          key={sample.id}
          type="button"
          onClick={() => onLoadSample(sample.id as "bank" | "hr" | "legitimate")}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-card border border-card-border rounded-[6px] hover:bg-card-hover hover:border-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="font-semibold">{sample.label}</span>
          <span className="text-xs text-muted hidden sm:inline">{sample.description}</span>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted" />}
        </button>
      ))}
    </div>
  );
}
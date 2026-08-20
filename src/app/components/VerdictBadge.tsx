"use client";

import { VerdictBadgeProps } from "./types";

const VERDICT_CONFIG = {
  Phishing: { label: "Phishing", tier: "red" },
  "Social Engineering": { label: "Social Engineering", tier: "red" },
  Suspicious: { label: "Suspicious", tier: "amber" },
  Legitimate: { label: "Legitimate", tier: "green" },
} as const;

const TIER_STYLES = {
  green: { bg: "bg-risk-green-bg", border: "border-risk-green", text: "text-risk-green" },
  amber: { bg: "bg-risk-amber-bg", border: "border-risk-amber", text: "text-risk-amber" },
  red: { bg: "bg-risk-red-bg", border: "border-risk-red", text: "text-risk-red" },
} as const;

export default function VerdictBadge({ verdict, score, className = "" }: VerdictBadgeProps) {
  const config = VERDICT_CONFIG[verdict];
  const styles = TIER_STYLES[config.tier];

  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-[6px] ${styles.bg} border-l-4 ${styles.border} ${className}`}>
      <span className={`font-semibold tracking-tight ${styles.text}`}>{config.label}</span>
      <span className={`font-medium font-mono-tight ${styles.text}/80`}>
        Score: {score}/100
      </span>
    </div>
  );
}
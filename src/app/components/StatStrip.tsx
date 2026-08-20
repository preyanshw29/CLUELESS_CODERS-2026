"use client";

import { StatStripProps } from "./types";
import { TrendingUp, Zap, ShieldOff } from "lucide-react";

const STATS = [
  {
    value: "90%",
    label: "of breaches start with social engineering, not malware",
    icon: TrendingUp,
  },
  {
    value: "<3s",
    label: "average triage time with explainable AI scoring",
    icon: Zap,
  },
  {
    value: "0",
    label: "known-blocklist dependency — catches zero-day attacks",
    icon: ShieldOff,
  },
] as const;

export default function StatStrip({ className = "" }: StatStripProps) {
  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`} role="list" aria-label="Product statistics">
      {STATS.map((stat, i) => (
        <div
          key={i}
          className="relative flex flex-col items-start gap-1 p-3 rounded-[6px] border border-card-border bg-card hover:border-muted transition-colors"
          role="listitem"
          style={{ borderTopWidth: "2px", borderTopColor: "var(--accent)" }}
        >
          <stat.icon className="w-5 h-5 text-accent mb-1" aria-hidden="true" />
          <span className="text-2xl font-bold font-mono-tight text-foreground">{stat.value}</span>
          <span className="text-xs text-muted-foreground leading-snug">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
"use client";

import { useState } from "react";
import { ThreatBadgesProps } from "./types";
import { Info } from "lucide-react";

const FACTOR_DETAILS: Record<string, string> = {
  "High Urgency": "Message pressures immediate action with threats or deadlines",
  "Mismatched Domain": "Sender domain does not match claimed organization",
  "Impersonation of Bank": "Claims to be from a financial institution but isn't verified",
  "Credential Harvesting": "Requests login credentials or sensitive personal data",
  "Suspicious Links": "Contains URLs that redirect to unverified or malicious domains",
  "Generic Greeting": "Uses vague salutations like 'Dear Customer' instead of your name",
  "Poor Grammar/Spelling": "Contains unusual capitalization, spelling errors, or awkward phrasing",
  "Unexpected Attachment": "Includes files you weren't expecting, potentially malicious",
  "Sender Address Mismatch": "Display name doesn't match the actual email address",
  "Urgency Language": "Uses time pressure tactics like 'act now' or 'immediate action required'",
  "Verified Sender": "Email domain matches the claimed organization",
  "No Credential Requests": "Does not ask for passwords, PINs, or sensitive data",
  "Professional Formatting": "Consistent branding, proper grammar, and official tone",
  "Expected Communication": "Matches known communication patterns from this sender",
};

export default function ThreatBadges({ factors, className = "" }: ThreatBadgesProps) {
  const [hoveredFactor, setHoveredFactor] = useState<string | null>(null);

  if (!factors.length) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {factors.map((factor) => (
        <div
          key={factor}
          className="relative group"
          onMouseEnter={() => setHoveredFactor(factor)}
          onMouseLeave={() => setHoveredFactor(null)}
        >
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium rounded-[6px] bg-card text-foreground border border-card-border transition-colors"
          >
            {factor}
            <Info className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity text-muted" />
          </span>
          {hoveredFactor === factor && (
            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-3 py-1.5 text-xs text-foreground bg-card border border-card-border rounded-[6px] shadow-lg whitespace-nowrap z-10 animate-fade-in"
              role="tooltip"
            >
              {FACTOR_DETAILS[factor] || "Security indicator detected during analysis"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
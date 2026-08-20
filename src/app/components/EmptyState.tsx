"use client";

import { EmptyStateProps } from "./types";
import { Shield } from "lucide-react";

export default function EmptyState({ className = "" }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="w-20 h-20 rounded-full border-2 border-card-border flex items-center justify-center mb-4">
        <Shield className="w-10 h-10 text-muted" />
      </div>
      <p className="text-sm text-foreground font-medium mb-1">
        Ready to analyze
      </p>
      <p className="text-xs text-muted-foreground max-w-xs">
        Paste a message or load a sample case to see the threat analysis
      </p>
    </div>
  );
}
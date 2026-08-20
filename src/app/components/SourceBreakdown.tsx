"use client";

import { SourceBreakdownProps } from "./types";

export default function SourceBreakdown({ heuristic_score, llm_score, className = "" }: SourceBreakdownProps) {
  const total = heuristic_score + llm_score;
  const heuristicPct = total > 0 ? Math.round((heuristic_score / total) * 100) : 0;
  const llmPct = total > 0 ? Math.round((llm_score / total) * 100) : 0;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
        <span className="label-text">Heuristic</span>
        <span className="text-muted font-mono-tight">{heuristic_score}</span>
      </div>
      <div className="flex-1 h-1 bg-card-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-1000 ease-out"
          style={{ width: `${heuristicPct}%` }}
        />
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
        <span className="label-text">AI Model</span>
        <span className="text-muted font-mono-tight">{llm_score}</span>
      </div>
    </div>
  );
}
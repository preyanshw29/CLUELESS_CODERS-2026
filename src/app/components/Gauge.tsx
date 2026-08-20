"use client";

import { useEffect, useState } from "react";
import { GaugeProps } from "./types";

const SIZE = 170;
const STROKE_WIDTH = 10;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const TIER_COLORS = {
  green: "#047857",
  amber: "#b45309",
  red: "#b91c1c",
} as const;

function getTierColor(score: number): keyof typeof TIER_COLORS {
  if (score <= 33) return "green";
  if (score <= 66) return "amber";
  return "red";
}

export default function Gauge({ score, verdict, className = "" }: GaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const tier = getTierColor(score);
  const color = TIER_COLORS[tier];
  const offset = CIRCUMFERENCE - (animatedScore / 100) * CIRCUMFERENCE;

  useEffect(() => {
    const duration = 900;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="transform -rotate-90">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={STROKE_WIDTH}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold tabular-nums font-mono-tight text-foreground" style={{ lineHeight: 1 }}>
            {animatedScore}
          </span>
          <span className="label-text mt-1">
            THREAT SCORE
          </span>
        </div>
      </div>
    </div>
  );
}
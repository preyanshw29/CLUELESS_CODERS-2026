export interface ScoringResult {
  finalScore: number;
  verdict: "Phishing" | "Social Engineering" | "Legitimate" | "Suspicious";
  heuristicScore: number;
  llmScore: number;
  aiOffline: boolean;
}

export function calculateRiskScore(
  heuristicScore0to1: number,
  llmScore0to100: number | null, // null if LLM failed/offline
  hasUrls: boolean
): ScoringResult {
  const heuristicComponent = heuristicScore0to1 * 100;
  let finalScore = 0;
  let aiOffline = false;
  let llmScore = 0;

  if (llmScore0to100 === null) {
    // Fallback: heuristic only
    finalScore = Math.round(heuristicComponent);
    aiOffline = true;
  } else {
    llmScore = llmScore0to100;
    // Weighted formula: 0.4 * Heuristic + 0.6 * AI
    finalScore = Math.round(0.4 * heuristicComponent + 0.6 * llmScore);
  }

  // Verdict Mapping based on final combined score and presence of links
  let verdict: "Phishing" | "Social Engineering" | "Legitimate" | "Suspicious" = "Legitimate";

  if (finalScore >= 67) {
    // If high risk, distinguish based on link presence
    verdict = hasUrls ? "Phishing" : "Social Engineering";
  } else if (finalScore >= 34) {
    verdict = "Suspicious";
  } else {
    verdict = "Legitimate";
  }

  return {
    finalScore,
    verdict,
    heuristicScore: Math.round(heuristicComponent),
    llmScore,
    aiOffline,
  };
}

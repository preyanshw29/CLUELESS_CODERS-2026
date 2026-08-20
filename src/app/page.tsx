"use client";

import { useState, useCallback } from "react";
import { Shield } from "lucide-react";
import Gauge from "./components/Gauge";
import VerdictBadge from "./components/VerdictBadge";
import ThreatBadges from "./components/ThreatBadges";
import ExplanationPanel from "./components/ExplanationPanel";
import SourceBreakdown from "./components/SourceBreakdown";
import InputPanel from "./components/InputPanel";
import EmptyState from "./components/EmptyState";
import HowItWorks from "./components/HowItWorks";
import { AnalysisResult } from "./components/types";
import { MOCK_RESULTS } from "./components/mockData";

export default function PhishGuardDashboard() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (text: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const lowerText = text.toLowerCase();
      let mockResult: AnalysisResult;

      if (
        lowerText.includes("bank-verify-kwc") ||
        lowerText.includes("kyc verification") ||
        lowerText.includes("account will be closed")
      ) {
        mockResult = MOCK_RESULTS.bank;
      } else if (
        lowerText.includes("company-services-portal") ||
        lowerText.includes("policy acknowledgment") ||
        lowerText.includes("hr department")
      ) {
        mockResult = MOCK_RESULTS.hr;
      } else if (
        lowerText.includes("quarterly security awareness") ||
        lowerText.includes("security@company.com") ||
        lowerText.includes("informational only")
      ) {
        mockResult = MOCK_RESULTS.legitimate;
      } else {
        mockResult = {
          final_score: 45,
          verdict: "Suspicious",
          threat_factors: ["Generic Greeting", "Unexpected Attachment", "Sender Address Mismatch"],
          explanation:
            "This message has some concerning elements but lacks definitive phishing indicators. Exercise caution and verify through official channels before taking any action.",
          source_breakdown: { heuristic_score: 40, llm_score: 50 },
        };
      }

      setResult(mockResult);
    } catch {
      setError("AI analysis unavailable — showing heuristic result");
      setResult({
        final_score: 50,
        verdict: "Suspicious",
        threat_factors: ["Analysis incomplete"],
        explanation: "Unable to complete full analysis. Please try again or verify independently.",
        source_breakdown: { heuristic_score: 50, llm_score: 0 },
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSample = useCallback((sample: "bank" | "hr" | "legitimate") => {
    analyze(MOCK_RESULTS[sample].explanation);
  }, [analyze]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-card-border px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[6px] flex items-center justify-center bg-accent">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">PhishGuard</h1>
              <p className="text-[11px] text-muted">AI Phishing & Social Engineering Detection</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="space-y-3" aria-labelledby="input-heading">
            <h2 id="input-heading" className="sr-only">Message Input</h2>
            <InputPanel
              onAnalyze={analyze}
              onSampleLoad={loadSample}
              isLoading={isLoading}
            />
          </section>

          <section className="space-y-3" aria-labelledby="results-heading">
            <h2 id="results-heading" className="sr-only">Analysis Results</h2>

            {isLoading && !result && (
              <div className="space-y-3 animate-pulse-subtle" role="status" aria-live="polite">
                <div className="flex justify-center">
                  <div className="w-36 h-36 rounded-full border-4 border-card-border" />
                </div>
                <div className="h-9 w-40 bg-card-border rounded-[6px] mx-auto" />
                <div className="h-7 w-56 bg-card-border rounded-[4px] mx-auto" />
                <div className="h-28 w-full bg-card rounded-[6px] border border-card-border" />
                <div className="h-7 w-1/2 bg-card-border rounded-[4px] mx-auto" />
              </div>
            )}

            {!isLoading && result && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex flex-col items-center gap-2">
                  <Gauge score={result.final_score} verdict={result.verdict} />
                  <VerdictBadge verdict={result.verdict} score={result.final_score} />
                </div>

                <ThreatBadges factors={result.threat_factors} />

                <ExplanationPanel explanation={result.explanation} />

                <div className="pt-2 border-t border-card-border">
                  <SourceBreakdown
                    heuristic_score={result.source_breakdown.heuristic_score}
                    llm_score={result.source_breakdown.llm_score}
                  />
                </div>
              </div>
            )}

            {!isLoading && !result && (
              <EmptyState />
            )}

            {error && !isLoading && (
              <div className="p-3 rounded-[6px] bg-risk-amber-bg border border-risk-amber-border text-risk-amber text-sm" role="alert">
                {error}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="border-t border-card-border px-6 py-3">
        <div className="max-w-5xl mx-auto text-center text-xs text-muted">
          PhishGuard — Explainable phishing detection. Not a substitute for security training.
        </div>
      </footer>

      <HowItWorks />
    </div>
  );
}
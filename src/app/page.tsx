"use client";

import { useState, useCallback, useEffect } from "react";
import { Shield, MessageSquare, History, Check } from "lucide-react";
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

interface AnalysisResultWithId extends AnalysisResult {
  scanId?: string;
}

export default function PhishGuardDashboard() {
  const [result, setResult] = useState<AnalysisResultWithId | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Database-driven features state
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [dbOffline, setDbOffline] = useState(false);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackVerdict, setFeedbackVerdict] = useState("");
  const [feedbackComments, setFeedbackComments] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/scans");
      if (res.ok) {
        const data = await res.json();
        setDbOffline(!!data.dbOffline);
        setHistory(data.scans || []);
      }
    } catch (e) {
      console.error("Failed to load scan history:", e);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const analyze = useCallback(async (text: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setFeedbackOpen(false);
    setFeedbackSubmitted(false);

    const isDemoCase =
      text.toLowerCase().includes("bank-verify-kwc") ||
      text.toLowerCase().includes("company-services-portal") ||
      text.toLowerCase().includes("quarterly security awareness");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: text,
          offlineMode: isDemoCase,
          forceOffline: isDemoCase,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process message analysis.");
      }

      const data = await response.json();
      setResult(data);
      fetchHistory(); // Refresh history log feed
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result?.scanId || !feedbackVerdict) return;

    setFeedbackSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scanId: result.scanId,
          userVerdict: feedbackVerdict,
          comments: feedbackComments,
        }),
      });

      if (response.ok) {
        setFeedbackSubmitted(true);
        setFeedbackOpen(false);
        setFeedbackComments("");
        setFeedbackVerdict("");
        fetchHistory(); // Refresh to display reported flag
      } else {
        alert("Failed to submit feedback.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting feedback.");
    } finally {
      setFeedbackSubmitting(false);
    }
  };

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
          {dbOffline && (
            <span className="text-[10px] bg-risk-red-bg border border-risk-red-border text-risk-red px-2 py-0.5 rounded font-semibold">
              DB Offline
            </span>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-4 space-y-4">
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
              <div className="space-y-3 animate-fade-in relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">Analysis Details</span>
                  {result.scanId && (
                    <button
                      onClick={() => setFeedbackOpen(!feedbackOpen)}
                      className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent transition border border-card-border px-2 py-1 rounded-[4px]"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Report Verdict</span>
                    </button>
                  )}
                </div>

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

                {/* Feedback / Report Form Dropdown */}
                {feedbackOpen && (
                  <form onSubmit={handleSubmitFeedback} className="p-4 rounded-[6px] border border-accent/20 bg-accent/5 space-y-3 mt-3 animate-fade-in">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-accent">Report Incorrect Verdict</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {["Phishing", "Social Engineering", "Suspicious", "Legitimate"].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setFeedbackVerdict(v)}
                          className={`px-3 py-1.5 text-xs font-semibold border rounded-[4px] transition-all ${
                            feedbackVerdict === v
                              ? "bg-accent border-accent text-white"
                              : "bg-card border-card-border text-foreground hover:bg-card-border/50"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Explain why this verdict is incorrect..."
                      value={feedbackComments}
                      onChange={(e) => setFeedbackComments(e.target.value)}
                      className="w-full text-xs p-2 rounded-[4px] border border-card-border bg-card text-foreground focus:outline-none focus:border-accent"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setFeedbackOpen(false)}
                        className="px-3 py-1.5 text-xs border border-card-border rounded-[4px] bg-card text-muted hover:bg-card-border/50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={feedbackSubmitting || !feedbackVerdict}
                        className="px-3 py-1.5 text-xs bg-accent hover:bg-accent/80 text-white rounded-[4px] disabled:opacity-50"
                      >
                        {feedbackSubmitting ? "Submitting..." : "Submit Feedback"}
                      </button>
                    </div>
                  </form>
                )}

                {feedbackSubmitted && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-semibold rounded-[6px] flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Feedback submitted. Thank you for reporting!</span>
                  </div>
                )}
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

        {/* Database History Log Feed */}
        {!dbOffline && history.length > 0 && (
          <div className="bg-card border border-card-border p-6 rounded-[8px] space-y-4">
            <div className="flex items-center gap-2 border-b border-card-border pb-2.5">
              <History className="w-4 h-4 text-muted" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                Recent Scan Logs
              </h3>
            </div>
            
            <div className="divide-y divide-card-border max-h-60 overflow-y-auto pr-1">
              {history.map((scan) => (
                <div key={scan._id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground line-clamp-1">
                      "{scan.rawContent}"
                    </p>
                    <span className="text-[10px] text-muted">
                      {new Date(scan.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {scan.reported && (
                      <span className="text-[9px] bg-risk-red-bg border border-risk-red-border text-risk-red px-1.5 py-0.5 rounded font-semibold">
                        Reported ({scan.reportedVerdict})
                      </span>
                    )}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      scan.verdict === "Phishing"
                        ? "bg-risk-red-bg text-risk-red border-risk-red-border"
                        : scan.verdict === "Social Engineering"
                        ? "bg-risk-amber-bg text-risk-amber border-risk-amber-border"
                        : scan.verdict === "Suspicious"
                        ? "bg-risk-amber-bg text-risk-amber border-risk-amber-border"
                        : "bg-green-500/10 text-green-500 border-green-500/20"
                    }`}>
                      {scan.verdict}
                    </span>
                    <span className="text-[10px] font-semibold text-muted">
                      Score: {scan.final_score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
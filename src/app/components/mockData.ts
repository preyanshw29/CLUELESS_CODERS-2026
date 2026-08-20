import { AnalysisResult } from "./types";

export const MOCK_RESULTS: Record<"bank" | "hr" | "legitimate", AnalysisResult> = {
  bank: {
    final_score: 92,
    verdict: "Phishing",
    threat_factors: [
      "High Urgency",
      "Mismatched Domain",
      "Impersonation of Bank",
      "Credential Harvesting",
      "Suspicious Links",
    ],
    explanation:
      "This message impersonates a bank using a mismatched domain (bank-verify-kwc.com) and creates false urgency with a 24-hour deadline. It directs you to a credential-harvesting link — legitimate banks never request verification via unsolicited links.",
    source_breakdown: { heuristic_score: 88, llm_score: 96 },
  },
  hr: {
    final_score: 78,
    verdict: "Social Engineering",
    threat_factors: [
      "Urgency Language",
      "Mismatched Domain",
      "Suspicious Links",
      "Credential Harvesting",
      "Generic Greeting",
    ],
    explanation:
      "This email mimics an internal HR request but comes from an external domain (company-services-portal.net). It pressures immediate action with a same-day deadline and asks you to click a tracking link — a classic credential-harvesting tactic targeting employees.",
    source_breakdown: { heuristic_score: 72, llm_score: 84 },
  },
  legitimate: {
    final_score: 12,
    verdict: "Legitimate",
    threat_factors: ["Verified Sender", "No Credential Requests", "Professional Formatting", "Expected Communication"],
    explanation:
      "This is a routine internal security reminder from a verified company domain. It requests no credentials, contains no links or attachments, and matches your organization's known communication style. No action is needed.",
    source_breakdown: { heuristic_score: 8, llm_score: 16 },
  },
};
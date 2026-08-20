export interface AnalysisResult {
  final_score: number;
  verdict: "Phishing" | "Social Engineering" | "Legitimate" | "Suspicious";
  threat_factors: string[];
  explanation: string;
  source_breakdown: {
    heuristic_score: number;
    llm_score: number;
  };
}

export interface GaugeProps {
  score: number;
  verdict: AnalysisResult["verdict"];
  className?: string;
}

export interface VerdictBadgeProps {
  verdict: AnalysisResult["verdict"];
  score: number;
  className?: string;
}

export interface ThreatBadgesProps {
  factors: string[];
  className?: string;
}

export interface ExplanationPanelProps {
  explanation: string;
  className?: string;
}

export interface SourceBreakdownProps {
  heuristic_score: number;
  llm_score: number;
  className?: string;
}

export interface InputPanelProps {
  onAnalyze: (text: string) => void;
  onSampleLoad: (sample: "bank" | "hr" | "legitimate") => void;
  isLoading: boolean;
  initialText?: string;
  className?: string;
}

export interface SampleCaseButtonsProps {
  onLoadSample: (sample: "bank" | "hr" | "legitimate") => void;
  isLoading: boolean;
  className?: string;
}

export interface StatStripProps {
  className?: string;
}

export interface EmptyStateProps {
  className?: string;
}

export interface HowItWorksProps {
  className?: string;
}
"use client";

import { useRef, useState } from "react";
import { InputPanelProps } from "./types";
import { Send, Loader2, FileText } from "lucide-react";
import SampleCaseButtons from "./SampleCaseButtons";
import StatStrip from "./StatStrip";

const SAMPLE_TEXTS = {
  bank: `From: Security Team <security@bank-verify-kwc.com>
Subject: URGENT: Your Account Will Be Closed - KYC Verification Required

Dear Customer,

We have detected suspicious activity on your account ending in *4521. As per regulatory requirements, you must complete KYC verification within 24 hours or your account will be permanently closed.

Click here to verify immediately: http://bank-verify-kwc.com/verify/urgent-action-required

Failure to comply will result in:
- Permanent account closure
- Funds held for 90-day investigation
- Credit bureau reporting

Act now to protect your assets.

Security Department
Global Banking Services`,
  hr: `From: HR Department <hr-policy@company-services-portal.net>
Subject: Mandatory Policy Acknowledgment - Action Required by EOD

Hello Team,

Our records show you have not acknowledged the updated Employee Handbook and Data Protection Policy. This is a mandatory requirement for all staff.

Please review and confirm compliance here: https://company-services-portal.net/policy/acknowledge?emp_id=7842

Deadline: End of business today. Non-compliance will be escalated to your manager and may affect payroll processing.

For questions, contact: hr-support@company-services-portal.net

Human Resources
Corporate Compliance Division`,
  legitimate: `From: IT Security <security@company.com>
Subject: Quarterly Security Awareness Reminder

Hi [Employee Name],

This is your quarterly reminder about security best practices. No action is required - this is informational only.

Key reminders:
- Report suspicious emails to security@company.com
- Use the password manager for all credentials
- Enable MFA on all work accounts
- Lock your screen when away from your desk

Our next phishing simulation exercise is scheduled for next month. Results are anonymous and used only for training improvement.

Questions? Contact the IT Help Desk at x4357 or helpdesk@company.com

Thank you,
Information Security Team
[Company Name] - Internal Communications`,
} as const;

export default function InputPanel({ onAnalyze, onSampleLoad, isLoading, initialText = "", className = "" }: InputPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(initialText);
  const [charCount, setCharCount] = useState(initialText.length);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);
    setCharCount(value.length);
  };

  const handleAnalyze = () => {
    if (text.trim() && !isLoading) {
      onAnalyze(text.trim());
    }
  };

  const handleSampleLoad = (sample: "bank" | "hr" | "legitimate") => {
    const sampleText = SAMPLE_TEXTS[sample];
    setText(sampleText);
    setCharCount(sampleText.length);
    textareaRef.current?.focus();
    onSampleLoad(sample);
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedText = await navigator.clipboard.readText();
    setText(pastedText);
    setCharCount(pastedText.length);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-2">
        <SampleCaseButtons onLoadSample={handleSampleLoad} isLoading={isLoading} />
      </div>

      <StatStrip />

      <label htmlFor="message-input" className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
        Message Content
        <span className="text-muted-foreground ml-2 text-[10px] font-normal">(email, SMS, or URL)</span>
      </label>

      <div className="relative">
        <textarea
          ref={textareaRef}
          id="message-input"
          value={text}
          onChange={handleTextChange}
          onPaste={handlePaste}
          disabled={isLoading}
          rows={7}
          className="w-full px-3.5 py-3 text-sm font-mono text-foreground bg-card border border-card-border rounded-[6px] focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:bg-background disabled:text-muted placeholder-muted-foreground transition-colors resize-none"
          placeholder="Paste an email, SMS message, or suspicious URL here..."
          aria-describedby="char-count"
        />
        <div
          id="char-count"
          className="absolute bottom-2 right-3 text-[10px] text-muted-foreground font-mono-tight"
          aria-live="polite"
        >
          {charCount} characters
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isLoading || !text.trim()}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-accent rounded-[6px] hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Analyze
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => navigator.clipboard.readText().then((t) => { setText(t); setCharCount(t.length); })}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-foreground bg-card border border-card-border rounded-[6px] hover:bg-card-hover hover:border-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          Paste from Clipboard
        </button>
      </div>
    </div>
  );
}
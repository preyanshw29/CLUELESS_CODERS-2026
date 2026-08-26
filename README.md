# PhishGuard — AI-Based Phishing & Social Engineering Detection Assistant

Built for **PS57** (Blockchain & Cybersecurity theme), NIT Raipur Internal Hackathon 2026 — the institute selection round for Smart India Hackathon 2026.

> Existing filters only catch known-bad links. PhishGuard catches the psychological manipulation behind an attack — including brand-new, link-free social engineering — and explains *why* in plain language instead of a binary safe/unsafe flag.

Project docs (problem statement, architecture, build rules, phased plan, design spec) live in [`/SIH_FINAL`](./SIH_FINAL).

## How It Works

Input → Local Heuristics + VirusTotal Lookup + LLM Reasoning (parallel) → Rubric-Based Weighted Scoring → Explainable UI

- **Local Heuristics:** Levenshtein-based domain lookalike detection, TLD risk scoring, anchor-tag mismatch detection, urgency-keyword matching
- **Threat Intelligence:** VirusTotal API for real-time URL/domain reputation
- **AI Reasoning:** LLM-based intent and psychological-pressure-tactic analysis — catches link-free social engineering that pure blocklists miss
- **Scoring:** Rubric-based weighted engine combines all three signals into a single 0–100 threat score with a plain-language explanation

## Tech Stack

- **Frontend + Backend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Database:** SQLite with Prisma ORM (analysis history)
- **AI:** Gemini/Claude API
- **Threat Intel:** VirusTotal API

## Getting Started

```bash
npm install
cp .env.example .env.local   # add your real API keys
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

See `.env.example`. You'll need a VirusTotal API key and an LLM provider key (Gemini or Claude). Never commit `.env.local` or any real key.

## Core Design Principles

1. PII is anonymized before every LLM call — no exceptions.
2. The sample test cases work fully offline (hardcoded fallback responses) so the live demo never depends on network/API uptime.
3. Every LLM/API call handles failure gracefully — falls back to heuristic-only scoring rather than breaking.
4. Risk verdicts are always weighted combinations, never a single binary signal.

Full details: see [`/SIH_FINAL/RULES_PhishGuard_PS57.md`](./SIH_FINAL/RULES_PhishGuard_PS57.md).

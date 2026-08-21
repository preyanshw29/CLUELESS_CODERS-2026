import { checkDomainLookalike } from "./levenshtein";
import { checkAnchorMismatch } from "./anchorMismatch";
import { checkTldRisk } from "./tldRisk";
import { checkUrgencyKeywords } from "./urgencyKeywords";
import { checkVirusTotal } from "./virustotal";
import { checkTyposquatting, checkDomainAge } from "./domainChecks";

export interface NormalizedInput {
  rawText: string;
  extractedUrls: string[];
  anchorTags: { displayText: string; href: string }[];
}

export interface HeuristicSignals {
  domainLookalike?: { matchedBrand: string; distance: number };
  anchorMismatch?: boolean;
  riskyTld?: string;
  urgencyKeywords?: string[];
  vtFlagged?: boolean;
  typosquatting?: boolean;
  newDomain?: boolean;
}

export interface HeuristicsOutput {
  heuristicScore: number; // 0 to 1
  signals: HeuristicSignals;
}

export async function runHeuristics(
  input: NormalizedInput,
  options?: {
    brands?: { name: string; domain: string }[];
    tlds?: { tld: string; weight: number }[];
    keywords?: string[];
  }
): Promise<HeuristicsOutput> {
  const signals: HeuristicSignals = {};
  let totalScore = 0;

  // 1. Domain Lookalike check (weight = 0.5)
  const lookalike = checkDomainLookalike(input.extractedUrls, options?.brands);
  if (lookalike && lookalike.suspicious) {
    signals.domainLookalike = {
      matchedBrand: lookalike.matchedBrand,
      distance: lookalike.distance,
    };
    totalScore += 0.5;
  }

  // 2. Anchor Mismatch check (weight = 0.4)
  const mismatch = checkAnchorMismatch(input.anchorTags);
  if (mismatch.mismatched) {
    signals.anchorMismatch = true;
    totalScore += 0.4;
  }

  // 3. TLD Risk check (weight = 0.25 * tld_weight)
  const tldRisk = checkTldRisk(input.extractedUrls, options?.tlds);
  if (tldRisk) {
    signals.riskyTld = tldRisk.tld;
    totalScore += 0.25 * tldRisk.riskWeight;
  }

  // 4. Urgency Keywords check (weight = 0.1 per unique keyword, max 0.3)
  const urgency = checkUrgencyKeywords(input.rawText, options?.keywords);
  if (urgency.matchedPhrases.length > 0) {
    signals.urgencyKeywords = urgency.matchedPhrases;
    const keywordScore = Math.min(0.3, urgency.matchedPhrases.length * 0.1);
    totalScore += keywordScore;
  }

  // 5. Typosquatting check (weight = 0.5)
  const typosquatting = checkTyposquatting(input.extractedUrls);
  if (typosquatting && typosquatting.detected) {
    signals.typosquatting = true;
    totalScore += 0.5;
  }

  // 6. VirusTotal reputation check (weight = 0.6)
  if (input.extractedUrls.length > 0) {
    for (const url of input.extractedUrls) {
      const vtResult = await checkVirusTotal(url);
      if (vtResult && vtResult.malicious) {
        signals.vtFlagged = true;
        totalScore += 0.6;
        break;
      }
    }
  }

  // 7. Domain Age check (weight = 0.5)
  const domainAge = await checkDomainAge(input.extractedUrls);
  if (domainAge && domainAge.newlyRegistered) {
    signals.newDomain = true;
    totalScore += 0.5;
  }

  // Capping the final score at 1.0
  const heuristicScore = Math.min(1.0, totalScore);

  return {
    heuristicScore,
    signals,
  };
}

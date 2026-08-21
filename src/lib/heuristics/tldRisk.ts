import { RISKY_TLDS } from "../riskyTlds";
import { extractDomain } from "./levenshtein";

export interface TldRiskResult {
  tld: string;
  riskWeight: number;
}

export function checkTldRisk(urls: string[], customTlds?: { tld: string; weight: number }[]): TldRiskResult | null {
  const tldList = customTlds || RISKY_TLDS;
  for (const url of urls) {
    const domain = extractDomain(url);
    if (!domain) continue;

    for (const item of tldList) {
      if (domain.endsWith(item.tld)) {
        return {
          tld: item.tld,
          riskWeight: item.weight,
        };
      }
    }
  }

  return null;
}

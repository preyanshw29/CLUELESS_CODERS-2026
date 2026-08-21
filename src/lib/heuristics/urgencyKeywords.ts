import { URGENCY_KEYWORDS } from "../urgencyKeywords";

export interface UrgencyKeywordsResult {
  matchedPhrases: string[];
}

export function checkUrgencyKeywords(text: string, customKeywords?: string[]): UrgencyKeywordsResult {
  const normalized = text.toLowerCase();
  const matchedPhrases: string[] = [];
  const keywordList = customKeywords || URGENCY_KEYWORDS;

  for (const keyword of keywordList) {
    const regex = new RegExp(keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "gi");
    const matches = normalized.match(regex);
    if (matches && matches.length > 0) {
      matchedPhrases.push(keyword);
    }
  }

  return { matchedPhrases };
}

import { extractDomain } from "./levenshtein";

export interface AnchorMismatchResult {
  mismatched: boolean;
  displayDomain?: string;
  hrefDomain?: string;
}

export function checkAnchorMismatch(
  anchorTags: { displayText: string; href: string }[]
): AnchorMismatchResult {
  for (const tag of anchorTags) {
    const href = tag.href.trim();
    const displayText = tag.displayText.trim();

    if (!href || !displayText) continue;

    // Check if the display text contains or resembles a domain/URL
    // e.g., "sbi.co.in" or "http://sbi.co.in" or "www.sbi.co.in"
    const hasDomainPattern = /\.[a-z]{2,}/i.test(displayText) || /^https?:\/\//i.test(displayText);

    if (hasDomainPattern) {
      const displayDomain = extractDomain(displayText);
      const hrefDomain = extractDomain(href);

      // If the display text looks like a domain and it doesn't match the actual href domain
      if (displayDomain && hrefDomain && displayDomain !== hrefDomain) {
        return {
          mismatched: true,
          displayDomain,
          hrefDomain,
        };
      }
    }
  }

  return { mismatched: false };
}

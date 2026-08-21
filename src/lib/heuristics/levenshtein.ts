import { PROTECTED_BRANDS } from "../protectedBrands";

// Helper to calculate Levenshtein distance between two strings
export function getLevenshteinDistance(s1: string, s2: string): number {
  const len1 = s1.length;
  const len2 = s2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[len1][len2];
}

// Helper to extract clean domain (e.g., "sbi-kyc-update.top" from URL or raw string)
export function extractDomain(urlStr: string): string {
  let clean = urlStr.trim().toLowerCase();
  if (!/^https?:\/\//i.test(clean)) {
    clean = "http://" + clean;
  }
  try {
    const parsed = new URL(clean);
    let hostname = parsed.hostname;
    if (hostname.startsWith("www.")) {
      hostname = hostname.slice(4);
    }
    return hostname;
  } catch (e) {
    // If parsing fails, clean it up manually
    return urlStr.replace(/^https?:\/\//i, "").split("/")[0].replace(/^www\./i, "").toLowerCase();
  }
}

export interface LevenshteinResult {
  matchedBrand: string;
  distance: number;
  suspicious: boolean;
}

export function checkDomainLookalike(urls: string[], customBrands?: { name: string; domain: string }[]): LevenshteinResult | null {
  const THRESHOLD = 0.35; // Maximum normalized distance to be considered suspicious/lookalike
  const brandsList = customBrands || PROTECTED_BRANDS;

  for (const url of urls) {
    const domain = extractDomain(url);
    if (!domain) continue;

    for (const brand of brandsList) {
      if (domain === brand.domain) {
        // Exact match of a legitimate domain is not a lookalike attack
        continue;
      }

      const dist = getLevenshteinDistance(domain, brand.domain);
      const maxLen = Math.max(domain.length, brand.domain.length);
      const normalizedDist = dist / maxLen;

      // If the domain is close to a protected brand but not an exact match
      if (normalizedDist > 0 && normalizedDist <= THRESHOLD) {
        return {
          matchedBrand: brand.name,
          distance: dist,
          suspicious: true,
        };
      }

      // Special substring checks: e.g., if a domain contains "sbi" or "hdfcbank" but is not the exact domain
      const brandRoot = brand.domain.split(".")[0];
      if (brandRoot.length > 2 && (domain.includes(brandRoot + "-") || domain.includes("-" + brandRoot))) {
        return {
          matchedBrand: brand.name,
          distance: dist,
          suspicious: true,
        };
      }
    }
  }

  return null;
}

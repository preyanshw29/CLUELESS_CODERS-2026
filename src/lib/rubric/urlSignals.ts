// src/lib/rubric/urlSignals.ts

// Simple Levenshtein-based typosquat check against a list of commonly spoofed brands
const COMMON_BRANDS = ["paypal", "amazon", "microsoft", "google", "apple", "netflix", "bankofamerica", "chase"];

function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

export function checkTyposquatting(domain: string): string | null {
  const clean = domain.toLowerCase().replace(/\.(com|net|org|io|co).*$/, "");
  for (const brand of COMMON_BRANDS) {
    const dist = levenshtein(clean, brand);
    if (dist > 0 && dist <= 2) {
      return `Possible typosquat of "${brand}"`;
    }
  }
  return null;
}

// Domain-age check via free WHOIS-like RDAP (no key required)
export async function getDomainAgeDays(domain: string): Promise<number | null> {
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`);
    if (!res.ok) return null;
    const data = await res.json();
    const registrationEvent = data.events?.find((e: any) => e.eventAction === "registration");
    if (!registrationEvent) return null;
    const registered = new Date(registrationEvent.eventDate);
    return Math.floor((Date.now() - registered.getTime()) / (1000 * 60 * 60 * 24));
  } catch {
    return null; // fail open
  }
}

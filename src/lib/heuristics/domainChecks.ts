import { extractDomain, getLevenshteinDistance } from "./levenshtein";
import { PROTECTED_BRANDS } from "../protectedBrands";

const COMMONLY_SPOOFED_BRANDS = [
  "paypal",
  "amazon",
  "microsoft",
  "google",
  "apple",
  "netflix",
];

// Combine standard brands and root brand domains from protectedBrands seed data
function getBrandRoots(): string[] {
  const roots = new Set(COMMONLY_SPOOFED_BRANDS);
  for (const brand of PROTECTED_BRANDS) {
    const root = brand.domain.split(".")[0];
    if (root && root.length > 2) {
      roots.add(root);
    }
  }
  return Array.from(roots);
}

export interface TyposquattingResult {
  detected: boolean;
  spoofedBrand: string;
}

export function checkTyposquatting(urls: string[]): TyposquattingResult | null {
  const brandRoots = getBrandRoots();

  for (const url of urls) {
    const domain = extractDomain(url);
    if (!domain) continue;

    // Get the root of the extracted domain (e.g. "paypa1" from "paypa1.com")
    const domainRoot = domain.split(".")[0];
    if (!domainRoot) continue;

    for (const brand of brandRoots) {
      if (domainRoot === brand) {
        continue; // Exact match is legitimate brand domain, not typosquatted look-alike
      }

      const distance = getLevenshteinDistance(domainRoot, brand);
      if (distance >= 1 && distance <= 2) {
        return {
          detected: true,
          spoofedBrand: brand,
        };
      }
    }
  }

  return null;
}

export interface DomainAgeResult {
  newlyRegistered: boolean;
  registrationDate?: string;
}

export async function checkDomainAge(urls: string[]): Promise<DomainAgeResult | null> {
  for (const url of urls) {
    const domain = extractDomain(url);
    if (!domain) continue;

    try {
      // Free RDAP lookup service
      const response = await fetch(`https://rdap.org/domain/${domain}`);
      if (!response.ok) {
        continue; // Try next URL or fail open
      }

      const data = await response.json();
      const events = data?.events || [];

      // Find registration/created dates
      const registrationEvent = events.find(
        (e: any) => e.eventAction === "registration" || e.eventAction === "last update of RDAP database" || e.eventAction === "created"
      );

      const dateStr = registrationEvent?.eventDate || data?.events?.[0]?.eventDate;
      if (!dateStr) continue;

      const regDate = new Date(dateStr);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - regDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 30) {
        return {
          newlyRegistered: true,
          registrationDate: regDate.toISOString(),
        };
      }
    } catch (e) {
      console.warn(`RDAP lookup failed for ${domain}:`, e);
      // Fail-open
    }
  }

  return null;
}

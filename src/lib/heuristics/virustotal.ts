import { Buffer } from "buffer";

// Helper to base64url-encode a string without padding
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export interface VirusTotalResult {
  malicious: boolean;
  stats: {
    malicious: number;
    suspicious: number;
    harmless: number;
    undetected: number;
  };
}

export async function checkVirusTotal(url: string): Promise<VirusTotalResult | null> {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) {
    return null; // Fail-open if no key
  }

  try {
    const urlId = base64UrlEncode(url);
    const headers = { "x-apikey": apiKey };

    // 1. Try to GET the URL analysis
    let response = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
      method: "GET",
      headers,
    });

    // 2. If 404, submit the URL for analysis first
    if (response.status === 404) {
      const submitResponse = await fetch("https://www.virustotal.com/api/v3/urls", {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ url }).toString(),
      });

      if (!submitResponse.ok) {
        return null; // Fail-open
      }

      // Re-fetch since it has now been submitted
      response = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
        method: "GET",
        headers,
      });
    }

    if (!response.ok) {
      return null; // Fail-open
    }

    const data = await response.json();
    const stats = data?.data?.attributes?.last_analysis_stats;

    if (!stats) {
      return null;
    }

    const malicious = stats.malicious > 0 || stats.suspicious >= 3;

    return {
      malicious,
      stats: {
        malicious: stats.malicious || 0,
        suspicious: stats.suspicious || 0,
        harmless: stats.harmless || 0,
        undetected: stats.undetected || 0,
      },
    };
  } catch (error) {
    console.error("VirusTotal lookup failed:", error);
    return null; // Fail-open on network/parse errors
  }
}

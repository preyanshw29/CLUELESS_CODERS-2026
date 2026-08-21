export interface TldRisk {
  tld: string;
  weight: number;
}

export const RISKY_TLDS: TldRisk[] = [
  { tld: ".top", weight: 0.8 },
  { tld: ".xyz", weight: 0.7 },
  { tld: ".club", weight: 0.6 },
  { tld: ".work", weight: 0.6 },
  { tld: ".support", weight: 0.6 },
  { tld: ".click", weight: 0.7 },
  { tld: ".loan", weight: 0.7 },
  { tld: ".win", weight: 0.7 },
  { tld: ".gq", weight: 0.75 },
  { tld: ".tk", weight: 0.75 },
];

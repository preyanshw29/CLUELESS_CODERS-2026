export interface ProtectedBrand {
  name: string;
  domain: string;
}

export const PROTECTED_BRANDS: ProtectedBrand[] = [
  { name: "State Bank of India", domain: "sbi.co.in" },
  { name: "HDFC Bank", domain: "hdfcbank.com" },
  { name: "ICICI Bank", domain: "icicibank.com" },
  { name: "Axis Bank", domain: "axisbank.com" },
  { name: "Paytm", domain: "paytm.com" },
  { name: "PhonePe", domain: "phonepe.com" },
  { name: "Income Tax Department India", domain: "incometax.gov.in" },
  { name: "UIDAI (Aadhaar)", domain: "uidai.gov.in" },
  { name: "India Post", domain: "indiapost.gov.in" },
  { name: "Google", domain: "google.com" },
  { name: "Microsoft", domain: "microsoft.com" },
  { name: "Amazon", domain: "amazon.in" },
  { name: "NIT Raipur", domain: "nitrr.ac.in" },
];

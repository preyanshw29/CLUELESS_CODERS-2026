/**
 * Redacts PII (Personally Identifiable Information) from raw text.
 * Covers emails, phone numbers, credit card numbers, and bank account numbers.
 */
export function anonymizePII(text: string): string {
  if (!text) return "";

  let anonymized = text;

  // 1. Email Addresses
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  anonymized = anonymized.replace(emailRegex, "[EMAIL_REDACTED]");

  // 2. Phone Numbers (matches Indian & international formats like +91 9999999999, 09999-999999, (999) 999-9999, etc.)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  anonymized = anonymized.replace(phoneRegex, "[PHONE_REDACTED]");

  // 3. Credit Cards (16 digit formats with spacing/dashes)
  const creditCardRegex = /\b(?:\d{4}[-.\s]?){3}\d{4}\b/g;
  anonymized = anonymized.replace(creditCardRegex, "[CARD_REDACTED]");

  // 4. Generic Account Numbers (large digit sequences, usually 9-18 digits)
  const accountRegex = /\b\d{9,18}\b/g;
  anonymized = anonymized.replace(accountRegex, "[ACCOUNT_REDACTED]");

  return anonymized;
}

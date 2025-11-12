/**
 * Utilities for masking and normalizing phone numbers for display.
 * Designed to be robust across common formats while keeping tel links usable.
 */

// Normalize to digits, preserving leading '+' if present
export function normalizePhone(input: string): string {
  const trimmed = (input || "").trim();
  const plus = trimmed.startsWith("+");
  const digits = trimmed.replace(/[^0-9]/g, "");
  return plus ? `+${digits}` : digits;
}

/**
 * Mask digits in a phone number string while preserving separators and
 * selected parts (country code and area code when present). This is a best-effort
 * approach for display; it does not attempt strict E.164 parsing.
 */
export function maskPhoneDisplay(input: string, opts?: { keepCountry?: boolean; keepArea?: boolean; revealLast?: number; maskChar?: string }) {
  const keepCountry = opts?.keepCountry ?? true;
  const keepArea = opts?.keepArea ?? true;
  const revealLast = Math.max(0, Math.min(6, opts?.revealLast ?? 2));
  const maskChar = opts?.maskChar ?? "\u2022"; // bullet

  const s = (input || "").trim();
  if (!s) return "";

  // Identify country code prefix if present (e.g., "+1 " or "+44")
  let countryPrefix = "";
  let rest = s;
  const mCountry = s.match(/^\+(\d{1,3})([\s-])?/);
  if (mCountry) {
    countryPrefix = `+${mCountry[1]}`;
    rest = s.slice(mCountry[0].length);
  }

  // Identify area code inside parentheses (e.g., (415))
  let areaCode = "";
  const mArea = rest.match(/^\((\d{2,4})\)(.*)$/);
  if (mArea) {
    areaCode = mArea[1];
    rest = (mArea[2] || "").trimStart();
  }

  // Collect all digits from the remainder
  const digitsOnly = rest.replace(/[^0-9]/g, "");
  if (!digitsOnly) {
    // no more digits beyond country/area; just return prefix pieces
    const pieces = [keepCountry ? countryPrefix : mask(countryPrefix, maskChar), keepArea && areaCode ? `(${areaCode})` : areaCode ? `(${mask(areaCode, maskChar)})` : ""].filter(Boolean);
    return pieces.join(" ");
  }

  // Determine which digits to reveal at the end
  const revealedTail = digitsOnly.slice(Math.max(0, digitsOnly.length - revealLast));
  const maskedHead = mask(digitsOnly.slice(0, Math.max(0, digitsOnly.length - revealLast)), maskChar);

  // Reconstruct with preserved separators by mapping over characters, replacing digits from left to right
  let idx = 0; // index in masked+revealed string
  const fullMaskedDigits = maskedHead + revealedTail;
  const rebuilt = rest.replace(/[0-9]/g, () => fullMaskedDigits[idx++] || "");

  // Build final string
  const parts: string[] = [];
  if (countryPrefix) parts.push(keepCountry ? countryPrefix : mask(countryPrefix.replace(/\D/g, ""), maskChar));
  if (areaCode) parts.push(keepArea ? `(${areaCode})` : `(${mask(areaCode, maskChar)})`);
  if (rebuilt) parts.push(rebuilt.trim());
  return parts.join(" ");
}

function mask(s: string, maskChar: string) {
  return s.replace(/\d/g, maskChar);
}

/** Create a tel: URL from a phone string. */
export function telHref(input: string): string {
  const normalized = normalizePhone(input);
  // Remove any leading '+' for tel href, but keep it if E.164 is desired
  // Most dialers accept both forms; we'll keep '+' when present.
  return `tel:${normalized}`;
}
import { describe, it, expect } from "vitest";
import { maskPhoneDisplay, normalizePhone, telHref } from "@/lib/maskPhone";

describe("maskPhoneDisplay", () => {
  it("masks US format with country and area preserved", () => {
    const s = "+1 (415) 555-0198";
    const masked = maskPhoneDisplay(s);
    expect(masked).toMatch(/^\+1 \(415\) .*\d{2}$/); // reveal last 2 digits
    expect(masked.includes("\u2022")).toBe(true);
  });

  it("handles plain digits", () => {
    const s = "14155550198";
    const masked = maskPhoneDisplay(s, { keepCountry: false, keepArea: false, revealLast: 2 });
    expect(masked.endsWith("98")).toBe(true);
  });

  it("preserves separators in international formats", () => {
    const s = "+44 20 7946 0958";
    const masked = maskPhoneDisplay(s, { revealLast: 2 });
    expect(masked.includes("+44")).toBe(true);
    expect(masked.endsWith("58")).toBe(true);
  });
});

describe("normalizePhone & telHref", () => {
  it("normalizes to digits and preserves leading plus", () => {
    expect(normalizePhone("+1 (415) 555-0198")).toBe("+14155550198");
    expect(normalizePhone(" 415-555-0198 ")).toBe("4155550198");
  });
  it("creates tel href", () => {
    expect(telHref("+1 (415) 555-0198")).toBe("tel:+14155550198");
  });
});
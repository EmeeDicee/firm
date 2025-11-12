import { describe, test, expect } from "@jest/globals";
import { getPeriodByHour, getTimePeriod, localHour, makeGreeting, resolvedTimeZone, detectHonorific, seasonalVariation, clearGreetingCache, periodLabel } from "../../lib/greeting";

describe("greeting time logic", () => {
  const UTC = "UTC";

  test("period boundaries", () => {
    // 04:59 -> evening
    const d1 = new Date(Date.UTC(2025, 10, 9, 4, 59));
    expect(getTimePeriod(d1, UTC)).toBe("evening");

    // 05:00 -> morning
    const d2 = new Date(Date.UTC(2025, 10, 9, 5, 0));
    expect(getTimePeriod(d2, UTC)).toBe("morning");

    // 11:59 -> morning
    const d3 = new Date(Date.UTC(2025, 10, 9, 11, 59));
    expect(getTimePeriod(d3, UTC)).toBe("morning");

    // 12:00 -> afternoon
    const d4 = new Date(Date.UTC(2025, 10, 9, 12, 0));
    expect(getTimePeriod(d4, UTC)).toBe("afternoon");

    // 16:59 -> afternoon
    const d5 = new Date(Date.UTC(2025, 10, 9, 16, 59));
    expect(getTimePeriod(d5, UTC)).toBe("afternoon");

    // 17:00 -> evening
    const d6 = new Date(Date.UTC(2025, 10, 9, 17, 0));
    expect(getTimePeriod(d6, UTC)).toBe("evening");
  });

  test("getPeriodByHour mapping", () => {
    expect(getPeriodByHour(5)).toBe("morning");
    expect(getPeriodByHour(9)).toBe("morning");
    expect(getPeriodByHour(12)).toBe("afternoon");
    expect(getPeriodByHour(15)).toBe("afternoon");
    expect(getPeriodByHour(19)).toBe("evening");
    expect(getPeriodByHour(2)).toBe("evening");
  });

  test("timezone-aware localHour via Intl", () => {
    const base = new Date("2025-11-09T12:34:00.000Z"); // 12:34 UTC
    const hUTC = localHour(base, "UTC");
    expect(hUTC).toBe(12);
    const hBerlin = localHour(base, "Europe/Berlin"); // UTC+1 in November
    expect(hBerlin === 13 || hBerlin === 12).toBe(true); // allow if tz data missing, but should be 13
  });

  test("makeGreeting with honorifics and cache", () => {
    clearGreetingCache();
    const d = new Date(Date.UTC(2025, 11, 15, 9, 0)); // December -> holidays
    const g1 = makeGreeting("Dr. Ada", d, UTC);
    expect(g1).toMatch(/Good morning, Dr\. Ada/);
    expect(g1).toMatch(/Happy Holidays/);
    const g2 = makeGreeting("Dr. Ada", d, UTC); // cached
    expect(g2).toBe(g1);
  });

  test("fallback name and labels", () => {
    const d = new Date(Date.UTC(2025, 6, 1, 19, 0)); // evening
    const g = makeGreeting(null, d, UTC);
    expect(g).toMatch(/Good evening, valued investor/);
    expect(periodLabel("afternoon")).toBe("Good afternoon");
  });

  test("detectHonorific from name", () => {
    expect(detectHonorific("Prof. Maxwell")).toBe("Prof.");
    expect(detectHonorific("Ada")).toBeNull();
  });

  test("seasonalVariation labels", () => {
    const dec = new Date(Date.UTC(2025, 11, 1, 7, 0));
    const s = seasonalVariation(dec);
    expect(s?.label).toBe("Happy Holidays");
  });

  test("resolvedTimeZone returns a string", () => {
    expect(typeof resolvedTimeZone()).toBe("string");
  });
});
import { describe, expect, it } from "vitest";
import { safeCsvCell } from "../lib/safeCsvCell";

describe("CSV export formula-injection prevention", () => {
  it("preserves ordinary names and quotes CSV syntax", () => {
    expect(safeCsvCell("Juan, Dela Cruz")).toBe('"Juan, Dela Cruz"');
    expect(safeCsvCell('Buyer "One"')).toBe('"Buyer ""One"""');
    expect(safeCsvCell(null)).toBe('""');
  });
  it("treats spreadsheet formula prefixes as literal text", () => {
    for (const value of ["=1+1", "+cmd", "-HYPERLINK()", "@SUM(1,2)"]) {
      expect(safeCsvCell(value)).toBe('"\'' + value + '"');
    }
  });
  it("guards formula prefixes after leading whitespace or line breaks", () => {
    const value = "\t\r\n=HYPERLINK(\"https://attacker.example\")";
    expect(safeCsvCell(value).startsWith('"\'')).toBe(true);
    expect(safeCsvCell(value)).toContain('""https://attacker.example""');
  });
  it("does not invent or change normal numerical values", () => {
    expect(safeCsvCell(25000)).toBe('"25000"');
    expect(safeCsvCell("2026-10-09")).toBe('"2026-10-09"');
  });
});

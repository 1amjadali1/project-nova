import { NormalizationEngine } from "./normalization";

export type MatchResult = "EXACT_MATCH" | "PARTIAL_MATCH" | "MISMATCH" | "MISSING";

export interface MatchDetail {
  expected: string;
  actual: string;
  result: MatchResult;
}

export class MatchingEngine {

  static compareString(expected?: string | null, actual?: string | null): MatchDetail {
    const e = NormalizationEngine.cleanString(expected);
    const a = NormalizationEngine.cleanString(actual);

    if (!e) return { expected: e, actual: a, result: "MISSING" };
    if (!a) return { expected: e, actual: a, result: "MISSING" };

    if (e === a) return { expected: e, actual: a, result: "EXACT_MATCH" };
    
    // Partial Match logic (e.g. "John Doe" vs "John")
    if (e.includes(a) || a.includes(e)) {
       return { expected: e, actual: a, result: "PARTIAL_MATCH" };
    }

    // Check Levenshtein distance for typos? Keeping it simple for Sprint 9
    return { expected: e, actual: a, result: "MISMATCH" };
  }

  static compareAlphaNumeric(expected?: string | null, actual?: string | null): MatchDetail {
    const e = NormalizationEngine.cleanAlphaNumeric(expected);
    const a = NormalizationEngine.cleanAlphaNumeric(actual);

    if (!e) return { expected: e, actual: a, result: "MISSING" };
    if (!a) return { expected: e, actual: a, result: "MISSING" };

    if (e === a) return { expected: e, actual: a, result: "EXACT_MATCH" };

    return { expected: e, actual: a, result: "MISMATCH" };
  }

  static compareDate(expected?: Date | null, actualString?: string | null): MatchDetail {
    const e = expected ? expected.toISOString().split("T")[0] : "";
    const a = NormalizationEngine.cleanDate(actualString);

    if (!e) return { expected: e, actual: a, result: "MISSING" };
    if (!a) return { expected: e, actual: a, result: "MISSING" };

    if (e === a) return { expected: e, actual: a, result: "EXACT_MATCH" };

    return { expected: e, actual: a, result: "MISMATCH" };
  }
}

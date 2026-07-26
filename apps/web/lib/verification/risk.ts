import { prisma } from "@/lib/prisma";
import { MatchDetail } from "./matching";

export interface MismatchRecord {
  expected: string;
  actual: string;
  riskPoints: number;
  mustMatchFailed: boolean;
}

export class RiskEngine {
  
  static async calculateRisk(
    organizationId: string, 
    documentType: string,
    matchResults: Record<string, MatchDetail>
  ): Promise<{ 
    score: number; 
    level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    mismatchedFields: Record<string, MismatchRecord>;
    matchedFields: Record<string, string>;
  }> {
    
    // 1. Fetch rules for this doc type
    const rules = await prisma.verificationRule.findMany({
      where: {
        organizationId,
        documentType
      }
    });

    const ruleMap = new Map(rules.map(r => [r.fieldName, r]));

    let totalScore = 0;
    const mismatchedFields: Record<string, MismatchRecord> = {};
    const matchedFields: Record<string, string> = {};
    let isCriticalOverride = false;

    for (const [field, detail] of Object.entries(matchResults)) {
      if (detail.result === "EXACT_MATCH" || detail.result === "PARTIAL_MATCH") {
        matchedFields[field] = detail.actual || "Match";
        continue;
      }

      // It's a mismatch or missing
      const rule = ruleMap.get(field);
      const penalty = rule?.mismatchScore || 10; // Default penalty is 10 if no rule

      if (rule?.mustMatch) {
        isCriticalOverride = true;
      }

      totalScore += penalty;
      mismatchedFields[field] = {
        expected: detail.expected,
        actual: detail.actual,
        riskPoints: penalty,
        mustMatchFailed: rule?.mustMatch || false
      };
    }

    // Cap score at 100
    totalScore = Math.min(totalScore, 100);

    let level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
    
    if (isCriticalOverride || totalScore >= 70) {
      level = "CRITICAL";
    } else if (totalScore >= 40) {
      level = "HIGH";
    } else if (totalScore >= 15) {
      level = "MEDIUM";
    }

    return { score: totalScore, level, mismatchedFields, matchedFields };
  }
}

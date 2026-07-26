import { MismatchRecord } from "./risk";

export class RecommendationEngine {
  
  static generateActionPlan(
    riskLevel: string, 
    mismatchedFields: Record<string, MismatchRecord>
  ): { status: string, recommendations: string[], explanation: string } {
    const recommendations: string[] = [];
    let status = "NEEDS_REVIEW";
    let explanation = "Verification completed with issues.";

    const keys = Object.keys(mismatchedFields);

    if (keys.length === 0 && riskLevel === "LOW") {
      status = "VERIFIED";
      recommendations.push("Approve Automatically");
      explanation = "All extracted fields perfectly matched the candidate profile.";
      return { status, recommendations, explanation };
    }

    if (riskLevel === "CRITICAL") {
      status = "REJECTED";
      recommendations.push("Reject Candidate");
      recommendations.push("Request Re-upload");
      
      const mustMatchFailures = keys.filter(k => mismatchedFields[k].mustMatchFailed);
      if (mustMatchFailures.length > 0) {
        explanation = `Verification failed because ${mustMatchFailures.join(" and ")} did not match the candidate profile.`;
      } else {
        explanation = "Verification failed due to an excessively high risk score across multiple fields.";
      }
      return { status, recommendations, explanation };
    }

    if (riskLevel === "HIGH") {
      status = "NEEDS_REVIEW";
      recommendations.push("Needs Human Review");
      recommendations.push("Request Re-upload");
      explanation = `Verification requires manual review. High risk mismatches detected in: ${keys.join(", ")}.`;
      return { status, recommendations, explanation };
    }

    // MEDIUM or partial LOW
    status = "PARTIALLY_VERIFIED";
    recommendations.push("Needs Human Review");
    explanation = `Verification partially succeeded. Minor discrepancies found in: ${keys.join(", ")}.`;
    
    return { status, recommendations, explanation };
  }
}

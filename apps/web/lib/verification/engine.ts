import { prisma } from "@/lib/prisma";
import { MatchingEngine, MatchDetail } from "./matching";
import { RiskEngine } from "./risk";
import { RecommendationEngine } from "./recommendation";
import { VerificationStatus } from "@prisma/client";

export class VerificationEngine {

  /**
   * Orchestrates the entire Verification Pipeline
   */
  static async runVerification(jobId: string) {
    const job = await prisma.aIJob.findUnique({
      where: { id: jobId },
      include: { candidate: true, document: true }
    });

    if (!job || !job.structuredJson) {
      throw new Error("Verification Engine requires a completed AIJob with structuredJson.");
    }

    const ocrData = job.structuredJson as Record<string, unknown>;
    const candidate = job.candidate;
    
    // 1. Matching Phase
    const matchResults: Record<string, MatchDetail> = {};

    // Standard mappings (expandable)
    if (ocrData.firstName) {
      matchResults["firstName"] = MatchingEngine.compareString(candidate.firstName, ocrData.firstName as string);
    }
    if (ocrData.lastName) {
      matchResults["lastName"] = MatchingEngine.compareString(candidate.lastName, ocrData.lastName as string);
    }
    if (ocrData.dob) {
      matchResults["dateOfBirth"] = MatchingEngine.compareDate(candidate.dateOfBirth, ocrData.dob as string);
    }
    if (ocrData.pan) {
      matchResults["panNumber"] = MatchingEngine.compareAlphaNumeric(candidate.panNumber, ocrData.pan as string);
    }
    if (ocrData.aadhaar) {
      matchResults["aadhaarNumber"] = MatchingEngine.compareAlphaNumeric(candidate.aadhaarNumber, ocrData.aadhaar as string);
    }

    // 2. Risk Phase
    const { score, level, matchedFields, mismatchedFields } = await RiskEngine.calculateRisk(
      job.organizationId,
      job.document.documentType,
      matchResults
    );

    // 3. Recommendation Phase
    const { status, recommendations, explanation } = RecommendationEngine.generateActionPlan(
      level,
      mismatchedFields
    );

    // 4. Save to Database
    const result = await prisma.verificationResult.create({
      data: {
        jobId: job.id,
        candidateId: candidate.id,
        documentId: job.documentId,
        organizationId: job.organizationId,
        overallStatus: status as unknown as VerificationStatus,
        riskScore: score,
        riskLevel: level,
        confidence: job.confidenceScore || 0,
        matchedFields: matchedFields,
        mismatchedFields: JSON.parse(JSON.stringify(mismatchedFields)),
        recommendations,
        explanation
      }
    });

    return result;
  }
}

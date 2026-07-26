import { prisma } from "@/lib/prisma";
import { MockOCRProvider } from "./engine/providers/mock";
import { validateExtraction } from "./engine/validator";

export type AIJobType = 
  | "OCR" 
  | "DOCUMENT_CLASSIFICATION" 
  | "RESUME_PARSING" 
  | "AADHAAR_EXTRACTION" 
  | "PAN_EXTRACTION" 
  | "PASSPORT_EXTRACTION" 
  | "FACE_MATCH" 
  | "FRAUD_CHECK" 
  | "CUSTOM";

export type AIJobStatus = 
  | "QUEUED" 
  | "PROCESSING" 
  | "WAITING_FOR_REVIEW" 
  | "COMPLETED" 
  | "FAILED" 
  | "CANCELLED";

export async function createAIJob(
  documentId: string, 
  candidateId: string, 
  organizationId: string, 
  jobType: AIJobType, 
  priority: number = 0,
  userId?: string
) {
  const job = await prisma.aIJob.create({
    data: {
      documentId,
      candidateId,
      organizationId,
      jobType,
      priority,
      status: "QUEUED",
      auditLogs: {
        create: {
          action: "CREATED",
          notes: `Job of type ${jobType} created and queued.`,
          performedById: userId,
        }
      }
    }
  });

  return job;
}

export async function updateAIJobStatus(
  jobId: string, 
  status: AIJobStatus, 
  notes?: string,
  userId?: string,
  extraData?: {
    errorMessage?: string;
    confidenceScore?: number;
    processingTime?: number;
    completedAt?: Date;
    startedAt?: Date;
  }
) {
  const job = await prisma.aIJob.update({
    where: { id: jobId },
    data: {
      status,
      ...extraData,
      auditLogs: {
        create: {
          action: status,
          notes: notes || `Status updated to ${status}`,
          performedById: userId,
        }
      }
    }
  });

  return job;
}

export async function cancelAIJob(jobId: string, userId?: string) {
  return updateAIJobStatus(jobId, "CANCELLED", "Job was manually cancelled.", userId);
}

export async function retryAIJob(jobId: string, userId?: string) {
  const job = await prisma.aIJob.update({
    where: { id: jobId },
    data: {
      status: "QUEUED",
      retryCount: { increment: 1 },
      errorMessage: null,
      auditLogs: {
        create: {
          action: "RETRIED",
          notes: "Job queued for retry.",
          performedById: userId,
        }
      }
    }
  });
  return job;
}

/**
 * SIMULATOR for Sprint 7
 * This simulates the background processing of a job using setTimeout.
 */
export async function simulateAIJobProcessing(jobId: string) {
  // Wait 1 second before starting
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await updateAIJobStatus(jobId, "PROCESSING", "Job picked up by AI Worker", undefined, {
    startedAt: new Date()
  });

  const job = await prisma.aIJob.findUnique({ 
    where: { id: jobId },
    include: { document: true }
  });
  
  if (!job || job.status === "CANCELLED") return;

  const startMs = Date.now();

  try {
    // 10% chance to fail
    if (Math.random() < 0.1) {
      throw new Error("Connection to OCR engine timed out after 5000ms");
    }

    const provider = new MockOCRProvider();
    
    // Simulate processing
    const ocrResult = await provider.processDocument(
      job.documentId, 
      job.document.storagePath, 
      job.document.documentType
    );

    // Run Validation Engine
    const validationResult = validateExtraction(job.document.documentType, ocrResult.structuredData);

    const processingTime = Date.now() - startMs;

    // Routing Logic for Human Review
    const finalStatus: AIJobStatus = (ocrResult.overallConfidence < 80 || validationResult.overallValidationScore < 100) 
      ? "WAITING_FOR_REVIEW" 
      : "COMPLETED";

    // Save Results
    await prisma.$transaction(async (tx) => {
      // Create extractions
      for (const field of validationResult.fields) {
        await tx.aIExtraction.create({
          data: {
            jobId: job.id,
            fieldName: field.fieldName,
            fieldValue: field.fieldValue,
            confidence: field.confidence,
            validationError: field.validationError,
            isAutoVerified: finalStatus === "COMPLETED" && field.isValid,
            verified: finalStatus === "COMPLETED" && field.isValid,
          }
        });
      }

      // Update Job
      await tx.aIJob.update({
        where: { id: job.id },
        data: {
          status: finalStatus,
          provider: ocrResult.provider,
          modelVersion: ocrResult.modelVersion,
          rawText: ocrResult.rawText,
          structuredJson: JSON.parse(JSON.stringify(ocrResult.structuredData)), // Safe serialization
          confidenceScore: ocrResult.overallConfidence,
          validationScore: validationResult.overallValidationScore,
          processingTime,
          completedAt: new Date(),
          auditLogs: {
            create: {
              action: finalStatus,
              notes: finalStatus === "COMPLETED" 
                ? "Simulated processing finished successfully. Auto-verified." 
                : "Simulated processing finished. Requires human review due to low confidence or validation errors.",
            }
          }
        }
      });
    });

  } catch (error) {
    const processingTime = Date.now() - startMs;
    const errorMessage = error instanceof Error ? error.message : "Unknown Error";
    await updateAIJobStatus(jobId, "FAILED", "Simulated failure: OCR Engine timed out.", undefined, {
      errorMessage,
      processingTime,
      completedAt: new Date()
    });
  }
}

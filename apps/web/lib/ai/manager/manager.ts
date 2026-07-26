import { providerRouter } from "./router";
import { OcrResult } from "../engine/provider";
import { prisma } from "@/lib/prisma";

export class AIManager {
  /**
   * Executes an OCR job by dynamically routing to the best provider.
   * Handles automatic failover and metric logging.
   */
  async executeOcr(
    organizationId: string,
    documentId: string,
    documentUrl: string,
    documentType: string
  ): Promise<{ result: OcrResult; providerDbId: string }> {
    const queue = await providerRouter.getRoutingQueue(organizationId, "OCR");

    let lastError: Error | null = null;
    let retries = 0;

    for (const provider of queue) {
      const startTime = Date.now();
      try {
        const result = await provider.instance.processDocument(documentId, documentUrl, documentType);
        const duration = Date.now() - startTime;
        
        // Log Success Metric
        await this.logMetric(provider.dbId, true, duration, result.overallConfidence, retries);
        
        return { result, providerDbId: provider.dbId };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        const duration = Date.now() - startTime;
        
        // Log Failure Metric
        await this.logMetric(provider.dbId, false, duration, 0, 0);
        
        retries++;
        console.warn(`[AIManager] Provider ${provider.code} failed. Failing over to next in queue. Error: ${lastError.message}`);
        
        // Let it loop to the next provider
      }
    }

    throw new Error(`All configured providers failed. Last error: ${lastError?.message}`);
  }

  private async logMetric(providerId: string, success: boolean, durationMs: number, confidence: number, retries: number) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Start of day

    try {
      await prisma.$transaction(async (tx) => {
        // Upsert metric record
        const metric = await tx.aIProviderMetric.upsert({
          where: {
            providerId_date: { providerId, date: today }
          },
          update: {
            totalRequests: { increment: 1 },
            successCount: { increment: success ? 1 : 0 },
            failureCount: { increment: success ? 0 : 1 },
            retries: { increment: retries },
          },
          create: {
            providerId,
            date: today,
            totalRequests: 1,
            successCount: success ? 1 : 0,
            failureCount: success ? 0 : 1,
            avgTimeMs: durationMs,
            avgConfidence: confidence,
            retries,
          }
        });

        // Update rolling averages
        if (success) {
          const newAvgTime = Math.floor((metric.avgTimeMs * (metric.successCount - 1) + durationMs) / metric.successCount);
          const newAvgConf = ((metric.avgConfidence * (metric.successCount - 1)) + confidence) / metric.successCount;
          
          await tx.aIProviderMetric.update({
            where: { id: metric.id },
            data: {
              avgTimeMs: newAvgTime,
              avgConfidence: newAvgConf
            }
          });
        }
        
        // Update health status if failures > threshold
        if (!success) {
          if (metric.failureCount > 10 && metric.failureCount > metric.successCount) {
             await tx.aIProvider.update({
               where: { id: providerId },
               data: { status: "WARNING" }
             });
          }
        }
      });
    } catch (e) {
      console.error("[AIManager] Failed to log metric:", e);
    }
  }
}

export const aiManager = new AIManager();

import { memoryQueue } from "./adapters/in-memory";
import { Job, JobStatus, JobType } from "./types";
import { simulateAIJobProcessing } from "@/lib/ai/queue";

let isProcessing = false;

export async function startWorker() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    let job = await memoryQueue.dequeue();
    
    while (job) {
      try {
        await processJob(job);
        await memoryQueue.updateStatus(job.id, JobStatus.COMPLETED);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const currentJobId = job.id;
        
        if (job.retryCount < job.maxRetries) {
          await memoryQueue.incrementRetry(currentJobId);
          
          // Exponential backoff simulation
          const delayMs = Math.pow(2, job.retryCount) * 1000;
          
          setTimeout(() => {
            memoryQueue.updateStatus(currentJobId, JobStatus.QUEUED).then(() => {
              // Trigger worker asynchronously to pick up the retried job
              startWorker().catch(console.error);
            });
          }, delayMs);
        } else {
          // Dead letter queue (DLQ)
          await memoryQueue.updateStatus(currentJobId, JobStatus.DEAD_LETTER, errorMessage);
        }
      }
      
      // Pull next job
      job = await memoryQueue.dequeue();
    }
  } finally {
    isProcessing = false;
  }
}

async function processJob(job: Job) {
  switch (job.type) {
    case JobType.OCR_PROCESS:
      // The payload must contain jobId corresponding to prisma.aIJob
      if (!job.payload || typeof job.payload.jobId !== "string") {
        throw new Error("Invalid payload for OCR_PROCESS");
      }
      await simulateAIJobProcessing(job.payload.jobId);
      break;
      
    case JobType.VERIFICATION_PROCESS:
      console.log("[Worker] Verification process not yet implemented");
      break;
      
    default:
      throw new Error(`No handler registered for job type: ${job.type}`);
  }
}

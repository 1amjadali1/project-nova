import { memoryQueue } from "./adapters/in-memory";
import { JobType, JobStatus } from "./types";
import { startWorker } from "./worker";

export const Dispatcher = {
  async dispatch<T>(type: JobType, payload: T, priority: number = 0, maxRetries: number = 3): Promise<string> {
    const jobId = await memoryQueue.enqueue(type, payload, priority, maxRetries);
    
    // Trigger worker asynchronously to mimic queue detachment
    setTimeout(() => {
      startWorker().catch((err) => {
        console.error("[Dispatcher] Worker failed to start:", err);
      });
    }, 0);

    return jobId;
  },

  async getMetrics() {
    return memoryQueue.getMetrics();
  },

  async getJobs(status?: JobStatus) {
    return memoryQueue.getJobs(status);
  }
};

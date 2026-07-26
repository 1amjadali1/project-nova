import { Job, JobMetrics, JobStatus, JobType, QueueAdapter } from "../types";
import { randomUUID } from "crypto";

class InMemoryQueueAdapter implements QueueAdapter {
  private jobs: Map<string, Job> = new Map();

  async enqueue<T>(type: JobType, payload: T, priority: number = 0, maxRetries: number = 3): Promise<string> {
    const id = randomUUID();
    const job: Job<T> = {
      id,
      type,
      payload,
      status: JobStatus.QUEUED,
      priority,
      retryCount: 0,
      maxRetries,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.jobs.set(id, job);
    return id;
  }

  async dequeue(): Promise<Job | null> {
    // Find highest priority queued job
    let nextJob: Job | null = null;
    
    for (const job of this.jobs.values()) {
      if (job.status === JobStatus.QUEUED) {
        if (!nextJob || job.priority > nextJob.priority || (job.priority === nextJob.priority && job.createdAt < nextJob.createdAt)) {
          nextJob = job;
        }
      }
    }

    if (nextJob) {
      nextJob.status = JobStatus.PROCESSING;
      nextJob.updatedAt = new Date();
      this.jobs.set(nextJob.id, nextJob);
      return nextJob;
    }

    return null;
  }

  async updateStatus(id: string, status: JobStatus, error?: string): Promise<void> {
    const job = this.jobs.get(id);
    if (job) {
      job.status = status;
      if (error) job.error = error;
      job.updatedAt = new Date();
      this.jobs.set(id, job);
    }
  }

  async incrementRetry(id: string): Promise<void> {
    const job = this.jobs.get(id);
    if (job) {
      job.retryCount += 1;
      job.updatedAt = new Date();
      this.jobs.set(id, job);
    }
  }

  async getJobs(status?: JobStatus): Promise<Job[]> {
    const allJobs = Array.from(this.jobs.values());
    if (status) {
      return allJobs.filter(j => j.status === status).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    return allJobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getMetrics(): Promise<JobMetrics> {
    const metrics: JobMetrics = {
      total: this.jobs.size,
      queued: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      retries: 0,
      deadLetter: 0,
    };

    for (const job of this.jobs.values()) {
      if (job.status === JobStatus.QUEUED) metrics.queued++;
      else if (job.status === JobStatus.PROCESSING) metrics.processing++;
      else if (job.status === JobStatus.COMPLETED) metrics.completed++;
      else if (job.status === JobStatus.FAILED) metrics.failed++;
      else if (job.status === JobStatus.DEAD_LETTER) metrics.deadLetter++;
      
      metrics.retries += job.retryCount;
    }

    return metrics;
  }
}

// Preserve the queue in global scope for Next.js dev mode hot reloading
const globalForQueue = globalThis as unknown as {
  __memoryQueue: InMemoryQueueAdapter | undefined;
};

export const memoryQueue = globalForQueue.__memoryQueue ?? new InMemoryQueueAdapter();

if (process.env.NODE_ENV !== "production") {
  globalForQueue.__memoryQueue = memoryQueue;
}

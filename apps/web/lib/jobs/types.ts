export enum JobType {
  OCR_PROCESS = "OCR_PROCESS",
  VERIFICATION_PROCESS = "VERIFICATION_PROCESS",
  WEBHOOK_DISPATCH = "WEBHOOK_DISPATCH",
  DOCUMENT_ANALYSIS = "DOCUMENT_ANALYSIS",
  FUTURE_RESERVED = "FUTURE_RESERVED",
}

export enum JobStatus {
  QUEUED = "QUEUED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  DEAD_LETTER = "DEAD_LETTER",
}

 
export interface Job<T = any> {
  id: string;
  type: JobType;
  payload: T;
  status: JobStatus;
  priority: number;
  retryCount: number;
  maxRetries: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobMetrics {
  total: number;
  queued: number;
  processing: number;
  completed: number;
  failed: number;
  retries: number;
  deadLetter: number;
}

export interface QueueAdapter {
  enqueue<T>(type: JobType, payload: T, priority?: number, maxRetries?: number): Promise<string>;
  dequeue(): Promise<Job | null>;
  updateStatus(id: string, status: JobStatus, error?: string): Promise<void>;
  incrementRetry(id: string): Promise<void>;
  getJobs(status?: JobStatus): Promise<Job[]>;
  getMetrics(): Promise<JobMetrics>;
}

"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/auth/rbac";
import { createAIJob as baseCreateJob, cancelAIJob as baseCancelJob, retryAIJob as baseRetryJob, AIJobType } from "@/lib/ai/queue";
import { Dispatcher } from "@/lib/jobs/dispatcher";
import { JobType } from "@/lib/jobs/types";
import { revalidatePath } from "next/cache";

export async function createSimulatedAIJob(documentId: string, jobType: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const [document, hasPerm] = await Promise.all([
    prisma.document.findUnique({
      where: { id: documentId },
      select: { organizationId: true, candidateId: true }
    }),
    hasPermission(session.user.id, "documents:write")
  ]);

  if (!document) throw new Error("Document not found");
  if (document.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }
  if (!hasPerm) throw new Error("Forbidden: Missing permission");

  const job = await baseCreateJob(
    documentId, 
    document.candidateId, 
    session.user.organizationId, 
    jobType as AIJobType, 
    1, 
    session.user.id
  );

  // Trigger background job
  await Dispatcher.dispatch(JobType.OCR_PROCESS, { jobId: job.id });

  // Update document status to PROCESSING
  await prisma.document.update({
    where: { id: documentId },
    data: { status: "PROCESSING" }
  });

  revalidatePath(`/documents/${documentId}`);
  revalidatePath("/ai/jobs");
  revalidatePath("/ai");

  return job;
}

export async function cancelAIJobAction(jobId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const [job, hasPerm] = await Promise.all([
    prisma.aIJob.findUnique({
      where: { id: jobId },
      select: { organizationId: true, status: true, documentId: true }
    }),
    hasPermission(session.user.id, "documents:write")
  ]);

  if (!job) throw new Error("Job not found");
  if (job.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }
  if (!hasPerm) throw new Error("Forbidden: Missing permission");

  if (job.status === "COMPLETED" || job.status === "FAILED" || job.status === "CANCELLED") {
    throw new Error("Cannot cancel a job in a terminal state");
  }

  await baseCancelJob(jobId, session.user.id);
  
  revalidatePath(`/ai/jobs/${jobId}`);
  revalidatePath(`/documents/${job.documentId}`);
  revalidatePath("/ai/jobs");
  revalidatePath("/ai");
}

export async function retryAIJobAction(jobId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const [job, hasPerm] = await Promise.all([
    prisma.aIJob.findUnique({
      where: { id: jobId },
      select: { organizationId: true, status: true, documentId: true }
    }),
    hasPermission(session.user.id, "documents:write")
  ]);

  if (!job) throw new Error("Job not found");
  if (job.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }
  if (!hasPerm) throw new Error("Forbidden: Missing permission");

  if (job.status !== "FAILED" && job.status !== "CANCELLED") {
    throw new Error("Can only retry failed or cancelled jobs");
  }

  await baseRetryJob(jobId, session.user.id);
  
  // Trigger background job
  await Dispatcher.dispatch(JobType.OCR_PROCESS, { jobId });

  revalidatePath(`/ai/jobs/${jobId}`);
  revalidatePath(`/documents/${job.documentId}`);
  revalidatePath("/ai/jobs");
  revalidatePath("/ai");
}

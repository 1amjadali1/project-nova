import { withAuth } from "@/lib/api/auth";
import { APIResponse } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";
import { createSimulatedAIJob } from "@/app/actions/ai";

export const GET = withAuth(async (req, { organizationId }) => {
  const jobs = await prisma.aIJob.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" }
  });

  return APIResponse.success({ jobs });
}, { requirePermission: "documents:read" });

export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    
    if (!body.documentId || !body.jobType) {
      return APIResponse.error("BAD_REQUEST", "documentId and jobType are required", 400);
    }

    await createSimulatedAIJob(body.documentId, body.jobType);
    return APIResponse.success({ message: "AI Job queued successfully" }, undefined, 202);
  } catch (error: unknown) {
    const err = error as Error;
    return APIResponse.error("ACTION_FAILED", err.message || "Failed to process document", 400);
  }
}, { requirePermission: "documents:write" });

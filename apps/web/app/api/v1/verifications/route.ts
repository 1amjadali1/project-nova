import { withAuth } from "@/lib/api/auth";
import { APIResponse } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";
import { createVerification } from "@/app/actions/verification";

export const GET = withAuth(async (req, { organizationId }) => {
  const url = new URL(req.url);
  const candidateId = url.searchParams.get("candidateId");

  const verifications = await prisma.verificationRequest.findMany({
    where: {
      candidate: { organizationId },
      ...(candidateId ? { candidateId } : {})
    },
    orderBy: { createdAt: "desc" }
  });

  return APIResponse.success({ verifications });
}, { requirePermission: "verifications:read" });

export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    
    if (!body.candidateId || !body.type) {
      return APIResponse.error("BAD_REQUEST", "candidateId and type are required", 400);
    }

    const formData = new FormData();
    formData.append("candidateId", body.candidateId);
    formData.append("type", body.type);

    await createVerification(formData);
    return APIResponse.success({ message: "Verification request created successfully" }, undefined, 201);
  } catch (error: unknown) {
    const err = error as Error;
    return APIResponse.error("ACTION_FAILED", err.message || "Failed to create verification", 400);
  }
}, { requirePermission: "verifications:write" });

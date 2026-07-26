import { withAuth } from "@/lib/api/auth";
import { APIResponse } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";
import { uploadCandidateDocument } from "@/app/actions/document";

export const GET = withAuth(async (req, { organizationId }) => {
  const url = new URL(req.url);
  const candidateId = url.searchParams.get("candidateId");

  const documents = await prisma.document.findMany({
    where: {
      organizationId,
      ...(candidateId ? { candidateId } : {})
    },
    orderBy: { createdAt: "desc" }
  });

  return APIResponse.success({ documents });
}, { requirePermission: "documents:read" });

export const POST = withAuth(async (req) => {
  try {
    const formData = await req.formData();
    const candidateId = formData.get("candidateId") as string;

    if (!candidateId) {
      return APIResponse.error("BAD_REQUEST", "candidateId is required", 400);
    }

    await uploadCandidateDocument(candidateId, formData);
    return APIResponse.success({ message: "Document uploaded successfully" }, undefined, 201);
  } catch (error: unknown) {
    const err = error as Error;
    return APIResponse.error("ACTION_FAILED", err.message || "Failed to upload document", 400);
  }
}, { requirePermission: "documents:write" });

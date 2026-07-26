import { withAuth } from "@/lib/api/auth";
import { APIResponse } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";
import { createCandidate } from "@/app/actions/candidate";

export const GET = withAuth(async (req, { organizationId }) => {
  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";

  const candidates = await prisma.candidate.findMany({
    where: {
      organizationId,
      ...(search ? {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } }
        ]
      } : {})
    },
    orderBy: { createdAt: "desc" }
  });

  return APIResponse.success({ candidates });
}, { requirePermission: "candidates:read" });

export const POST = withAuth(async (req, { organizationId }) => {
  const body = await req.json();

  if (!body.firstName || !body.lastName || !body.email) {
    return APIResponse.error("BAD_REQUEST", "Missing required fields (firstName, lastName, email)", 400);
  }

  // Construct FormData to reuse existing Server Action
  const formData = new FormData();
  formData.append("firstName", body.firstName);
  formData.append("lastName", body.lastName);
  formData.append("email", body.email);
  if (body.phone) formData.append("phone", body.phone);
  // The server action requires organizationId in the formData, even though it forces the session one
  formData.append("organizationId", organizationId);

  try {
    await createCandidate(formData);
    return APIResponse.success({ message: "Candidate created successfully" }, undefined, 201);
  } catch (error: unknown) {
    const err = error as Error;
    return APIResponse.error("ACTION_FAILED", err.message || "Failed to create candidate", 400);
  }
}, { requirePermission: "candidates:write" });

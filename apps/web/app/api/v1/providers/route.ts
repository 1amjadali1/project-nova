import { withAuth } from "@/lib/api/auth";
import { APIResponse } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

export const GET = withAuth(async (req, { organizationId }) => {
  const providers = await prisma.aIProvider.findMany({
    where: { organizationId },
    orderBy: { priority: "asc" }
  });

  return APIResponse.success({ providers });
}, { requireRole: "SUPER_ADMIN" });

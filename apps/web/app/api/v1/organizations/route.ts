import { withAuth } from "@/lib/api/auth";
import { APIResponse } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

export const GET = withAuth(async (req, { organizationId }) => {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId }
  });

  if (!organization) {
    return APIResponse.error("NOT_FOUND", "Organization not found", 404);
  }

  return APIResponse.success({ organization });
});

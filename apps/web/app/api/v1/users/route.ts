import { withAuth } from "@/lib/api/auth";
import { APIResponse } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

export const GET = withAuth(async (req, { organizationId }) => {
  const users = await prisma.user.findMany({
    where: { organizationId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      roles: true,
      isActive: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });

  return APIResponse.success({ users });
}, { requireRole: "ADMIN" });

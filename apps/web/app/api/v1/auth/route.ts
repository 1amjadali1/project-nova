import { withAuth } from "@/lib/api/auth";
import { APIResponse } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

export const GET = withAuth(async (req, { userId }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      organizationId: true,
      roles: true
    }
  });

  if (!user) {
    return APIResponse.error("USER_NOT_FOUND", "Authenticated user could not be found", 404);
  }

  return APIResponse.success({ user });
});

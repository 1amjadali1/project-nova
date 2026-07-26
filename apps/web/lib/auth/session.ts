import { auth } from "@/lib/auth/auth";
import { headers, cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getEnterpriseSession() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user) {
    return null;
  }

  const reqCookies = await cookies();
  const impersonationCookie = reqCookies.get("nova_impersonation");

  if (impersonationCookie?.value) {
    const impersonatedUserId = impersonationCookie.value;
    
    // Make sure impersonation log is active for this session
    const activeImpersonation = await prisma.impersonationLog.findFirst({
      where: {
        originalUserId: session.user.id,
        impersonatedUserId: impersonatedUserId,
        endedAt: null
      }
    });

    if (activeImpersonation) {
      // Fetch the impersonated user data
      const targetUser = await prisma.user.findUnique({
        where: { id: impersonatedUserId }
      });

      if (targetUser) {
        return {
          session: session.session,
          user: {
            ...targetUser,
            name: `${targetUser.firstName} ${targetUser.lastName}`
          },
          isImpersonating: true,
          originalUser: session.user
        };
      }
    }
  }

  return {
    ...session,
    isImpersonating: false,
    originalUser: null
  };
}

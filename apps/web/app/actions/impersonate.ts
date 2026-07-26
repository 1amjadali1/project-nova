"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logAudit } from "@/lib/audit/log";

async function getUserMaxLevel(userId: string): Promise<number> {
  const assignments = await prisma.employeeRoleAssignment.findMany({
    where: { EmployeeProfile: { userId } },
    include: { Role: true }
  });
  
  if (!assignments || assignments.length === 0) return -1;
  return Math.max(...assignments.map(a => a.Role.hierarchyLevel));
}

export async function startImpersonationAction(targetUserId: string, reason: string) {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user) throw new Error("Unauthorized");
  
  const originalUserId = session.user.id;
  if (originalUserId === targetUserId) throw new Error("Cannot impersonate yourself");

  // Validate hierarchy rules
  const myLevel = await getUserMaxLevel(originalUserId);
  const targetLevel = await getUserMaxLevel(targetUserId);

  if (myLevel <= targetLevel && myLevel !== 50) { // 50 is super admin, they can bypass
    throw new Error("Cannot impersonate a user of equal or higher level.");
  }

  // Write to ImpersonationLog
  const ipAddress = reqHeaders.get("x-forwarded-for") || reqHeaders.get("x-real-ip") || "Unknown IP";
  const userAgent = reqHeaders.get("user-agent") || "Unknown Browser";

  await prisma.impersonationLog.create({
    data: {
      originalUserId,
      impersonatedUserId: targetUserId,
      reason,
      browser: userAgent,
      ipAddress,
      betterAuthSessionId: session.session.token
    }
  });

  await logAudit(originalUserId, "IMPERSONATION_START", `Started impersonating user ${targetUserId} for reason: ${reason}`);

  // Set Cookie
  const cookieStore = await cookies();
  cookieStore.set("nova_impersonation", targetUserId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8 // 8 hours max impersonation
  });

  redirect("/dashboard");
}

export async function stopImpersonationAction() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user) redirect("/sign-in");

  const reqCookies = await cookies();
  const impersonationCookie = reqCookies.get("nova_impersonation");

  if (impersonationCookie?.value) {
    const targetUserId = impersonationCookie.value;

    // End all active logs for this session
    await prisma.impersonationLog.updateMany({
      where: {
        originalUserId: session.user.id,
        impersonatedUserId: targetUserId,
        endedAt: null,
        betterAuthSessionId: session.session.token
      },
      data: { endedAt: new Date() }
    });

    await logAudit(session.user.id, "IMPERSONATION_STOP", `Stopped impersonating user ${targetUserId}`);
    reqCookies.delete("nova_impersonation");
  }

  redirect("/dashboard");
}

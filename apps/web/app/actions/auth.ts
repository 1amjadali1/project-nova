"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { logAudit } from "@/lib/audit/log";
import { cookies } from "next/headers";

export async function updatePasswordAction(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (newPassword !== confirmPassword) {
    throw new Error("New passwords do not match.");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  const userId = session.user.id;

  // Enterprise Password Policy: 12 chars, upper, lower, number, special
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new Error("Password must be at least 12 characters and include uppercase, lowercase, number, and special character.");
  }

  // Verify current password via Account
  const account = await prisma.account.findFirst({
    where: { userId, providerId: "credential" }
  });

  if (!account || !account.password) {
    throw new Error("No credential account found.");
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, account.password);
  if (!isPasswordValid) {
    throw new Error("Invalid current password.");
  }

  // Check Password History
  const history = await prisma.passwordHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5 // check last 5 passwords
  });

  for (const record of history) {
    const isReuse = await bcrypt.compare(newPassword, record.passwordHash);
    if (isReuse) {
      throw new Error("Cannot reuse previous passwords.");
    }
  }

  // Update password
  const newHash = await bcrypt.hash(newPassword, 10);
  
  await prisma.account.update({
    where: { id: account.id },
    data: { password: newHash }
  });

  await prisma.passwordHistory.create({
    data: { userId, passwordHash: newHash }
  });

  // Clear the reset required flag
  await prisma.employeeProfile.update({
    where: { userId },
    data: { passwordResetRequired: false }
  });

  await logAudit(userId, "PASSWORD_CHANGE", "User self-reset password from change-password screen");

  redirect("/dashboard");
}

export async function logoutAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    const userId = session.user.id;
    
    // Mark UserSession as terminated
    if (session.session?.token) {
      await prisma.userSession.updateMany({
        where: { betterAuthSessionId: session.session.token, status: "ACTIVE" },
        data: { status: "TERMINATED", logoutTime: new Date() }
      });
    }

    // Update Profile lastLogout
    await prisma.employeeProfile.update({
      where: { userId },
      data: { lastLogout: new Date() }
    });

    await logAudit(userId, "LOGOUT", "User logged out");

    // Clear BetterAuth
    await auth.api.signOut({
      headers: await headers()
    });
  }

  // Destroy all cookies just to be safe
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  for (const cookie of allCookies) {
    cookieStore.delete(cookie.name);
  }

  redirect("/sign-in");
}

export async function loginWrapperAction(email: string, betterAuthToken: string) {
  const reqHeaders = await headers();
  const ipAddress = reqHeaders.get("x-forwarded-for") || reqHeaders.get("x-real-ip") || "Unknown IP";
  const userAgent = reqHeaders.get("user-agent") || "Unknown Browser";

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const profile = await prisma.employeeProfile.findUnique({ where: { userId: user.id } });
  
  if (profile) {
    // Reset failed attempts
    await prisma.employeeProfile.update({
      where: { id: profile.id },
      data: { failedLoginAttempts: 0, lastLogin: new Date() }
    });
  }

  // Create UserSession
  await prisma.userSession.create({
    data: {
      userId: user.id,
      betterAuthSessionId: betterAuthToken,
      ipAddress: ipAddress,
      browser: userAgent,
      status: "ACTIVE",
      loginTime: new Date(),
      lastActivity: new Date()
    }
  });

  await logAudit(user.id, "LOGIN", `Successful login from ${ipAddress}`);
}

export async function logFailedLoginAction(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const profile = await prisma.employeeProfile.findUnique({ where: { userId: user.id } });
  if (profile) {
    const attempts = profile.failedLoginAttempts + 1;
    let lockedUntil = profile.lockedUntil;
    
    if (attempts >= 5) {
      lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // lock for 15 mins
    }
    
    await prisma.employeeProfile.update({
      where: { id: profile.id },
      data: {
        failedLoginAttempts: attempts,
        lastFailedLogin: new Date(),
        lockedUntil
      }
    });

    await logAudit(user.id, "FAILED_LOGIN", `Failed login attempt ${attempts}`);
    
    if (attempts >= 5) {
      await logAudit(user.id, "ACCOUNT_LOCKED", "Account locked due to 5 failed attempts");
    }
  }
}

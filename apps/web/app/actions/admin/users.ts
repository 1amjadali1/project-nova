"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EmployeeStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { logAudit } from "@/lib/audit/log";

export async function createUserAction(formData: FormData) {
  const email = formData.get("email") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const employeeId = formData.get("employeeId") as string;
  const phone = formData.get("phone") as string;
  
  const departmentId = formData.get("departmentId") as string || null;
  const teamId = formData.get("teamId") as string || null;
  const managerId = formData.get("managerId") as string || null;
  const roleId = formData.get("roleId") as string;
  
  const status = formData.get("status") as EmployeeStatus || "ACTIVE";
  const joiningDate = formData.get("joiningDate") ? new Date(formData.get("joiningDate") as string) : new Date();
  
  const requirePasswordChange = formData.get("requirePasswordChange") === "true";

  // Get Organization
  const org = await prisma.organization.findFirst();
  if (!org) throw new Error("No organization found");

  // Hash default password
  const defaultPasswordHash = await bcrypt.hash("Welcome@2026", 10);

  // 1. Create User
  const user = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      phone,
      organizationId: org.id,
      isActive: status === "ACTIVE",
      emailVerified: true
    }
  });

  // 2. Create Credentials
  await prisma.account.create({
    data: {
      id: `acc-${Date.now()}`,
      userId: user.id,
      accountId: user.email,
      providerId: "credential",
      password: defaultPasswordHash,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  // 3. Create Employee Profile
  const profile = await prisma.employeeProfile.create({
    data: {
      userId: user.id,
      employeeId,
      status,
      joiningDate,
      departmentId,
      teamId,
      managerId,
      passwordResetRequired: requirePasswordChange
    }
  });

  // 4. Assign Role
  if (roleId) {
    await prisma.employeeRoleAssignment.create({
      data: {
        id: `era-${Date.now()}`,
        employeeProfileId: profile.id,
        roleId
      }
    });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) {
    await logAudit(session.user.id, "USER_CREATED", `Created user ${email}`);
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function editUserAction(formData: FormData) {
  const profileId = formData.get("profileId") as string;
  const email = formData.get("email") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const employeeId = formData.get("employeeId") as string;
  const phone = formData.get("phone") as string;
  
  const departmentId = formData.get("departmentId") as string || null;
  const teamId = formData.get("teamId") as string || null;
  const managerId = formData.get("managerId") as string || null;
  const roleId = formData.get("roleId") as string;
  
  const status = formData.get("status") as EmployeeStatus;
  const joiningDate = formData.get("joiningDate") ? new Date(formData.get("joiningDate") as string) : undefined;
  
  const profile = await prisma.employeeProfile.findUnique({ where: { id: profileId }});
  if (!profile) throw new Error("Profile not found");

  await prisma.user.update({
    where: { id: profile.userId },
    data: {
      email,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      phone,
      isActive: status === "ACTIVE"
    }
  });

  await prisma.employeeProfile.update({
    where: { id: profileId },
    data: {
      employeeId,
      status,
      joiningDate,
      departmentId,
      teamId,
      managerId,
    }
  });

  if (roleId) {
    await prisma.employeeRoleAssignment.deleteMany({ where: { employeeProfileId: profileId } });
    await prisma.employeeRoleAssignment.create({
      data: {
        id: `era-${Date.now()}`,
        employeeProfileId: profileId,
        roleId
      }
    });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) {
    await logAudit(session.user.id, "USER_UPDATED", `Updated profile ${profileId}`);
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function activateUser(profileId: string) {
  const profile = await prisma.employeeProfile.update({
    where: { id: profileId },
    data: { status: "ACTIVE" },
    include: { user: true }
  });
  await prisma.user.update({ where: { id: profile.userId }, data: { isActive: true } });
  
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) await logAudit(session.user.id, "STATUS_CHANGED", `Activated user ${profile.userId}`);

  revalidatePath("/admin/users");
}

export async function deactivateUser(profileId: string) {
  const profile = await prisma.employeeProfile.update({
    where: { id: profileId },
    data: { status: "INACTIVE" },
    include: { user: true }
  });
  await prisma.user.update({ where: { id: profile.userId }, data: { isActive: false } });
  
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) await logAudit(session.user.id, "STATUS_CHANGED", `Deactivated user ${profile.userId}`);

  revalidatePath("/admin/users");
}

export async function resetPassword(profileId: string) {
  const profile = await prisma.employeeProfile.findUnique({ where: { id: profileId }, include: { user: true } });
  if (!profile) return;
  const defaultPasswordHash = await bcrypt.hash("Welcome@2026", 10);
  
  await prisma.account.updateMany({
    where: { userId: profile.userId, providerId: "credential" },
    data: { password: defaultPasswordHash }
  });
  
  await prisma.employeeProfile.update({
    where: { id: profileId },
    data: { passwordResetRequired: true }
  });
  
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) await logAudit(session.user.id, "PASSWORD_RESET", `Admin reset password for user ${profile.userId}`);

  revalidatePath("/admin/users");
}

export async function assignTeam(profileId: string, teamId: string | null) {
  await prisma.employeeProfile.update({
    where: { id: profileId },
    data: { teamId }
  });
  revalidatePath("/admin/users");
}

export async function assignManager(profileId: string, managerId: string | null) {
  await prisma.employeeProfile.update({
    where: { id: profileId },
    data: { managerId }
  });
  revalidatePath("/admin/users");
}

export async function assignRole(profileId: string, roleId: string) {
  // Replace all existing roles with this single one for now (or could add to it)
  await prisma.employeeRoleAssignment.deleteMany({ where: { employeeProfileId: profileId } });
  await prisma.employeeRoleAssignment.create({
    data: {
      id: `era-${Date.now()}`,
      employeeProfileId: profileId,
      roleId
    }
  });
  
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) await logAudit(session.user.id, "ROLE_CHANGED", `Changed role for user ${profileId} to ${roleId}`);
  
  revalidatePath("/admin/users");
}

export async function softDeleteUser(profileId: string) {
  const profile = await prisma.employeeProfile.update({
    where: { id: profileId },
    data: { status: "SUSPENDED" },
    include: { user: true }
  });
  await prisma.user.update({ where: { id: profile.userId }, data: { isActive: false } });
  revalidatePath("/admin/users");
}

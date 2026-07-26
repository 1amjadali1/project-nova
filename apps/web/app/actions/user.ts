"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { hasPermission } from "@/lib/auth/rbac";

export async function createUser(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const organizationId = formData.get("organizationId") as string;
  const roleId = formData.get("roleId") as string;
  const password = formData.get("password") as string;

  if (!firstName || !lastName || !email || !organizationId || !roleId || !password) {
    throw new Error("Missing required fields");
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  
  const [hasPerm] = await Promise.all([
    hasPermission(session.user.id, "users:write")
  ]);

  if (!hasPerm) throw new Error("Forbidden: Missing users:write permission");

  // Force organizationId to match the logged-in user to prevent cross-tenant user creation
  const safeOrgId = session.user.organizationId;

  // Use Better Auth's sign up API internally to hash password and create User/Account
  const res = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      organizationId: safeOrgId,
    },
  });

  if (!res || !res.user) {
    throw new Error("Failed to create user with Better Auth");
  }

  // Add role explicitly
  await prisma.userRole.create({
    data: {
      userId: res.user.id,
      roleId,
    },
  });

  revalidatePath("/users");
}

export async function updateUser(id: string, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const roleId = formData.get("roleId") as string;

  if (!firstName || !lastName || !email || !roleId) {
    throw new Error("Missing required fields");
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  
  const [targetUser, hasPerm] = await Promise.all([
    prisma.user.findUnique({ where: { id }, select: { organizationId: true } }),
    hasPermission(session.user.id, "users:write")
  ]);

  if (!targetUser) throw new Error("User not found");
  if (targetUser.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }
  if (!hasPerm) throw new Error("Forbidden: Missing users:write permission");

  // Update user basic info
  await prisma.user.update({
    where: { id },
    data: {
      firstName,
      lastName,
      email,
    },
  });

  // Update role (assuming one primary role for now from the UI, delete existing and create new)
  await prisma.userRole.deleteMany({
    where: { userId: id },
  });

  await prisma.userRole.create({
    data: {
      userId: id,
      roleId,
    },
  });

  revalidatePath("/users");
  revalidatePath(`/users/${id}`);
}

export async function deleteUser(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  
  const [targetUser, hasPerm] = await Promise.all([
    prisma.user.findUnique({ where: { id }, select: { organizationId: true } }),
    hasPermission(session.user.id, "users:write")
  ]);

  if (!targetUser) throw new Error("User not found");
  if (targetUser.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }
  if (!hasPerm) throw new Error("Forbidden: Missing users:write permission");

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/users");
}

export async function deactivateUser(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  
  const [targetUser, hasPerm] = await Promise.all([
    prisma.user.findUnique({ where: { id }, select: { organizationId: true } }),
    hasPermission(session.user.id, "users:write")
  ]);

  if (!targetUser) throw new Error("User not found");
  if (targetUser.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }
  if (!hasPerm) throw new Error("Forbidden: Missing users:write permission");

  await prisma.user.update({
    where: { id },
    data: { isActive: false },
  });

  revalidatePath("/users");
  revalidatePath(`/users/${id}`);
}

export async function activateUser(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  
  const [targetUser, hasPerm] = await Promise.all([
    prisma.user.findUnique({ where: { id }, select: { organizationId: true } }),
    hasPermission(session.user.id, "users:write")
  ]);

  if (!targetUser) throw new Error("User not found");
  if (targetUser.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }
  if (!hasPerm) throw new Error("Forbidden: Missing users:write permission");

  await prisma.user.update({
    where: { id },
    data: { isActive: true },
  });

  revalidatePath("/users");
  revalidatePath(`/users/${id}`);
}

export async function inviteUser(email: string, organizationId: string, roleId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  
  const [hasPerm] = await Promise.all([
    hasPermission(session.user.id, "users:write")
  ]);

  if (!hasPerm) throw new Error("Forbidden: Missing users:write permission");
  
  if (organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }

  // Placeholder for future email invitation logic
  console.log(`Inviting user ${email} to org ${organizationId} with role ${roleId}`);
  return { success: true };
}

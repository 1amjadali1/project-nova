"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { hasPermission } from "@/lib/auth/rbac";

export async function createCandidate(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const organizationId = formData.get("organizationId") as string;

  if (!firstName || !lastName || !email || !organizationId) {
    throw new Error("Missing required fields");
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const [hasPerm] = await Promise.all([
    hasPermission(session.user.id, "candidates:write")
  ]);

  if (!hasPerm) throw new Error("Forbidden: Missing candidates:write permission");

  // Force organizationId to match the logged-in user
  const forcedOrgId = session.user.organizationId;

  const newCandidate = await prisma.candidate.create({
    data: {
      firstName,
      lastName,
      email,
      phone: phone || null,
      organizationId: forcedOrgId,
    },
  });

  revalidatePath("/candidates");
  // Important: next/navigation redirect must be used
  const { redirect } = await import("next/navigation");
  redirect(`/candidates/${newCandidate.id}`);
}

export async function updateCandidate(id: string, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const organizationId = formData.get("organizationId") as string;

  if (!firstName || !lastName || !email || !organizationId) {
    throw new Error("Missing required fields");
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const [candidate, hasPerm] = await Promise.all([
    prisma.candidate.findUnique({
      where: { id },
      select: { organizationId: true }
    }),
    hasPermission(session.user.id, "candidates:write")
  ]);

  if (!candidate) throw new Error("Candidate not found");
  if (candidate.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }
  if (!hasPerm) throw new Error("Forbidden: Missing candidates:write permission");

  await prisma.candidate.update({
    where: { id },
    data: {
      firstName,
      lastName,
      email,
      phone: phone || null,
    },
  });

  revalidatePath("/candidates");
}

export async function deleteCandidate(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const [candidate, hasPerm] = await Promise.all([
    prisma.candidate.findUnique({
      where: { id },
      select: { organizationId: true }
    }),
    hasPermission(session.user.id, "candidates:write")
  ]);

  if (!candidate) throw new Error("Candidate not found");
  if (candidate.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }
  if (!hasPerm) throw new Error("Forbidden: Missing candidates:write permission");

  await prisma.candidate.delete({
    where: { id },
  });

  revalidatePath("/candidates");
}

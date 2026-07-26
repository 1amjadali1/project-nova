"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

export async function toggleProviderStatus(providerId: string, enabled: boolean) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const isAdmin = await hasRole(session.user.id, "SUPER_ADMIN");
  if (!isAdmin) throw new Error("Forbidden: Super Admin only");

  const provider = await prisma.aIProvider.findUnique({ where: { id: providerId } });
  if (!provider) throw new Error("Not found");
  if (provider.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }

  await prisma.aIProvider.update({
    where: { id: providerId },
    data: { enabled }
  });

  revalidatePath("/ai/providers");
  revalidatePath(`/ai/providers/${providerId}`);
}

export async function updateProviderPriority(providerId: string, priority: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const isAdmin = await hasRole(session.user.id, "SUPER_ADMIN");
  if (!isAdmin) throw new Error("Forbidden: Super Admin only");

  const provider = await prisma.aIProvider.findUnique({ where: { id: providerId } });
  if (!provider) throw new Error("Not found");
  if (provider.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }

  await prisma.aIProvider.update({
    where: { id: providerId },
    data: { priority }
  });

  revalidatePath("/ai/providers");
  revalidatePath(`/ai/providers/${providerId}`);
}

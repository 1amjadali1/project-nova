"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hasRole } from "@/lib/auth/rbac";
import { revalidatePath } from "next/cache";

export async function createRule(data: { documentType: string; fieldName: string; mismatchScore: number; mustMatch: boolean }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const isAdmin = await hasRole(session.user.id, "SUPER_ADMIN");
  if (!isAdmin) throw new Error("Forbidden: Super Admin only");

  await prisma.verificationRule.upsert({
    where: {
      organizationId_documentType_fieldName: {
        organizationId: session.user.organizationId,
        documentType: data.documentType,
        fieldName: data.fieldName,
      }
    },
    update: {
      mismatchScore: data.mismatchScore,
      mustMatch: data.mustMatch,
    },
    create: {
      organizationId: session.user.organizationId,
      documentType: data.documentType,
      fieldName: data.fieldName,
      mismatchScore: data.mismatchScore,
      mustMatch: data.mustMatch,
    }
  });

  revalidatePath("/verification-engine");
}

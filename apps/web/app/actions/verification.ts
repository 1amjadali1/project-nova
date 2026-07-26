"use server";

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { hasPermission } from "@/lib/auth/rbac";
import { RequestStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createVerification(formData: FormData) {
  const type = formData.get("type") as string;
  const candidateId = formData.get("candidateId") as string;
  const notes = formData.get("notes") as string;

  if (!type || !candidateId) {
    throw new Error("Missing required fields");
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const [candidate, hasPerm] = await Promise.all([
    prisma.candidate.findUnique({
      where: { id: candidateId },
      select: { organizationId: true }
    }),
    hasPermission(session.user.id, "verifications:write")
  ]);

  if (!candidate) throw new Error("Candidate not found");
  if (candidate.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }
  if (!hasPerm) throw new Error("Forbidden: Missing verifications:write permission");

  await prisma.verificationRequest.create({
    data: {
      type,
      candidateId,
      status: "PENDING",
      notes: notes || null,
    },
  });

  revalidatePath("/verifications");
  revalidatePath(`/candidates/${candidateId}`);
}

export async function updateVerification(id: string, formData: FormData) {
  const status = formData.get("status") as string;
  const notes = formData.get("notes") as string;

  if (!status) {
    throw new Error("Missing required fields");
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const [verificationReq, hasPerm] = await Promise.all([
    prisma.verificationRequest.findUnique({
      where: { id },
      include: { candidate: { select: { organizationId: true } } }
    }),
    hasPermission(session.user.id, "verifications:write")
  ]);

  if (!verificationReq) throw new Error("Verification Request not found");
  if (verificationReq.candidate.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }
  if (!hasPerm) throw new Error("Forbidden: Missing verifications:write permission");

  const verification = await prisma.verificationRequest.update({
    where: { id },
    data: {
      status: status as RequestStatus,
      notes: notes || null,
    },
  });

  revalidatePath("/verifications");
  revalidatePath(`/candidates/${verification.candidateId}`);
}

export async function deleteVerification(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const [verificationReq, hasPerm] = await Promise.all([
    prisma.verificationRequest.findUnique({
      where: { id },
      include: { candidate: { select: { organizationId: true } } }
    }),
    hasPermission(session.user.id, "verifications:write")
  ]);

  if (!verificationReq) throw new Error("Verification Request not found");
  if (verificationReq.candidate.organizationId !== session.user.organizationId) {
    throw new Error("Unauthorized: Cross-tenant access denied");
  }
  if (!hasPerm) throw new Error("Forbidden: Missing verifications:write permission");

  const verification = await prisma.verificationRequest.delete({
    where: { id },
  });

  revalidatePath("/verifications");
  revalidatePath(`/candidates/${verification.candidateId}`);
}

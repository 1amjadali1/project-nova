"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createVerification(formData: FormData) {
  const type = formData.get("type") as string;
  const candidateId = formData.get("candidateId") as string;
  const notes = formData.get("notes") as string;

  if (!type || !candidateId) {
    throw new Error("Missing required fields");
  }

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

  const verification = await prisma.verificationRequest.update({
    where: { id },
    data: {
      status,
      notes: notes || null,
    },
  });

  revalidatePath("/verifications");
  revalidatePath(`/candidates/${verification.candidateId}`);
}

export async function deleteVerification(id: string) {
  const verification = await prisma.verificationRequest.delete({
    where: { id },
  });

  revalidatePath("/verifications");
  revalidatePath(`/candidates/${verification.candidateId}`);
}

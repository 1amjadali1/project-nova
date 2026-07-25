"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCandidate(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const organizationId = formData.get("organizationId") as string;

  if (!firstName || !lastName || !email || !organizationId) {
    throw new Error("Missing required fields");
  }

  await prisma.candidate.create({
    data: {
      firstName,
      lastName,
      email,
      phone: phone || null,
      organizationId,
    },
  });

  revalidatePath("/candidates");
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

  await prisma.candidate.update({
    where: { id },
    data: {
      firstName,
      lastName,
      email,
      phone: phone || null,
      organizationId,
    },
  });

  revalidatePath("/candidates");
}

export async function deleteCandidate(id: string) {
  await prisma.candidate.delete({
    where: { id },
  });

  revalidatePath("/candidates");
}

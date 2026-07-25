"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrganization(formData: FormData) {
  const name = formData.get("name")?.toString().trim() ?? "";
  const slug = formData.get("slug")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() || null;
  const phone = formData.get("phone")?.toString().trim() || null;
  const website = formData.get("website")?.toString().trim() || null;

  if (!name || !slug) {
    throw new Error("Organization name and slug are required.");
  }

  await prisma.organization.create({
    data: {
      name,
      slug,
      email,
      phone,
      website,
    },
  });

  revalidatePath("/organizations");
}

export async function deleteOrganization(id: string) {
  if (!id) {
    throw new Error("Organization ID is required.");
  }

  await prisma.organization.delete({
    where: { id },
  });

  revalidatePath("/organizations");
}

export async function updateOrganization(id: string, formData: FormData) {
  const name = formData.get("name")?.toString().trim() ?? "";
  const slug = formData.get("slug")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() || null;
  const phone = formData.get("phone")?.toString().trim() || null;
  const website = formData.get("website")?.toString().trim() || null;

  if (!name || !slug) {
    throw new Error("Organization name and slug are required.");
  }

  await prisma.organization.update({
    where: { id },
    data: {
      name,
      slug,
      email,
      phone,
      website,
    },
  });

  revalidatePath("/organizations");
}

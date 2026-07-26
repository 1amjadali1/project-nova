"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Missing email or password");
  }

  // Use Better Auth server API for login
  await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    headers: await headers(),
  });

  return { success: true };
}

export async function logout() {
  await auth.api.signOut({
    headers: await headers(),
  });

  return { success: true };
}





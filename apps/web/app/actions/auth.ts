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

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) throw new Error("Email is required");

  await auth.api.forgetPassword({
    body: {
      email,
      redirectTo: "/reset-password",
    },
    headers: await headers(),
  });
  
  return { success: true };
}

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const newPassword = formData.get("newPassword") as string;
  
  if (!token || !newPassword) throw new Error("Missing token or password");

  await auth.api.resetPassword({
    body: {
      token,
      newPassword,
    },
    headers: await headers(),
  });

  return { success: true };
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) throw new Error("Email is required");

  // Foundation for forgot password (e.g., generate reset token, send email)
  console.log(`Password reset requested for: ${email}`);
  
  return { success: true };
}

export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const newPassword = formData.get("newPassword") as string;
  
  if (!token || !newPassword) throw new Error("Missing token or password");

  // Foundation for reset password logic
  console.log(`Password reset executed for token: ${token}`);

  return { success: true };
}

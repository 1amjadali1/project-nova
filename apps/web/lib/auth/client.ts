import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  resetPassword,
  updateUser,
  changePassword,
  sendVerificationEmail,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} = authClient as any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const forgetPassword = (authClient as any).forgetPassword;

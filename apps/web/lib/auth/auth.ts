import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Don't block login strictly for now
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async sendResetPassword({ user, url, token }: { user: unknown, url: unknown, token: unknown }) {
      console.log("=========================================");
      console.log(`[MOCK EMAIL] Password Reset for ${user}`);
      console.log(`[MOCK EMAIL] Reset Link: ${url}`);
      console.log("=========================================");
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async sendVerificationEmail({ user, url, token }: { user: unknown, url: unknown, token: unknown }) {
      console.log("=========================================");
      console.log(`[MOCK EMAIL] Email Verification for ${user}`);
      console.log(`[MOCK EMAIL] Verification Link: ${url}`);
      console.log("=========================================");
    },
  },
  user: {
    additionalFields: {
      firstName: { type: "string" },
      lastName: { type: "string" },
      phone: { type: "string", required: false },
      isActive: { type: "boolean", defaultValue: true },
      organizationId: { type: "string" },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});

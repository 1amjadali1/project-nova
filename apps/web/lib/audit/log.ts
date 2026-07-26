import { prisma } from "@/lib/prisma";

export async function logAudit(userId: string, action: string, details?: string | object) {
  try {
    const stringDetails = typeof details === 'object' ? JSON.stringify(details) : details;
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details: stringDetails
      }
    });
  } catch (error) {
    console.error("[AuditLog Error] Failed to write audit log:", error);
  }
}

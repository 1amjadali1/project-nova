import { APIResponse } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check DB
    await prisma.$queryRaw`SELECT 1`;
    const dbStatus = "up";
    
    // Auth status is considered "up" if it can process requests
    const authStatus = "up";

    // AI Provider status (we'd theoretically check them)
    const aiProviders = await prisma.aIProvider.findMany({
      where: { enabled: true }
    });

    const aiStatus = aiProviders.every(p => p.status === "HEALTHY") ? "up" : "degraded";

    return APIResponse.success({
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      status: "ok",
      components: {
        database: dbStatus,
        authentication: authStatus,
        ai: aiStatus
      }
    });

  } catch {
    return APIResponse.error("SERVICE_UNAVAILABLE", "One or more core components are down", 503);
  }
}

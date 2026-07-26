import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { hasPermission, hasRole } from "@/lib/auth/rbac";
import { APIResponse } from "./response";

export interface APIContext {
  userId: string;
  organizationId: string;
}

export type APIHandler = (
  req: Request,
  context: APIContext,
  params?: unknown
) => Promise<Response>;

interface AuthOptions {
  requireRole?: string;
  requirePermission?: string;
}

/**
 * Higher-order function to wrap API endpoints with authentication, tenant, and RBAC validation.
 */
export function withAuth(handler: APIHandler, options?: AuthOptions) {
  return async (req: Request, { params }: { params?: unknown } = {}) => {
    try {
      // 1. Authenticate Request
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session?.user) {
        return APIResponse.error("UNAUTHORIZED", "Valid session or token required.", 401);
      }

      const { id: userId, organizationId } = session.user;

      if (!organizationId) {
        return APIResponse.error("FORBIDDEN", "User does not belong to any organization.", 403);
      }

      // 2. Validate RBAC (if required)
      if (options?.requireRole) {
        const isValidRole = await hasRole(userId, options.requireRole);
        if (!isValidRole) {
          return APIResponse.error("FORBIDDEN", `Requires role: ${options.requireRole}`, 403);
        }
      }

      if (options?.requirePermission) {
        const isValidPermission = await hasPermission(userId, options.requirePermission);
        if (!isValidPermission) {
          return APIResponse.error("FORBIDDEN", `Requires permission: ${options.requirePermission}`, 403);
        }
      }

      // 3. Prepare context
      const context: APIContext = {
        userId,
        organizationId,
      };

      // 4. Pass execution to handler
      return await handler(req, context, params);
      
    } catch (error: unknown) {
      console.error("[API Error]", error);
      const err = error as Error;
      // Never expose internal stack traces
      return APIResponse.error(
        "INTERNAL_SERVER_ERROR", 
        err?.message || "An unexpected error occurred processing your request.", 
        500
      );
    }
  };
}

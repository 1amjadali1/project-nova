import { prisma } from "@/lib/prisma";

export async function hasPermission(userId: string, action: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      },
    },
  });

  if (!user || !user.isActive) {
    return false;
  }

  // SUPER_ADMIN automatically has unrestricted access to all permissions
  const isSuperAdmin = user.roles.some((ur) => ur.role.name === "SUPER_ADMIN");
  if (isSuperAdmin) {
    return true;
  }

  // Flatten permissions across all roles
  const permissions = user.roles.flatMap((ur) => ur.role.permissions);

  // Check if they have the global permission
  return permissions.some((p) => {
    // Basic exact match (e.g. "users:read")
    if (p.name === action) return true;
    
    // Feature flags or wildcards can be checked here in the future
    if (p.name === "*") return true;

    return false;
  });
}

export async function hasRole(userId: string, roleName: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          role: true
        }
      }
    }
  });

  if (!user || !user.isActive) return false;

  return user.roles.some(ur => ur.role.name === roleName);
}

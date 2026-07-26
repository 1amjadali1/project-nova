import { prisma } from "@/lib/prisma";

/**
 * Enterprise RBAC Engine
 * Evaluates if a user has a specific permission via their assigned roles and any inherited roles.
 */

// Helper to get all descendant role IDs recursively
async function getDescendantRoleIds(roleId: string, currentSet: Set<string> = new Set()): Promise<Set<string>> {
  if (currentSet.has(roleId)) return currentSet;
  currentSet.add(roleId);

  const role = await prisma.role.findUnique({
    where: { id: roleId },
    include: { children: true }
  });

  if (role && role.children.length > 0) {
    for (const child of role.children) {
      await getDescendantRoleIds(child.id, currentSet);
    }
  }

  return currentSet;
}

export async function hasPermission(userId: string, permissionName: string): Promise<boolean> {
  // Get direct roles
  const assignments = await prisma.employeeRoleAssignment.findMany({
    where: { EmployeeProfile: { userId } },
    include: { Role: true }
  });

  if (!assignments || assignments.length === 0) return false;

  // Platform Super Admin bypass
  if (assignments.some(a => a.Role.name === "Platform Super Admin")) return true;

  // Collect all valid role IDs (direct + descendants)
  const allRoleIds = new Set<string>();
  for (const a of assignments) {
    await getDescendantRoleIds(a.roleId, allRoleIds);
  }

  // Check if any of these roles have the specific permission
  const specificCheck = await prisma.rolePermission.findFirst({
    where: {
      roleId: { in: Array.from(allRoleIds) },
      permission: { name: permissionName }
    }
  });

  return !!specificCheck;
}

export async function hasAnyPermission(userId: string, requiredPermissions: string[]): Promise<boolean> {
  const assignments = await prisma.employeeRoleAssignment.findMany({
    where: { EmployeeProfile: { userId } },
    include: { Role: true }
  });

  if (!assignments || assignments.length === 0) return false;
  if (assignments.some(a => a.Role.name === "Platform Super Admin")) return true;

  const allRoleIds = new Set<string>();
  for (const a of assignments) {
    await getDescendantRoleIds(a.roleId, allRoleIds);
  }

  const specificCheck = await prisma.rolePermission.findFirst({
    where: {
      roleId: { in: Array.from(allRoleIds) },
      permission: { name: { in: requiredPermissions } }
    }
  });

  return !!specificCheck;
}

export async function hasRole(userId: string, roleName: string): Promise<boolean> {
  const assignments = await prisma.employeeRoleAssignment.findMany({
    where: { EmployeeProfile: { userId } },
    include: { Role: true }
  });

  // Strict check on direct role (for explicit role checking, usually prefer hasPermission)
  return assignments.some(a => a.Role.name === roleName);
}

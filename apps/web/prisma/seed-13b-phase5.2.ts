import { PrismaClient, EmployeeStatus } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Sprint 13B Phase 5.2 Enterprise Role & Permission Seed...");

  // 1. Get Default Organization
  let org = await prisma.organization.findFirst();
  if (!org) {
    throw new Error("Organization not found. Run previous seeds first.");
  }

  // 2. Wipe existing Roles and Permissions to start fresh
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.employeeRoleAssignment.deleteMany();
  await prisma.role.deleteMany(); // Note: cascade might wipe others if not careful, but we are just rebuilding roles.

  // 3. Define Standard Permissions
  const permissionCategories = {
    Dashboard: ["VIEW"],
    Candidates: ["VIEW", "CREATE", "EDIT", "DELETE"],
    Users: ["VIEW", "CREATE", "EDIT", "DELETE"],
    Roles: ["VIEW", "CREATE", "EDIT", "DELETE"],
    Permissions: ["VIEW", "ASSIGN"],
    Reports: ["VIEW", "DOWNLOAD"]
  };

  const createdPermissions: Record<string, string> = {};
  for (const [category, actions] of Object.entries(permissionCategories)) {
    for (const action of actions) {
      const name = `${category.toUpperCase()}_${action.toUpperCase()}`;
      const p = await prisma.permission.create({
        data: {
          name,
          category,
          action,
          description: `Can ${action} ${category}`
        }
      });
      createdPermissions[name] = p.id;
    }
  }

  // 4. Setup Roles with Hierarchy
  const rolesData = [
    { name: "Platform Super Admin", level: 50, isSystem: true, parent: null },
    { name: "IT Administrator", level: 40, isSystem: true, parent: "Platform Super Admin" },
    { name: "Operations Manager", level: 30, isSystem: true, parent: "IT Administrator" },
    { name: "Team Leader", level: 20, isSystem: true, parent: "Operations Manager" },
    { name: "Quality Executive", level: 10, isSystem: true, parent: "Team Leader" },
    { name: "Verification Agent", level: 10, isSystem: true, parent: "Team Leader" }
  ];

  const createdRoles: Record<string, string> = {};
  for (const r of rolesData) {
    const parentId = r.parent ? createdRoles[r.parent] : null;
    const rl = await prisma.role.create({
      data: { 
        name: r.name, 
        organizationId: org.id,
        hierarchyLevel: r.level,
        isSystem: r.isSystem,
        parentId: parentId
      }
    });
    createdRoles[r.name] = rl.id;
  }

  // 5. Assign Permissions to Roles (Directly mapping what each role natively owns)
  async function assignPerms(roleName: string, perms: string[]) {
    const roleId = createdRoles[roleName];
    for (const p of perms) {
      if (createdPermissions[p]) {
        await prisma.rolePermission.create({
          data: {
            roleId,
            permissionId: createdPermissions[p]
          }
        });
      }
    }
  }

  // Verification Agent
  await assignPerms("Verification Agent", ["DASHBOARD_VIEW", "CANDIDATES_VIEW", "CANDIDATES_CREATE", "CANDIDATES_EDIT"]);
  // Quality Executive
  await assignPerms("Quality Executive", ["DASHBOARD_VIEW", "CANDIDATES_VIEW", "REPORTS_VIEW"]);
  // Team Leader
  await assignPerms("Team Leader", ["DASHBOARD_VIEW", "REPORTS_VIEW", "REPORTS_DOWNLOAD"]);
  // Operations Manager
  await assignPerms("Operations Manager", ["DASHBOARD_VIEW", "USERS_VIEW"]);
  // IT Administrator
  await assignPerms("IT Administrator", ["DASHBOARD_VIEW", "USERS_CREATE", "USERS_EDIT", "USERS_DELETE", "ROLES_VIEW", "ROLES_CREATE", "PERMISSIONS_VIEW"]);
  // Platform Super Admin
  await assignPerms("Platform Super Admin", Object.keys(createdPermissions));

  // 6. Reassign the 9 users to their roles
  const usersToReassign = [
    { empId: "NOVA0001", role: "Platform Super Admin" },
    { empId: "NOVA0002", role: "IT Administrator" },
    { empId: "NOVA0003", role: "Operations Manager" },
    { empId: "NOVA0004", role: "Team Leader" },
    { empId: "NOVA0005", role: "Quality Executive" },
    { empId: "NOVA0006", role: "Verification Agent" },
    { empId: "NOVA0007", role: "Verification Agent" },
    { empId: "NOVA0008", role: "Verification Agent" },
    { empId: "NOVA0009", role: "Verification Agent" },
  ];

  for (const u of usersToReassign) {
    const profile = await prisma.employeeProfile.findUnique({ where: { employeeId: u.empId } });
    if (profile) {
      await prisma.employeeRoleAssignment.create({
        data: {
          id: `era-${u.empId}-${Date.now()}`,
          employeeProfileId: profile.id,
          roleId: createdRoles[u.role]
        }
      });
    }
  }

  console.log(`Successfully seeded Phase 5.2 Roles, Hierarchy, and Permissions!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

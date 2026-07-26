import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PERMISSIONS = [
  { name: "system:all", description: "Full system access" },
  { name: "users:manage", description: "Can manage users" },
  { name: "roles:manage", description: "Can manage roles" },
  { name: "work:assign", description: "Can assign work" },
  { name: "work:execute", description: "Can execute work" },
  { name: "work:review", description: "Can review work" },
  { name: "reports:view", description: "Can view reports" },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  "Platform Super Admin": ["system:all"],
  "IT Admin": ["users:manage", "roles:manage"],
  "Operations Manager": ["work:assign", "reports:view"],
  "Team Leader": ["work:assign", "reports:view"],
  "QA": ["work:review"],
  "Agent": ["work:execute"]
};

async function main() {
  console.log("Starting Sprint 13B Phase 3 RBAC Seed...");

  const org = await prisma.organization.findFirst();
  if (!org) throw new Error("Run Phase 2 seed first to establish the organization.");

  // 1. Seed Permissions
  const permissionMap = new Map<string, string>();
  for (const p of PERMISSIONS) {
    const perm = await prisma.permission.upsert({
      where: { name: p.name },
      create: { name: p.name, description: p.description },
      update: {}
    });
    permissionMap.set(p.name, perm.id);
  }

  // 2. Map Permissions to Roles
  for (const [roleName, perms] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.findFirst({ where: { name: roleName, organizationId: org.id } });
    if (role) {
      for (const p of perms) {
        const permId = permissionMap.get(p);
        if (permId) {
          await prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: role.id, permissionId: permId } },
            create: { roleId: role.id, permissionId: permId },
            update: {}
          });
        }
      }
      console.log(`Mapped permissions for ${roleName}`);
    }
  }

  // 3. Establish Hierarchy (Reporting Managers)
  console.log("Establishing Hierarchy...");

  const getProfileByEmail = async (email: string) => {
    return await prisma.employeeProfile.findFirst({
      where: { user: { email } }
    });
  };

  const opsManager = await getProfileByEmail("rahul.verma@nova.com");
  const teamLeaderA = await getProfileByEmail("aman.singh@nova.com");
  const qa1 = await getProfileByEmail("kavita.mishra@nova.com");
  const agent1 = await getProfileByEmail("rahul.sharma@nova.com");
  const agent2 = await getProfileByEmail("ankit.kumar@nova.com");

  if (opsManager && teamLeaderA) {
    await prisma.employeeProfile.update({ where: { id: teamLeaderA.id }, data: { managerId: opsManager.id } });
    console.log("Mapped Team Leader Aman to Ops Manager Rahul");
  }

  if (teamLeaderA && qa1 && agent1 && agent2) {
    await prisma.employeeProfile.update({ where: { id: qa1.id }, data: { managerId: teamLeaderA.id } });
    await prisma.employeeProfile.update({ where: { id: agent1.id }, data: { managerId: teamLeaderA.id } });
    await prisma.employeeProfile.update({ where: { id: agent2.id }, data: { managerId: teamLeaderA.id } });
    console.log("Mapped QA & Agents to Team Leader Aman");
  }

  console.log("Sprint 13B Phase 3 RBAC Seed Complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

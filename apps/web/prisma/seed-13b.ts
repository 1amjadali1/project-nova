import { PrismaClient, EmployeeStatus } from '@prisma/client';
// Better Auth usually configures user passwords via its server adapter, but if we have direct access, 
// we typically hash passwords using a standard algorithm. Since Better Auth (by default) uses bcrypt for credentials,
// we will just use native crypto or bcrypt to hash the default password. 
// For seed purposes in this mock, we can rely on a basic hash or the Better Auth interface if available.
import bcrypt from "bcryptjs"; // Assuming bcryptjs is installed, if not we will use a dummy hash or install it.

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Sprint 13B Workforce Seed...");

  // 1. Get or Create Default Organization
  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: "Project Nova Enterprise",
        slug: "project-nova",
        email: "admin@projectnova.com",
      }
    });
  }

  // 2. Setup Hierarchy (Department, Designation, Team, Role)
  const dept = await prisma.department.create({
    data: {
      name: "Verification Operations",
      organizationId: org.id
    }
  });

  const team = await prisma.team.create({
    data: {
      id: `team-${Date.now()}`,
      name: "Squad A - Employment Verification",
      departmentId: dept.id,
      organizationId: org.id
    }
  });

  const role = await prisma.role.upsert({
    where: { name_organizationId: { name: "Verification Agent", organizationId: org.id } },
    create: {
      name: "Verification Agent",
      organizationId: org.id,
    },
    update: {}
  });

  const designation = await prisma.designation.create({
    data: {
      name: "Agent Level 1",
      level: 5,
      organizationId: org.id
    }
  });

  // 3. Hash the default password "Welcome@2026"
  const defaultPasswordHash = await bcrypt.hash("Welcome@2026", 10);

  // 4. Create Employee User
  const user = await prisma.user.create({
    data: {
      firstName: "Jane",
      lastName: "Doe",
      name: "Jane Doe",
      email: "jane.agent@projectnova.com",
      organizationId: org.id,
      isActive: true,
      emailVerified: true,
    }
  });

  // Instead of direct password table access (since Better Auth might manage it in an `Account` or `Password` table,
  // we will insert it into `Account` using credentials provider structure).
  // In Better Auth `credential` provider, it is stored in `Account` with providerId="credential" and password property.
  await prisma.account.create({
    data: {
      id: "seed-acc-" + Date.now().toString(),
      userId: user.id,
      accountId: user.email,
      providerId: "credential",
      password: defaultPasswordHash, 
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });

  // 5. Create Employee Profile linked to the User
  const profile = await prisma.employeeProfile.create({
    data: {
      userId: user.id,
      employeeId: "NOVA0001",
      status: EmployeeStatus.ACTIVE,
      joiningDate: new Date(),
      departmentId: dept.id,
      teamId: team.id,
      designationId: designation.id,
      passwordResetRequired: true, // Will force them to reset "Welcome@2026" on first login
      twoFactorEnabled: false
    }
  });

  // 6. Assign Role
  await prisma.employeeRoleAssignment.create({
    data: {
      id: `era-${Date.now()}`,
      employeeProfileId: profile.id,
      roleId: role.id
    }
  });

  console.log(`Seeded employee NOVA0001 successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

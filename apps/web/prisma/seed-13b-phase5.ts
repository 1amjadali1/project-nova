import { PrismaClient, EmployeeStatus } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Sprint 13B Phase 5.1 Workforce Seed...");

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

  // 2. Setup Departments
  const deptNames = ["IT", "Operations", "Verification", "Quality", "Administration"];
  const departments: Record<string, string> = {};
  for (const name of deptNames) {
    const d = await prisma.department.upsert({
      where: { id: `dept-${name.toLowerCase()}` },
      create: { id: `dept-${name.toLowerCase()}`, name, organizationId: org.id },
      update: {}
    });
    departments[name] = d.id;
  }

  // 3. Setup Roles
  const rolesData = [
    { name: "Platform Super Admin", dept: "IT" },
    { name: "IT Administrator", dept: "IT" },
    { name: "Operations Manager", dept: "Operations" },
    { name: "Team Leader", dept: "Operations" },
    { name: "Quality Executive", dept: "Quality" },
    { name: "Verification Agent", dept: "Verification" }
  ];
  const roles: Record<string, string> = {};
  for (const r of rolesData) {
    const rl = await prisma.role.upsert({
      where: { name_organizationId: { name: r.name, organizationId: org.id } },
      create: { name: r.name, organizationId: org.id },
      update: {}
    });
    roles[r.name] = rl.id;
  }

  // 4. Prepare the 9 users
  const defaultPasswordHash = await bcrypt.hash("Welcome@2026", 10);
  
  const usersToCreate = [
    { empId: "NOVA0001", email: "superadmin@nova.com", first: "System", last: "Admin", role: "Platform Super Admin", dept: "IT" },
    { empId: "NOVA0002", email: "itadmin@nova.com", first: "IT", last: "Administrator", role: "IT Administrator", dept: "IT" },
    { empId: "NOVA0003", email: "manager@nova.com", first: "Operations", last: "Manager", role: "Operations Manager", dept: "Operations" },
    { empId: "NOVA0004", email: "teamleader@nova.com", first: "Team", last: "Leader", role: "Team Leader", dept: "Operations" },
    { empId: "NOVA0005", email: "quality@nova.com", first: "Quality", last: "Executive", role: "Quality Executive", dept: "Quality" },
    { empId: "NOVA0006", email: "agent1@nova.com", first: "Agent", last: "One", role: "Verification Agent", dept: "Verification" },
    { empId: "NOVA0007", email: "agent2@nova.com", first: "Agent", last: "Two", role: "Verification Agent", dept: "Verification" },
    { empId: "NOVA0008", email: "agent3@nova.com", first: "Agent", last: "Three", role: "Verification Agent", dept: "Verification" },
    { empId: "NOVA0009", email: "agent4@nova.com", first: "Agent", last: "Four", role: "Verification Agent", dept: "Verification" },
  ];

  const profileIds: Record<string, string> = {};

  for (const u of usersToCreate) {
    // Check if exists
    let existingUser = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existingUser) {
      existingUser = await prisma.user.create({
        data: {
          firstName: u.first,
          lastName: u.last,
          name: `${u.first} ${u.last}`,
          email: u.email,
          organizationId: org.id,
          isActive: true,
          emailVerified: true,
        }
      });

      // Add credential
      await prisma.account.create({
        data: {
          id: `seed-acc-${u.empId}`,
          userId: existingUser.id,
          accountId: existingUser.email,
          providerId: "credential",
          password: defaultPasswordHash,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      // Save password history
      await prisma.passwordHistory.create({
        data: {
          userId: existingUser.id,
          passwordHash: defaultPasswordHash
        }
      });
    }

    // Profile
    let existingProfile = await prisma.employeeProfile.findUnique({ where: { employeeId: u.empId } });
    if (!existingProfile) {
      existingProfile = await prisma.employeeProfile.create({
        data: {
          userId: existingUser.id,
          employeeId: u.empId,
          status: EmployeeStatus.ACTIVE,
          joiningDate: new Date(),
          departmentId: departments[u.dept],
          passwordResetRequired: true,
          twoFactorEnabled: false
        }
      });

      await prisma.employeeRoleAssignment.create({
        data: {
          id: `era-${u.empId}-${Date.now()}`,
          employeeProfileId: existingProfile.id,
          roleId: roles[u.role]
        }
      });
    }
    
    profileIds[u.empId] = existingProfile.id;
  }

  // 5. Setup Hierarchy
  // Super Admin (NOVA0001) -> IT Admin (NOVA0002)
  await prisma.employeeProfile.update({ where: { id: profileIds["NOVA0002"] }, data: { managerId: profileIds["NOVA0001"] } });
  
  // IT Admin (NOVA0002) -> Operations Manager (NOVA0003)
  await prisma.employeeProfile.update({ where: { id: profileIds["NOVA0003"] }, data: { managerId: profileIds["NOVA0002"] } });
  
  // Ops Manager (NOVA0003) -> Team Leader (NOVA0004)
  await prisma.employeeProfile.update({ where: { id: profileIds["NOVA0004"] }, data: { managerId: profileIds["NOVA0003"] } });
  
  // Team Leader (NOVA0004) -> Quality (NOVA0005) & Agents (NOVA0006 - NOVA0009)
  await prisma.employeeProfile.update({ where: { id: profileIds["NOVA0005"] }, data: { managerId: profileIds["NOVA0004"] } });
  await prisma.employeeProfile.update({ where: { id: profileIds["NOVA0006"] }, data: { managerId: profileIds["NOVA0004"] } });
  await prisma.employeeProfile.update({ where: { id: profileIds["NOVA0007"] }, data: { managerId: profileIds["NOVA0004"] } });
  await prisma.employeeProfile.update({ where: { id: profileIds["NOVA0008"] }, data: { managerId: profileIds["NOVA0004"] } });
  await prisma.employeeProfile.update({ where: { id: profileIds["NOVA0009"] }, data: { managerId: profileIds["NOVA0004"] } });

  console.log(`Successfully seeded 9 Enterprise Workforce users with hierarchy!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

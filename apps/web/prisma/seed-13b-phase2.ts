import { PrismaClient, EmployeeStatus } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const usersToSeed = [
  { email: "amjad@nova.com", name: "Amjad Ali", role: "Platform Super Admin", dept: "IT" },
  { email: "arjun.mehta@nova.com", name: "Arjun Mehta", role: "IT Admin", dept: "IT" },
  { email: "neha.kapoor@nova.com", name: "Neha Kapoor", role: "IT Support", dept: "IT" },
  { email: "rahul.verma@nova.com", name: "Rahul Verma", role: "Operations Manager", dept: "Operations" },
  { email: "priya.sharma@nova.com", name: "Priya Sharma", role: "Operations Manager", dept: "Operations" },
  { email: "aman.singh@nova.com", name: "Aman Singh", role: "Team Leader", dept: "Operations" },
  { email: "sneha.gupta@nova.com", name: "Sneha Gupta", role: "Team Leader", dept: "Operations" },
  { email: "rohit.jain@nova.com", name: "Rohit Jain", role: "Team Leader", dept: "Operations" },
  { email: "kavita.mishra@nova.com", name: "Kavita Mishra", role: "QA", dept: "Quality Assurance" },
  { email: "pooja.arora@nova.com", name: "Pooja Arora", role: "QA", dept: "Quality Assurance" },
  { email: "rahul.sharma@nova.com", name: "Rahul Sharma", role: "Agent", dept: "Operations" },
  { email: "ankit.kumar@nova.com", name: "Ankit Kumar", role: "Agent", dept: "Operations" },
  { email: "mohit.yadav@nova.com", name: "Mohit Yadav", role: "Agent", dept: "Operations" },
  { email: "nisha.singh@nova.com", name: "Nisha Singh", role: "Agent", dept: "Operations" },
  { email: "deepak.verma@nova.com", name: "Deepak Verma", role: "Agent", dept: "Operations" },
  { email: "riya.gupta@nova.com", name: "Riya Gupta", role: "Agent", dept: "Operations" },
];

async function main() {
  console.log("Starting Sprint 13B Phase 2 User Seed...");

  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({
      data: { name: "Project Nova Enterprise", slug: "project-nova-ent", email: "admin@nova.com" }
    });
  }

  const defaultPasswordHash = await bcrypt.hash("Welcome@2026", 10);
  let idCounter = 1000;

  for (const u of usersToSeed) {
    const [firstName, ...lastNameParts] = u.name.split(" ");
    const lastName = lastNameParts.join(" ") || " ";

    // Ensure Role exists
    const role = await prisma.role.upsert({
      where: { name_organizationId: { name: u.role, organizationId: org.id } },
      create: { name: u.role, organizationId: org.id },
      update: {}
    });

    // Ensure Dept exists
    const dept = await prisma.department.findFirst({ where: { name: u.dept, organizationId: org.id } }) 
      || await prisma.department.create({ data: { name: u.dept, organizationId: org.id } });

    // Check if user exists to avoid duplicates
    let user = await prisma.user.findUnique({ where: { email: u.email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: u.email,
          firstName,
          lastName,
          name: u.name,
          organizationId: org.id,
          isActive: true,
          emailVerified: true
        }
      });

      await prisma.account.create({
        data: {
          id: `seed-acc-${Date.now()}-${idCounter}`,
          userId: user.id,
          accountId: user.email,
          providerId: "credential",
          password: defaultPasswordHash,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      const profile = await prisma.employeeProfile.create({
        data: {
          userId: user.id,
          employeeId: `NOVA${idCounter}`,
          status: EmployeeStatus.ACTIVE,
          joiningDate: new Date(),
          departmentId: dept.id,
          passwordResetRequired: true
        }
      });

      await prisma.employeeRoleAssignment.create({
        data: {
          id: `era-${Date.now()}-${idCounter}`,
          employeeProfileId: profile.id,
          roleId: role.id
        }
      });

      console.log(`Created User: ${u.email} [${u.role}]`);
      idCounter++;
    } else {
      console.log(`User already exists: ${u.email}`);
    }
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

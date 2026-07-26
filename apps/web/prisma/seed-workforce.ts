import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Running workforce migration seed...');

  // 1. Migrate implicit Role-Permission to explicit RolePermission table
  const roles = await prisma.role.findMany({
    include: {
      permissions: true,
      rolePermissions: true,
    }
  });

  let permissionsMigrated = 0;
  for (const role of roles) {
    for (const permission of role.permissions) {
      // Check if explicit mapping already exists
      const exists = role.rolePermissions.some(rp => rp.permissionId === permission.id);
      if (!exists) {
        await prisma.rolePermission.create({
          data: {
            roleId: role.id,
            permissionId: permission.id,
          }
        });
        permissionsMigrated++;
      }
    }
  }
  console.log(`Migrated ${permissionsMigrated} implicit permissions to explicit RolePermission table.`);

  // 2. Auto-generate EmployeeProfile for existing users
  const users = await prisma.user.findMany({
    include: {
      employeeProfile: true,
    }
  });

  let profilesCreated = 0;
  for (const user of users) {
    if (!user.employeeProfile) {
      await prisma.employeeProfile.create({
        data: {
          userId: user.id,
        }
      });
      profilesCreated++;
    }
  }
  console.log(`Generated ${profilesCreated} missing EmployeeProfiles for existing users.`);

  console.log('Workforce migration completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth/auth";

async function main() {
  console.log("Seeding Database...");

  // 1. Create Organization
  console.log("Creating Organization: Project Nova...");
  let org = await prisma.organization.findFirst({
    where: { name: "Project Nova" }
  });

  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: "Project Nova",
        slug: "project-nova"
      }
    });
  }

  // 2. Create User via Better Auth
  console.log("Creating Super Admin User...");

  const existingUser = await prisma.user.findUnique({
    where: { email: "admin@projectnova.local" }
  });

  if (!existingUser) {
    try {
      // Better Auth expects headers for context context extraction
      const headers = new Headers();
      headers.set("origin", "http://localhost:3000");

      const res = await auth.api.signUpEmail({
        body: {
          email: "admin@projectnova.local",
          password: "Nova@12345",
          name: "Super Admin", // Base BetterAuth name field
          firstName: "Super",
          lastName: "Admin",
          organizationId: org.id
        },
        headers
      });

      if (res?.user) {
        // 3. Create or find Role
        let role = await prisma.role.findUnique({
          where: { name_organizationId: { name: "SUPER_ADMIN", organizationId: org.id } }
        });

        if (!role) {
          role = await prisma.role.create({
            data: {
              name: "SUPER_ADMIN",
              organizationId: org.id
            }
          });
        }

        // 4. Assign Role
        await prisma.userRole.create({
          data: {
            user: { connect: { id: res.user.id } },
            role: { connect: { id: role.id } }
          }
        });
        console.log("Super Admin User seeded successfully.");
      }
    } catch (err) {
      console.error("Failed to seed user via Better Auth:");
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(err);
      }
    }
  } else {
    console.log("Super Admin already exists.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

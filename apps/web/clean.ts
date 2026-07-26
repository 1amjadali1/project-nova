import { prisma } from "./lib/prisma";

async function run() {
  try {
    await prisma.user.delete({ where: { email: "admin@projectnova.local" } });
    console.log("Deleted.");
  } catch {
    console.log("Not found or err.");
  }
}
run().finally(() => process.exit(0));

import { prisma } from "@/lib/prisma";
import NewUserForm from "@/components/users/NewUserForm";

export default async function NewUserPage() {
  const [organizations, roles] = await Promise.all([
    prisma.organization.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.role.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Add User</h1>
        <p className="mt-2 text-slate-400">
          Provision a new user account with role-based access
        </p>
      </div>

      <NewUserForm organizations={organizations} roles={roles} />
    </div>
  );
}

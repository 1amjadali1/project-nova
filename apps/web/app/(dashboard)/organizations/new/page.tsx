import NewOrganizationForm from "@/components/organizations/NewOrganizationForm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function NewOrganizationPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const isSuperAdmin = await prisma.userRole.findFirst({
    where: { userId: session.user.id, role: { name: "SUPER_ADMIN" } }
  });

  if (!isSuperAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">New Organization</h1>
        <p className="mt-2 text-slate-400">
          Create a new tenant organization in the platform.
        </p>
      </div>

      <NewOrganizationForm />
    </div>
  );
}

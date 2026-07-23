import { prisma } from "@/lib/prisma";
import NewOrganizationForm from "@/components/organizations/NewOrganizationForm";
import OrganizationTable from "@/components/organizations/OrganizationTable";

export default async function OrganizationsPage() {
  const organizations = await prisma.organization.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Organizations</h1>

        <p className="mt-2 text-slate-400">
          Manage all client organizations
        </p>
      </div>

      <NewOrganizationForm />

      <OrganizationTable organizations={organizations} />
    </div>
  );
}

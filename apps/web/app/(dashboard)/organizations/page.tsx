import { prisma } from "@/lib/prisma";
import NewOrganizationForm from "@/components/organizations/NewOrganizationForm";
import OrganizationTable from "@/components/organizations/OrganizationTable";
import SearchInput from "@/components/organizations/SearchInput";

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params?.search === "string" ? params.search : undefined;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { slug: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const organizations = await prisma.organization.findMany({
    where,
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

      <div>
        <SearchInput />
        <OrganizationTable organizations={organizations} />
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import NewOrganizationForm from "@/components/organizations/NewOrganizationForm";
import OrganizationTable from "@/components/organizations/OrganizationTable";
import SearchInput from "@/components/organizations/SearchInput";
import Pagination from "@/components/organizations/Pagination";
import SortDropdown from "@/components/organizations/SortDropdown";
import { Prisma } from "@prisma/client";

const ITEMS_PER_PAGE = 10;

export default async function OrganizationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params?.search === "string" ? params.search : undefined;
  
  // Pagination
  const pageParam = typeof params?.page === "string" ? parseInt(params.page, 10) : 1;
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  
  // Sorting
  const sortParam = typeof params?.sort === "string" ? params.sort : "createdAt_desc";
  let orderBy: Prisma.OrganizationOrderByWithRelationInput = { createdAt: "desc" };
  
  switch (sortParam) {
    case "createdAt_asc":
      orderBy = { createdAt: "asc" };
      break;
    case "name_asc":
      orderBy = { name: "asc" };
      break;
    case "name_desc":
      orderBy = { name: "desc" };
      break;
    case "createdAt_desc":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  const where: Prisma.OrganizationWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { slug: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [organizations, totalItems] = await Promise.all([
    prisma.organization.findMany({
      where,
      orderBy,
      take: ITEMS_PER_PAGE,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
    }),
    prisma.organization.count({ where }),
  ]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Organizations</h1>
        <p className="mt-2 text-slate-400">
          Manage all client organizations
        </p>
      </div>

      <NewOrganizationForm />

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <SearchInput />
          <SortDropdown />
        </div>
        
        <OrganizationTable organizations={organizations} />
        
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}

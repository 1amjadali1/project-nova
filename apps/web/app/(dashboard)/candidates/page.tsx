import { prisma } from "@/lib/prisma";
import NewCandidateForm from "@/components/candidates/NewCandidateForm";
import CandidateTable from "@/components/candidates/CandidateTable";
import SearchInput from "@/components/candidates/SearchInput";
import Pagination from "@/components/candidates/Pagination";
import SortDropdown from "@/components/candidates/SortDropdown";
import { Prisma } from "@prisma/client";

const ITEMS_PER_PAGE = 10;

export default async function CandidatesPage({
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
  let orderBy: Prisma.CandidateOrderByWithRelationInput = { createdAt: "desc" };
  
  switch (sortParam) {
    case "createdAt_asc":
      orderBy = { createdAt: "asc" };
      break;
    case "name_asc":
      orderBy = { firstName: "asc" };
      break;
    case "name_desc":
      orderBy = { firstName: "desc" };
      break;
    case "createdAt_desc":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  const where: Prisma.CandidateWhereInput = search
    ? {
        OR: [
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [candidates, totalItems, organizations] = await Promise.all([
    prisma.candidate.findMany({
      where,
      orderBy,
      take: ITEMS_PER_PAGE,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      include: {
        organization: {
          select: { id: true, name: true },
        },
        verifications: {
          include: {
            client: true,
            package: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 1, // Get the most recent active request for listing
        }
      },
    }),
    prisma.candidate.count({ where }),
    prisma.organization.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Candidates</h1>
        <p className="mt-2 text-slate-400">
          Manage background check candidates
        </p>
      </div>

      <NewCandidateForm organizations={organizations} />

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <SearchInput />
          <SortDropdown />
        </div>
        
        <CandidateTable candidates={candidates} organizations={organizations} />
        
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import NewVerificationForm from "@/components/verifications/NewVerificationForm";
import VerificationTable from "@/components/verifications/VerificationTable";
import SearchInput from "@/components/verifications/SearchInput";
import Pagination from "@/components/verifications/Pagination";
import SortDropdown from "@/components/verifications/SortDropdown";
import { Prisma } from "@prisma/client";

const ITEMS_PER_PAGE = 10;

export default async function VerificationsPage({
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
  let orderBy: Prisma.VerificationRequestOrderByWithRelationInput = { createdAt: "desc" };
  
  switch (sortParam) {
    case "createdAt_asc":
      orderBy = { createdAt: "asc" };
      break;
    case "name_asc":
      orderBy = { candidate: { firstName: "asc" } };
      break;
    case "name_desc":
      orderBy = { candidate: { firstName: "desc" } };
      break;
    case "createdAt_desc":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  const where: Prisma.VerificationRequestWhereInput = search
    ? {
        OR: [
          { type: { contains: search, mode: "insensitive" as const } },
          { candidate: { firstName: { contains: search, mode: "insensitive" as const } } },
          { candidate: { lastName: { contains: search, mode: "insensitive" as const } } },
        ],
      }
    : {};

  const [verifications, totalItems, candidates] = await Promise.all([
    prisma.verificationRequest.findMany({
      where,
      orderBy,
      take: ITEMS_PER_PAGE,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      include: {
        candidate: {
          select: { 
            id: true, 
            firstName: true, 
            lastName: true,
            organization: {
              select: { name: true }
            }
          },
        },
      },
    }),
    prisma.verificationRequest.count({ where }),
    prisma.candidate.findMany({
      select: { id: true, firstName: true, lastName: true },
      orderBy: { firstName: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Verifications</h1>
        <p className="mt-2 text-slate-400">
          Manage and track background verification requests
        </p>
      </div>

      <NewVerificationForm candidates={candidates} />

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <SearchInput />
          <SortDropdown />
        </div>
        
        <VerificationTable verifications={verifications} />
        
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}

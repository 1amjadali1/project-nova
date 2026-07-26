import { prisma } from "@/lib/prisma";
import UserTable from "@/components/users/UserTable";
import SearchInput from "@/components/users/SearchInput";
import Pagination from "@/components/users/Pagination";
import SortDropdown from "@/components/users/SortDropdown";
import { Prisma } from "@prisma/client";
import Link from "next/link";

const ITEMS_PER_PAGE = 20;

export default async function UsersPage({
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
  let orderBy: Prisma.UserOrderByWithRelationInput = { createdAt: "desc" };
  
  switch (sortParam) {
    case "name_asc":
      orderBy = { firstName: "asc" };
      break;
    case "name_desc":
      orderBy = { firstName: "desc" };
      break;
    case "createdAt_asc":
      orderBy = { createdAt: "asc" };
      break;
    case "createdAt_desc":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  const where: Prisma.UserWhereInput = search
    ? {
        OR: [
          { firstName: { contains: search, mode: "insensitive" as const } },
          { lastName: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { organization: { name: { contains: search, mode: "insensitive" as const } } },
        ],
      }
    : {};

  const [users, totalItems, roles] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      take: ITEMS_PER_PAGE,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      include: {
        organization: { select: { name: true } },
        roles: { include: { role: { select: { id: true, name: true } } } },
      },
    }),
    prisma.user.count({ where }),
    prisma.role.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Users & Roles</h1>
          <p className="mt-2 text-slate-400">
            Manage system users, access controls, and role assignments
          </p>
        </div>
        <Link
          href="/users/new"
          className="rounded-xl bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-cyan-400 transition"
        >
          Add New User
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <SearchInput />
          <SortDropdown />
        </div>
        
        <UserTable users={users} roles={roles} />
        
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams.q || "";
  const page = parseInt(searchParams.page || "1", 10);
  const pageSize = 20;

  const whereClause = query
    ? {
        OR: [
          { user: { firstName: { contains: query, mode: 'insensitive' as any } } },
          { user: { lastName: { contains: query, mode: 'insensitive' as any } } },
          { user: { email: { contains: query, mode: 'insensitive' as any } } },
          { employeeId: { contains: query, mode: 'insensitive' as any } },
        ],
      }
    : {};

  const [total, profiles] = await Promise.all([
    prisma.employeeProfile.count({ where: whereClause }),
    prisma.employeeProfile.findMany({
      where: whereClause,
      include: {
        user: true,
        department: true,
        Team: true,
        manager: { include: { user: true } },
        EmployeeRoleAssignment: { include: { Role: true } },
      },
      orderBy: { user: { firstName: "asc" } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Enterprise User Management</h2>
          <p className="text-sm text-slate-400 mt-1">Manage workforce accounts, roles, and organizational hierarchy.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700">
            Export CSV
          </button>
          <Link
            href="/admin/users/new"
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-500 shadow-lg shadow-cyan-900/20"
          >
            Create User
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex gap-4 items-center">
        <form className="flex-1 max-w-md">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by name, email, or Employee ID..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </form>
        <button className="text-slate-400 text-sm hover:text-white transition flex items-center gap-2">
          Filters
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-800/50 text-slate-300 text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Employee ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Official Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Team</th>
                <th className="px-6 py-4 font-medium">Manager</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Last Login</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {profiles.map((profile) => (
                <tr key={profile.id} className="transition hover:bg-slate-800/40">
                  <td className="px-6 py-4 font-mono text-cyan-400">
                    {profile.employeeId || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{profile.user.firstName} {profile.user.lastName}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {profile.user.email}
                  </td>
                  <td className="px-6 py-4">
                    {profile.EmployeeRoleAssignment.map((ra: any) => ra.Role.name).join(", ") || <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {profile.department?.name || <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {profile.Team?.name || <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {profile.manager ? `${profile.manager.user.firstName} ${profile.manager.user.lastName}` : <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                      profile.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' :
                      profile.status === 'SUSPENDED' ? 'bg-red-500/10 text-red-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {profile.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {profile.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/users/${profile.id}/edit`}
                        className="text-cyan-400 hover:text-cyan-300 font-medium transition"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-16 text-center text-slate-400">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination Stub */}
      <div className="flex justify-between items-center text-sm text-slate-400">
        <div>Showing {profiles.length} of {total} results</div>
        <div className="flex gap-2">
          <button disabled className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50">Previous</button>
          <button disabled className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}

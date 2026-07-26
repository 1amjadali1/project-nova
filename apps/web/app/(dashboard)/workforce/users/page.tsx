import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StatusBadge from "@/components/candidates/StatusBadge"; // Reuse for now

export default async function WorkforceUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      employeeProfile: {
        include: {
          department: true,
          designation: true,
          manager: {
            include: { user: true }
          }
        }
      },
      organization: true,
      roles: {
        include: { role: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Employee Directory</h2>
        <Link 
          href="/workforce/users/new"
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-500"
        >
          Add Employee
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="px-6 py-4 font-medium">Employee</th>
                <th className="px-6 py-4 font-medium">ID & Role</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Manager</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="transition hover:bg-slate-800/40">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{user.firstName} {user.lastName}</div>
                    <div className="text-xs text-slate-500 mt-1">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-300">
                      {user.employeeProfile?.employeeId || "N/A"}
                    </div>
                    <div className="text-xs text-cyan-400 mt-1">
                      {user.roles.map(r => r.role.name).join(", ") || "No Role"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-300">{user.employeeProfile?.department?.name || "-"}</div>
                    <div className="text-xs text-slate-500 mt-1">{user.employeeProfile?.designation?.name || "-"}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {user.employeeProfile?.manager ? (
                      <>{user.employeeProfile.manager.user.firstName} {user.employeeProfile.manager.user.lastName}</>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge active={user.isActive} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/workforce/users/${user.id}`}
                      className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-cyan-400 transition hover:bg-slate-700"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

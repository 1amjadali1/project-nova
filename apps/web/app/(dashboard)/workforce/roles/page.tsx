import { prisma } from "@/lib/prisma";
import { Users, Shield, ShieldCheck } from "lucide-react";

export default async function RolesPage() {
  const roles = await prisma.role.findMany({
    include: {
      rolePermissions: {
        include: {
          permission: true,
        },
      },
      organization: true,
      _count: {
        select: { users: true }
      }
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Role Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage system roles and permissions.</p>
        </div>
        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
          Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-lg">
                <Shield className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{role.name}</h3>
                <p className="text-xs text-slate-500">{role.organization.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-4 text-sm text-slate-600 dark:text-slate-400">
              <Users className="w-4 h-4" />
              <span>{role._count.users} Users</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Permissions</h4>
              <div className="flex flex-wrap gap-2">
                {role.rolePermissions.map((rp) => (
                  <span key={rp.id} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-3 h-3" />
                    {rp.permission.name}
                  </span>
                ))}
                {role.rolePermissions.length === 0 && (
                  <span className="text-sm text-slate-400 italic">No permissions assigned</span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {roles.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
            <p className="text-slate-500">No roles found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

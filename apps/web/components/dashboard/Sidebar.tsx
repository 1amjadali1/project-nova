import Link from "next/link";
import { getEnterpriseSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/rbac";

export default async function Sidebar() {
  const sessionData = await getEnterpriseSession();

  if (!sessionData?.user) return null;
  const userId = sessionData.user.id;

  // New RBAC Checks based on Phase 5.2
  const canViewDashboard = await hasPermission(userId, "DASHBOARD_VIEW");
  const canViewCandidates = await hasPermission(userId, "CANDIDATES_VIEW");
  const canViewUsers = await hasPermission(userId, "USERS_VIEW");
  const canViewRoles = await hasPermission(userId, "ROLES_VIEW");
  const canViewReports = await hasPermission(userId, "REPORTS_VIEW");
  const canViewPermissions = await hasPermission(userId, "PERMISSIONS_VIEW");

  const isSuperAdmin = await hasPermission(userId, "SYSTEM_ALL") || sessionData.user.email === "superadmin@nova.com"; // fallback for seed just in case

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col h-full z-[50]">
      <div className="border-b border-slate-800 p-6 shrink-0">
        <h1 className="text-2xl font-bold">
          Project <span className="text-cyan-400">Nova</span>
        </h1>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto space-y-6">
        
        {canViewDashboard && (
          <div>
            <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Workspace
            </div>
            <Link href="/dashboard" className="mb-1 block rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">Dashboard</Link>
            
            {(canViewCandidates || isSuperAdmin) && (
              <Link href="/candidates" className="mb-1 block rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">Candidates</Link>
            )}

            {(canViewReports || isSuperAdmin) && (
              <Link href="/reports" className="mb-1 block rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">Reports</Link>
            )}
          </div>
        )}

        {(canViewUsers || canViewRoles || isSuperAdmin) && (
          <div>
            <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Administration
            </div>
            
            {(canViewUsers || isSuperAdmin) && (
              <Link href="/workforce/users" className="mb-1 block rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">Users</Link>
            )}
            
            {(canViewRoles || isSuperAdmin) && (
              <Link href="/workforce/roles" className="mb-1 block rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">Roles</Link>
            )}

            {(canViewPermissions || isSuperAdmin) && (
              <Link href="/workforce/permissions" className="mb-1 block rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">Permissions</Link>
            )}
          </div>
        )}
      </nav>
      
      {/* Debug Panel for Sprint 13B Phase 5.2 */}
      <div className="border-t border-slate-800 p-4 bg-slate-900/50 text-xs text-slate-500">
        <div className="font-mono text-cyan-500 font-bold mb-1">RBAC Debug</div>
        <div className="break-all">User: {sessionData.user.email}</div>
        <div>Dash: {canViewDashboard ? "Yes" : "No"} | Cands: {canViewCandidates ? "Yes" : "No"}</div>
        <div>Users: {canViewUsers ? "Yes" : "No"} | Roles: {canViewRoles ? "Yes" : "No"}</div>
      </div>
    </aside>
  );
}

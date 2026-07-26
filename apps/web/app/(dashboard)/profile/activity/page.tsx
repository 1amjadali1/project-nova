import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, ShieldCheck, LogIn, LogOut, Key, UserCheck } from "lucide-react";

function getActivityIcon(action: string) {
  switch (action) {
    case "LOGIN": return <LogIn className="h-5 w-5 text-emerald-400" />;
    case "LOGOUT": return <LogOut className="h-5 w-5 text-slate-400" />;
    case "FAILED_LOGIN": return <ShieldAlert className="h-5 w-5 text-red-400" />;
    case "ACCOUNT_LOCKED": return <ShieldAlert className="h-5 w-5 text-red-500" />;
    case "PASSWORD_CHANGE": return <Key className="h-5 w-5 text-cyan-400" />;
    case "PASSWORD_RESET": return <Key className="h-5 w-5 text-cyan-500" />;
    case "SESSION_DESTROY": return <ShieldCheck className="h-5 w-5 text-orange-400" />;
    default: return <UserCheck className="h-5 w-5 text-blue-400" />;
  }
}

export default async function ActivityPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const logs = await prisma.auditLog.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50 // Show last 50 events
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Activity Log</h2>
          <p className="text-sm text-slate-400 mt-1">Review your recent authentication and security events.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800">
          {logs.map((log) => (
            <div key={log.id} className="p-4 sm:px-6 flex items-start gap-4 hover:bg-slate-800/50 transition-colors">
              <div className="mt-1 p-2 rounded-lg bg-slate-800 border border-slate-700">
                {getActivityIcon(log.action)}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <h4 className="text-sm font-semibold text-white">{log.action.replace(/_/g, " ")}</h4>
                  <time className="text-xs text-slate-500">{log.createdAt.toLocaleString()}</time>
                </div>
                <p className="text-sm text-slate-400 mt-1">{log.details}</p>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              No activity logs found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

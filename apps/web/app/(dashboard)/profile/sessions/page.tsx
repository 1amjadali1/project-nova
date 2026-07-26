import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Monitor, Smartphone, Globe, Shield, Clock } from "lucide-react";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/lib/audit/log";

export default async function SessionsPage() {
  const authSession = await auth.api.getSession({ headers: await headers() });
  if (!authSession?.user) redirect("/sign-in");

  const userId = authSession.user.id;
  const currentToken = authSession.session.token;

  const activeSessions = await prisma.userSession.findMany({
    where: { userId, status: "ACTIVE" },
    orderBy: { loginTime: "desc" }
  });

  async function terminateSessionAction(formData: FormData) {
    "use server";
    const sessionIdToTerminate = formData.get("sessionId") as string;
    if (!sessionIdToTerminate) return;

    await prisma.userSession.update({
      where: { id: sessionIdToTerminate },
      data: { status: "TERMINATED", logoutTime: new Date() }
    });

    await logAudit(userId, "SESSION_DESTROY", `User manually terminated session ${sessionIdToTerminate}`);
    revalidatePath("/profile/sessions");
  }

  async function terminateAllOtherSessionsAction() {
    "use server";
    await prisma.userSession.updateMany({
      where: { userId, status: "ACTIVE", betterAuthSessionId: { not: currentToken } },
      data: { status: "TERMINATED", logoutTime: new Date() }
    });
    
    await logAudit(userId, "SESSION_DESTROY", "User manually terminated ALL other sessions");
    revalidatePath("/profile/sessions");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Active Sessions</h2>
          <p className="text-sm text-slate-400 mt-1">Manage and revoke your active sessions across devices.</p>
        </div>
        <form action={terminateAllOtherSessionsAction}>
          <button type="submit" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 text-sm font-medium transition-colors">
            Logout Other Devices
          </button>
        </form>
      </div>

      <div className="grid gap-4">
        {activeSessions.map((session) => {
          const isCurrent = session.betterAuthSessionId === currentToken;
          return (
            <div key={session.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  {session.browser?.toLowerCase().includes("mobile") ? <Smartphone /> : <Monitor />}
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white flex items-center gap-2">
                    {session.browser || "Unknown Browser"} on {session.os || "Unknown OS"}
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Current Session
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center gap-4 mt-1.5 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> {session.ipAddress || "Unknown IP"}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Signed in {session.loginTime.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {!isCurrent && (
                <form action={terminateSessionAction}>
                  <input type="hidden" name="sessionId" value={session.id} />
                  <button type="submit" className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 text-sm font-medium transition-colors">
                    Revoke
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>
      
      {activeSessions.length === 0 && (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
          <Shield className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white">No active sessions found</h3>
          <p className="text-slate-400 mt-1">You do not have any active sessions at this time.</p>
        </div>
      )}
    </div>
  );
}

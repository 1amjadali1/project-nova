import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import SessionsClient from "./SessionsClient";

export default async function SessionsPage() {
  const reqHeaders = await headers();
  const sessions = await auth.api.listSessions({ headers: reqHeaders });
  const activeSession = await auth.api.getSession({ headers: reqHeaders });

  if (!sessions) {
    return <div className="text-slate-400">Failed to load sessions.</div>;
  }

  return (
    <div>
      <div className="mb-6 border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white">Active Sessions</h2>
        <p className="mt-1 text-sm text-slate-400">
          Manage the devices and browsers that are currently logged into your account.
        </p>
      </div>

      <SessionsClient 
        sessions={sessions} 
        currentSessionId={activeSession?.session.id} 
      />
    </div>
  );
}

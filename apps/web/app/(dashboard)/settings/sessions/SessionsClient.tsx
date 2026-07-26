"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

type Session = {
  id: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function SessionsClient({ sessions, currentSessionId }: { sessions: Session[]; currentSessionId?: string }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isRevokingOther, setIsRevokingOther] = useState(false);

  const handleRevoke = async (token: string) => {
    setLoadingId(token);
    await authClient.revokeSession({ token });
    setLoadingId(null);
    router.refresh();
  };

  const handleRevokeOther = async () => {
    setIsRevokingOther(true);
    await authClient.revokeOtherSessions();
    setIsRevokingOther(false);
    router.refresh();
  };

  const handleRevokeAll = async () => {
    // Revoking other sessions then signing out current
    setIsRevokingOther(true);
    await authClient.revokeOtherSessions();
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={handleRevokeOther}
          disabled={isRevokingOther || sessions.length <= 1}
          className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
        >
          {isRevokingOther ? "Logging out..." : "Logout Other Sessions"}
        </button>

        <button
          onClick={handleRevokeAll}
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
        >
          Logout All Sessions
        </button>
      </div>

      <div className="grid gap-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`flex flex-col justify-between gap-4 rounded-xl border p-5 sm:flex-row sm:items-center ${
              session.id === currentSessionId
                ? "border-cyan-500/30 bg-cyan-500/5"
                : "border-slate-800 bg-slate-900"
            }`}
          >
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-white">
                  {session.userAgent ? session.userAgent.split(" ")[0] : "Unknown Browser"}
                </h3>
                {session.id === currentSessionId && (
                  <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-xs font-medium text-cyan-400">
                    Current Session
                  </span>
                )}
              </div>
              
              <div className="mt-2 space-y-1 text-sm text-slate-400">
                <p>IP Address: {session.ipAddress || "Unknown"}</p>
                <p>Last Activity: {new Date(session.updatedAt).toLocaleString()}</p>
                <p>Created: {new Date(session.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {session.id !== currentSessionId && (
              <button
                onClick={() => handleRevoke(session.id)}
                disabled={loadingId === session.id}
                className="shrink-0 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
              >
                {loadingId === session.id ? "Logging out..." : "Logout"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

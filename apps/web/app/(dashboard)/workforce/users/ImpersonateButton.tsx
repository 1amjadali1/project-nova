"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { startImpersonationAction } from "@/app/actions/impersonate";

export default function ImpersonateButton({ targetUserId }: { targetUserId: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleImpersonate = async () => {
    // In a real app, this could open a modal for reason input
    const reason = prompt("Reason for impersonation:") || "Admin request";
    if (!reason.trim()) return;

    setIsPending(true);
    try {
      await startImpersonationAction(targetUserId, reason);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to impersonate");
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleImpersonate}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isPending}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition flex items-center gap-2 ${
        isHovered 
          ? "bg-yellow-500 text-yellow-950" 
          : "bg-slate-800 text-yellow-500 hover:bg-slate-700"
      }`}
      title="Switch to User"
    >
      <Users className="h-3.5 w-3.5" />
      {isPending ? "Switching..." : "Impersonate"}
    </button>
  );
}

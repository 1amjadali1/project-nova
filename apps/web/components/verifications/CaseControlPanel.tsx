"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  assignCaseAction,
  escalateCaseAction,
  returnCaseAction,
  approveCaseAction,
  closeCaseAction,
  reopenCaseAction,
} from "@/app/actions/workflow";
import { WorkflowStage, RequestStatus } from "@prisma/client";

type Props = {
  requestId: string;
  currentStage: WorkflowStage;
  status: RequestStatus;
  myLevel: number;
};

export default function CaseControlPanel({ requestId, currentStage, status, myLevel }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (actionFn: () => Promise<void>) => {
    setLoading(true);
    try {
      await actionFn();
      router.refresh();
    } catch (e: any) {
      alert(e.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl mb-8">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-2">Enterprise Case Controls</h3>
        <p className="text-sm text-slate-400">Available actions based on your role hierarchy and current stage.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Approve Button */}
        {["AGENT_PROCESSING", "QA_REVIEW", "TL_REVIEW", "MANAGER_REVIEW"].includes(currentStage) && status !== "CLOSED" && status !== "VERIFIED" && status !== "REJECTED" && (
          <button
            disabled={loading}
            onClick={() => handleAction(() => approveCaseAction(requestId))}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {currentStage === "MANAGER_REVIEW" ? "Final Approve" : "Approve & Advance"}
          </button>
        )}

        {/* Escalate Button */}
        {["AGENT_PROCESSING", "QA_REVIEW", "TL_REVIEW"].includes(currentStage) && (
          <button
            disabled={loading}
            onClick={() => handleAction(() => escalateCaseAction(requestId))}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 disabled:opacity-50"
          >
            Escalate
          </button>
        )}

        {/* Return Button */}
        {["QA_REVIEW", "TL_REVIEW", "MANAGER_REVIEW"].includes(currentStage) && (
          <button
            disabled={loading}
            onClick={() => {
              const reason = prompt("Enter return reason:");
              if (reason) handleAction(() => returnCaseAction(requestId, reason));
            }}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
          >
            Return to Previous Stage
          </button>
        )}

        {/* Close Actions (Managers only) */}
        {myLevel >= 30 && status !== "CLOSED" && (
          <button
            disabled={loading}
            onClick={() => handleAction(() => closeCaseAction(requestId, "CLOSED"))}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600 disabled:opacity-50"
          >
            Force Close
          </button>
        )}

        {/* Reopen Action (Managers only) */}
        {myLevel >= 30 && (status === "CLOSED" || status === "VERIFIED" || status === "REJECTED") && (
          <button
            disabled={loading}
            onClick={() => {
              const reason = prompt("Enter reason for reopening case:");
              if (reason) handleAction(() => reopenCaseAction(requestId, reason));
            }}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-50"
          >
            Re-open Case
          </button>
        )}
      </div>
    </div>
  );
}

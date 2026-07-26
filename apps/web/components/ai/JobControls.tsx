"use client";

import { useState } from "react";
import { retryAIJobAction, cancelAIJobAction } from "@/app/actions/ai";
import { RefreshCw, StopCircle } from "lucide-react";

interface JobControlsProps {
  jobId: string;
  status: string;
}

export default function JobControls({ jobId, status }: JobControlsProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const canCancel = status === "QUEUED" || status === "PROCESSING" || status === "WAITING_FOR_REVIEW";
  const canRetry = status === "FAILED" || status === "CANCELLED";

  const handleRetry = async () => {
    setIsProcessing(true);
    try {
      await retryAIJobAction(jobId);
    } catch (err) {
      alert("Failed to retry job");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this job?")) return;
    setIsProcessing(true);
    try {
      await cancelAIJobAction(jobId);
    } catch (err) {
      alert("Failed to cancel job");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!canCancel && !canRetry) return null;

  return (
    <div className="flex gap-3">
      {canRetry && (
        <button
          onClick={handleRetry}
          disabled={isProcessing}
          className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isProcessing ? "animate-spin" : ""}`} />
          Retry Job
        </button>
      )}
      
      {canCancel && (
        <button
          onClick={handleCancel}
          disabled={isProcessing}
          className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-red-400 border border-slate-700 hover:bg-slate-700 transition disabled:opacity-50"
        >
          <StopCircle className="h-4 w-4" />
          Cancel Job
        </button>
      )}
    </div>
  );
}

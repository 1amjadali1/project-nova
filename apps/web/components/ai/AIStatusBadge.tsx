import { CheckCircle2, Clock, XCircle, AlertCircle, RefreshCw, StopCircle } from "lucide-react";
import { AIJobStatus } from "@prisma/client";

interface AIStatusBadgeProps {
  status: AIJobStatus | string;
}

export default function AIStatusBadge({ status }: AIStatusBadgeProps) {
  const normalized = status.toUpperCase() as AIJobStatus;

  switch (normalized) {
    case "QUEUED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-medium text-slate-400 ring-1 ring-inset ring-slate-500/20">
          <Clock className="h-3.5 w-3.5" />
          Queued
        </span>
      );
    case "PROCESSING":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          Processing
        </span>
      );
    case "WAITING_FOR_REVIEW":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-400 ring-1 ring-inset ring-orange-500/20">
          <AlertCircle className="h-3.5 w-3.5" />
          Needs Review
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Completed
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-500/20">
          <XCircle className="h-3.5 w-3.5" />
          Failed
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-500/10 px-2.5 py-1 text-xs font-medium text-zinc-400 ring-1 ring-inset ring-zinc-500/20">
          <StopCircle className="h-3.5 w-3.5" />
          Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-medium text-slate-400 ring-1 ring-inset ring-slate-500/20">
          {status}
        </span>
      );
  }
}

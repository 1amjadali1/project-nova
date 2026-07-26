import { CheckCircle2, Clock, XCircle, AlertCircle, RefreshCw } from "lucide-react";

export type DocumentStatus = "UPLOADED" | "PROCESSING" | "OCR_COMPLETED" | "VERIFIED" | "REJECTED" | "EXPIRED";

interface DocumentStatusBadgeProps {
  status: DocumentStatus | string;
}

export default function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  const normalized = status.toUpperCase() as DocumentStatus;

  switch (normalized) {
    case "UPLOADED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-medium text-slate-400 ring-1 ring-inset ring-slate-500/20">
          <Clock className="h-3.5 w-3.5" />
          Uploaded
        </span>
      );
    case "PROCESSING":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          Processing
        </span>
      );
    case "OCR_COMPLETED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-400 ring-1 ring-inset ring-cyan-500/20">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Scanned
        </span>
      );
    case "VERIFIED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Verified
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-500/20">
          <XCircle className="h-3.5 w-3.5" />
          Rejected
        </span>
      );
    case "EXPIRED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-400 ring-1 ring-inset ring-orange-500/20">
          <AlertCircle className="h-3.5 w-3.5" />
          Expired
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

import { CheckCircle2, AlertTriangle, XCircle, Ban } from "lucide-react";

interface ProviderStatusBadgeProps {
  status: string;
  enabled: boolean;
}

export default function ProviderStatusBadge({ status, enabled }: ProviderStatusBadgeProps) {
  if (!enabled) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-medium text-slate-400 ring-1 ring-inset ring-slate-500/20">
        <Ban className="h-3.5 w-3.5" />
        Disabled
      </span>
    );
  }

  const normalized = status.toUpperCase();

  switch (normalized) {
    case "HEALTHY":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Healthy
        </span>
      );
    case "WARNING":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-400 ring-1 ring-inset ring-orange-500/20">
          <AlertTriangle className="h-3.5 w-3.5" />
          Warning
        </span>
      );
    case "OFFLINE":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-500/20">
          <XCircle className="h-3.5 w-3.5" />
          Offline
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

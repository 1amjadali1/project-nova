import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-8 text-center">
      <div className="mb-4 rounded-full bg-slate-800/50 p-4 ring-1 ring-inset ring-slate-700/50">
        <Icon className="h-8 w-8 text-slate-500" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-white tracking-tight">{title}</h3>
      <p className="max-w-xs text-sm text-slate-400">{description}</p>
      
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 rounded-xl bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 ring-1 ring-inset ring-cyan-500/20 transition hover:bg-cyan-500/20"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

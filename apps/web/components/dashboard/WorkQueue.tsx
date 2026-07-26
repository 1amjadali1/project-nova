import { Clock, AlertTriangle, AlertCircle } from "lucide-react";
import Link from "next/link";

type WorkQueueItem = {
  id: string;
  type: string;
  status: string;
  priority: string;
  candidate: {
    firstName: string;
    lastName: string;
  };
};

export default function WorkQueue({ items = [] }: { items?: WorkQueueItem[] }) {
  const getIcon = (priority: string) => {
    switch (priority) {
      case "URGENT": return AlertTriangle;
      case "HIGH": return AlertCircle;
      default: return Clock;
    }
  };

  const getColor = (priority: string) => {
    switch (priority) {
      case "URGENT": return { color: "text-red-400", bg: "bg-red-500/10" };
      case "HIGH": return { color: "text-orange-400", bg: "bg-orange-500/10" };
      case "LOW": return { color: "text-green-400", bg: "bg-green-500/10" };
      default: return { color: "text-blue-400", bg: "bg-blue-500/10" };
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Work Queue</h2>
        <p className="text-sm text-slate-400">Items requiring your attention</p>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-sm text-slate-500 text-center py-4">No pending items.</div>
        ) : (
          items.map((item) => {
            const Icon = getIcon(item.priority);
            const style = getColor(item.priority);
            
            return (
              <Link
                href={`/verifications/${item.id}`}
                key={item.id}
                className="group flex cursor-pointer items-center gap-4 rounded-xl border border-slate-800 bg-slate-950 p-3 transition hover:border-slate-700 hover:bg-slate-900"
              >
                <div className={`rounded-lg p-2 ${style.bg} ${style.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors truncate">
                    {item.type.replace(/_/g, " ")} - {item.candidate.firstName} {item.candidate.lastName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{item.id}</p>
                </div>
                <div>
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${style.color} ${style.bg} ring-current/20`}>
                    {item.priority}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

import { Clock, AlertTriangle, CheckSquare } from "lucide-react";

export default function WorkQueue() {
  const queue = [
    {
      id: "REQ-4092",
      title: "Verify Employment - Sarah Jenkins",
      status: "Overdue",
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      id: "REQ-4095",
      title: "Criminal Record - Michael Chen",
      status: "Pending Review",
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      id: "TASK-12",
      title: "Onboard Acme Corp",
      status: "Today",
      icon: CheckSquare,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Work Queue</h2>
        <p className="text-sm text-slate-400">Items requiring your attention</p>
      </div>

      <div className="space-y-3">
        {queue.map((item) => (
          <div
            key={item.id}
            className="group flex cursor-pointer items-center gap-4 rounded-xl border border-slate-800 bg-slate-950 p-3 transition hover:border-slate-700 hover:bg-slate-900"
          >
            <div className={`rounded-lg p-2 ${item.bg} ${item.color}`}>
              <item.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">{item.title}</p>
              <p className="text-xs text-slate-500">{item.id}</p>
            </div>
            <div>
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${item.color} ${item.bg} ring-current/20`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

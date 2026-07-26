import { Clock, AlertCircle, CheckCircle, Timer } from "lucide-react";

interface SLAMetrics {
  averageTime: string;
  pendingToday: number;
  overdueCases: number;
  completedToday: number;
}

export default function SLADashboard({ metrics }: { metrics: SLAMetrics }) {
  const cards = [
    {
      title: "Avg Resolution Time",
      value: metrics.averageTime,
      icon: Timer,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      ring: "ring-cyan-500/20",
    },
    {
      title: "Pending Today",
      value: metrics.pendingToday,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      ring: "ring-amber-500/20",
    },
    {
      title: "Overdue Cases",
      value: metrics.overdueCases,
      icon: AlertCircle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      ring: "ring-red-500/20",
    },
    {
      title: "Completed Today",
      value: metrics.completedToday,
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-500/10",
      ring: "ring-green-500/20",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">SLA Performance</h2>
        <p className="text-sm text-slate-400">Service level agreement metrics</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <div key={card.title} className="flex flex-col gap-3 rounded-xl bg-slate-950 p-4 border border-slate-800 transition hover:border-slate-700">
            <div className={`w-fit rounded-lg p-2 ring-1 ring-inset ${card.bg} ${card.color} ${card.ring}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-xs font-medium text-slate-400">{card.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

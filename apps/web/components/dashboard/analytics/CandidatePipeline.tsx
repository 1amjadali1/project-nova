import { Users, FileText, Loader2, CheckCircle2, XCircle } from "lucide-react";

interface PipelineMetrics {
  applied: number;
  documentsPending: number;
  verificationRunning: number;
  completed: number;
  rejected: number;
}

export default function CandidatePipeline({ metrics }: { metrics: PipelineMetrics }) {
  const stages = [
    { name: "Applied", count: metrics.applied, icon: Users, color: "text-slate-400", bg: "bg-slate-500/10" },
    { name: "Docs Pending", count: metrics.documentsPending, icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10" },
    { name: "Verifying", count: metrics.verificationRunning, icon: Loader2, color: "text-cyan-400", bg: "bg-cyan-500/10", spin: true },
    { name: "Completed", count: metrics.completed, icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10" },
    { name: "Rejected", count: metrics.rejected, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Candidate Pipeline</h2>
        <p className="text-sm text-slate-400">Current cohort stage distribution</p>
      </div>

      <div className="flex w-full items-center justify-between gap-2 overflow-x-auto pb-2">
        {stages.map((stage, index) => (
          <div key={stage.name} className="flex flex-col items-center gap-3 min-w-[100px]">
            <div className={`relative flex h-16 w-16 items-center justify-center rounded-full ${stage.bg} ${stage.color} ring-1 ring-inset ring-current/20`}>
              <stage.icon className={`h-7 w-7 ${stage.spin ? "animate-spin-slow" : ""}`} />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{stage.count}</p>
              <p className="text-xs font-medium text-slate-400">{stage.name}</p>
            </div>
            {index < stages.length - 1 && (
              <div className="absolute hidden md:block h-px w-8 bg-slate-800 translate-x-[60px] -translate-y-8"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

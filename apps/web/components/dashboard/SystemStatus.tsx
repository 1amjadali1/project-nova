import { Database, Server, Cog, ShieldCheck, Activity } from "lucide-react";

export default function SystemStatus() {
  const statuses = [
    { name: "Database", status: "Healthy", icon: Database },
    { name: "Authentication", status: "Healthy", icon: ShieldCheck },
    { name: "Background Jobs", status: "Warning", icon: Cog },
    { name: "API Gateway", status: "Healthy", icon: Server },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-tight">System Status</h2>
        <span className="flex h-2 w-2">
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
        </span>
      </div>

      <div className="space-y-4">
        {statuses.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-slate-800 p-2 text-slate-400">
                <item.icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-slate-300">{item.name}</span>
            </div>
            
            {item.status === "Healthy" ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
                <Activity className="h-3 w-3" />
                Healthy
              </span>
            ) : item.status === "Warning" ? (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20">
                <Activity className="h-3 w-3" />
                Warning
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400 ring-1 ring-inset ring-red-500/20">
                <Activity className="h-3 w-3" />
                Offline
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

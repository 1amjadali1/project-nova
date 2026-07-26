import { LucideIcon } from "lucide-react";

interface AIQueueCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export default function AIQueueCard({ title, value, icon: Icon, trend, trendUp }: AIQueueCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <div className="rounded-xl bg-slate-800 p-2 text-cyan-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <p className="text-3xl font-bold text-white">{value}</p>
        {trend && (
          <p className={`text-xs font-medium ${trendUp ? "text-green-400" : "text-red-400"}`}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}

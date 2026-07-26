import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm transition-all hover:shadow-cyan-500/5 hover:border-slate-700 relative overflow-hidden group">
      {/* Decorative gradient blob */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-500/5 blur-2xl transition-all group-hover:bg-cyan-500/10"></div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <div className="rounded-xl bg-slate-800/50 p-2 text-cyan-400 ring-1 ring-inset ring-slate-700/50">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      
      <div className="mt-4 flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        {trend && (
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {trend.isPositive ? "+" : "-"}{trend.value}%
          </span>
        )}
      </div>
      
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

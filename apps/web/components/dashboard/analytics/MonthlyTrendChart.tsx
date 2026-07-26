"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import EmptyState from "@/components/ui/EmptyState";
import { TrendingUp } from "lucide-react";

interface MonthlyTrendChartProps {
  data: { date: string; Candidates: number; Verifications: number }[];
}

export default function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const hasData = data && data.some(d => d.Candidates > 0 || d.Verifications > 0);

  if (!hasData) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm h-full flex flex-col">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Monthly Trend</h2>
          <p className="text-sm text-slate-400">Growth over the last 30 days</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={TrendingUp}
            title="No Activity Yet"
            description="Start adding candidates to see growth trends."
            actionLabel="Add Candidate"
            actionHref="/candidates/new"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Monthly Trend</h2>
        <p className="text-sm text-slate-400">Growth over the last 30 days</p>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                borderRadius: "0.75rem",
                color: "#f8fafc",
              }}
              itemStyle={{ color: "#e2e8f0" }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ paddingTop: "20px" }}
            />
            <Line type="monotone" dataKey="Candidates" stroke="#06b6d4" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Verifications" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

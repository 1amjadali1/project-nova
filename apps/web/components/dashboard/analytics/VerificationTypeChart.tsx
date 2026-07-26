"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import EmptyState from "@/components/ui/EmptyState";
import { PieChart as PieChartIcon } from "lucide-react";

interface VerificationTypeChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#3b82f6"];

export default function VerificationTypeChart({ data }: VerificationTypeChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm h-full flex flex-col">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Verification Types</h2>
          <p className="text-sm text-slate-400">Distribution of request types</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={PieChartIcon}
            title="No Verifications Yet"
            description="Create your first verification request to see type distributions."
            actionLabel="New Request"
            actionHref="/verifications/new"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Verification Types</h2>
        <p className="text-sm text-slate-400">Distribution of request types</p>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

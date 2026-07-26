"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mock data representing verification request trends over the past 7 days
const data = [
  { name: "Mon", Pending: 12, Completed: 8, Failed: 1 },
  { name: "Tue", Pending: 19, Completed: 15, Failed: 2 },
  { name: "Wed", Pending: 15, Completed: 20, Failed: 0 },
  { name: "Thu", Pending: 22, Completed: 18, Failed: 3 },
  { name: "Fri", Pending: 30, Completed: 25, Failed: 1 },
  { name: "Sat", Pending: 10, Completed: 12, Failed: 0 },
  { name: "Sun", Pending: 8, Completed: 9, Failed: 0 },
];

export default function VerificationChart() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Verification Throughput</h2>
        <p className="text-sm text-slate-400">Past 7 days request volume</p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="name" 
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
              cursor={{ fill: "#1e293b", opacity: 0.4 }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="circle"
            />
            <Bar dataKey="Completed" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
            <Bar dataKey="Pending" stackId="a" fill="#06b6d4" />
            <Bar dataKey="Failed" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

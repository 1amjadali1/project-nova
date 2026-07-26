import { format } from "date-fns";

export interface ProviderMetric {
  id: string;
  date: Date;
  totalRequests: number;
  successCount: number;
  failureCount: number;
  avgTimeMs: number;
  avgConfidence: number;
  retries: number;
}

interface ProviderMetricTableProps {
  metrics: ProviderMetric[];
}

export default function ProviderMetricTable({ metrics }: ProviderMetricTableProps) {
  if (metrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 py-16">
        <p className="font-medium text-slate-400">No telemetry data available.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-950/50 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Requests</th>
              <th className="px-6 py-4 font-medium text-right">Success Rate</th>
              <th className="px-6 py-4 font-medium text-right">Avg Time</th>
              <th className="px-6 py-4 font-medium text-right">Avg Conf</th>
              <th className="px-6 py-4 font-medium text-right">Retries</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {metrics.map((metric) => {
              const successRate = metric.totalRequests > 0 
                ? ((metric.successCount / metric.totalRequests) * 100).toFixed(1) 
                : "0.0";
                
              return (
                <tr key={metric.id} className="transition hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-white">
                    {format(new Date(metric.date), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-300">
                    {metric.totalRequests}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-medium ${parseFloat(successRate) >= 95 ? "text-green-400" : parseFloat(successRate) >= 80 ? "text-orange-400" : "text-red-400"}`}>
                      {successRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-300">
                    {(metric.avgTimeMs / 1000).toFixed(2)}s
                  </td>
                  <td className="px-6 py-4 text-right text-slate-300">
                    {metric.avgConfidence.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-right text-slate-400">
                    {metric.retries}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

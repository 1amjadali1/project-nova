import { Dispatcher } from "@/lib/jobs/dispatcher";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/auth/rbac";
import { Activity, Archive, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export const dynamic = "force-dynamic";

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: number, icon: React.ElementType, color: string }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
    <div className={`rounded-xl p-3 ${color}`}>
      <Icon className="h-6 w-6" />
    </div>
  </div>
);

export default async function JobsDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const isSuperAdmin = await hasPermission(session.user.id, "system:admin");
  if (!isSuperAdmin) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">You do not have permission to view the Enterprise Job Monitor.</p>
        </div>
      </div>
    );
  }

  const metrics = await Dispatcher.getMetrics();
  const jobs = await Dispatcher.getJobs();

  return (
    <div className="space-y-8 pb-12 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Enterprise Job Monitor</h1>
        <p className="text-slate-400 mt-2">Real-time background queue architecture</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Queued" value={metrics.queued} icon={Archive} color="bg-blue-500/10 text-blue-400" />
        <StatCard title="Processing" value={metrics.processing} icon={Activity} color="bg-cyan-500/10 text-cyan-400" />
        <StatCard title="Completed" value={metrics.completed} icon={CheckCircle2} color="bg-green-500/10 text-green-400" />
        <StatCard title="Failed (Retrying)" value={metrics.failed} icon={RefreshCw} color="bg-orange-500/10 text-orange-400" />
        <StatCard title="Dead Letter Queue" value={metrics.deadLetter} icon={AlertCircle} color="bg-red-500/10 text-red-400" />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-white">Recent Jobs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950/50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Job ID</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Retries</th>
                <th className="px-6 py-4 font-medium">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No background jobs found.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{job.id.substring(0, 13)}...</td>
                    <td className="px-6 py-4 font-medium text-slate-300">{job.type}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        job.status === "COMPLETED" ? "bg-green-500/10 text-green-400 ring-green-500/20" :
                        job.status === "FAILED" ? "bg-orange-500/10 text-orange-400 ring-orange-500/20" :
                        job.status === "DEAD_LETTER" ? "bg-red-500/10 text-red-400 ring-red-500/20" :
                        job.status === "PROCESSING" ? "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20" :
                        "bg-blue-500/10 text-blue-400 ring-blue-500/20"
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{job.retryCount} / {job.maxRetries}</td>
                    <td className="px-6 py-4">{job.createdAt.toLocaleTimeString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

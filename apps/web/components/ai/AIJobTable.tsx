import Link from "next/link";
import AIStatusBadge from "./AIStatusBadge";
import ConfidenceBadge from "./ConfidenceBadge";
import { formatDistanceToNow } from "date-fns";

export interface AIJobInfo {
  id: string;
  jobType: string;
  status: string;
  confidenceScore: number | null;
  processingTime: number | null;
  createdAt: Date;
  document: { originalFileName: string };
  candidate: { firstName: string; lastName: string };
}

interface AIJobTableProps {
  jobs: AIJobInfo[];
}

export default function AIJobTable({ jobs }: AIJobTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 py-16">
        <p className="font-medium text-slate-400">No AI jobs found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-950/50 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Job ID</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Candidate</th>
              <th className="px-6 py-4 font-medium">Confidence</th>
              <th className="px-6 py-4 font-medium text-right">Age</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {jobs.map((job) => (
              <tr key={job.id} className="transition hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <Link href={`/ai/jobs/${job.id}`} className="font-mono text-cyan-400 hover:underline">
                    {job.id.slice(-8)}
                  </Link>
                </td>
                <td className="px-6 py-4 font-medium text-white">
                  {job.jobType.replace(/_/g, " ")}
                </td>
                <td className="px-6 py-4">
                  <AIStatusBadge status={job.status} />
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {job.candidate.firstName} {job.candidate.lastName}
                </td>
                <td className="px-6 py-4">
                  {job.confidenceScore ? <ConfidenceBadge score={job.confidenceScore} /> : <span className="text-slate-600">-</span>}
                </td>
                <td className="px-6 py-4 text-right text-slate-400">
                  {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

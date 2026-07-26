/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import StatusBadge from "@/components/verifications/StatusBadge";
import PriorityBadge from "@/components/verifications/PriorityBadge";

export default function VerificationRequestsTab({ candidate }: { candidate: any }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-950/50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Client</th>
              <th className="px-6 py-4 font-medium">Package</th>
              <th className="px-6 py-4 font-medium">Priority</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Checks</th>
              <th className="px-6 py-4 font-medium">Requested Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {candidate.verifications.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  No verification requests found for this candidate.
                </td>
              </tr>
            ) : (
              candidate.verifications.map((req: any) => (
                <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-300">
                    {req.client?.name || candidate.organization.name}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {req.package?.name || "Standard Verification"}
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={req.priority} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                      {req.checks?.length || 0} Modules
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/verifications/${req.id}`}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
                    >
                      View Request
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

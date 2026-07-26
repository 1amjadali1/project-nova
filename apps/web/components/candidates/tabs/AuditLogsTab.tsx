/* eslint-disable @typescript-eslint/no-explicit-any */
export default function AuditLogsTab({ auditLogs }: { auditLogs: any[] }) {
  if (!auditLogs || auditLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 py-16">
        <p className="text-lg font-medium text-slate-300">No system audit logs found for this candidate.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-950/50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Timestamp</th>
              <th className="px-6 py-4 font-medium">Action</th>
              <th className="px-6 py-4 font-medium">Entity Type</th>
              <th className="px-6 py-4 font-medium">User ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {auditLogs.map((log: any) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4 text-slate-300">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 font-medium text-slate-200">
                  {log.action}
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {log.entityType} ({log.entityId})
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {log.userId || "System"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

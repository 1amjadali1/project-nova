import { format } from "date-fns";

export interface AuditLogInfo {
  id: string;
  action: string;
  notes: string | null;
  createdAt: Date;
  performedBy: { firstName: string; lastName: string } | null;
}

interface AIJobTimelineProps {
  logs: AuditLogInfo[];
}

export default function AIJobTimeline({ logs }: AIJobTimelineProps) {
  if (!logs || logs.length === 0) return null;

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {logs.map((log, logIdx) => (
          <li key={log.id}>
            <div className="relative pb-8">
              {logIdx !== logs.length - 1 ? (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-800" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center ring-8 ring-slate-900">
                    <div className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-slate-300">
                      <span className="font-medium text-white mr-2">{log.action}</span>
                      {log.notes}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      by {log.performedBy ? `${log.performedBy.firstName} ${log.performedBy.lastName}` : "System"}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-slate-500">
                    <time dateTime={log.createdAt.toISOString()}>
                      {format(new Date(log.createdAt), "MMM d, h:mm a")}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

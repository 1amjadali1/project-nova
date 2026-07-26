 
export default function TimelineTab({ timelineEvents }: { timelineEvents: any[] }) {
  if (!timelineEvents || timelineEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 py-16">
        <p className="text-lg font-medium text-slate-300">No timeline events found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {timelineEvents.map((event: any, eventIdx: number) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== timelineEvents.length - 1 ? (
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
                        <span className="font-medium text-white">{event.action}</span>
                        {" - "}{event.description}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-slate-500">
                      {new Date(event.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

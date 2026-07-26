export function KPISkeleton() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-slate-800 animate-pulse"></div>
        <div className="h-8 w-8 rounded-xl bg-slate-800 animate-pulse"></div>
      </div>
      
      <div className="mt-4 flex items-baseline gap-2">
        <div className="h-8 w-16 rounded bg-slate-800 animate-pulse"></div>
        <div className="h-4 w-8 rounded bg-slate-800 animate-pulse"></div>
      </div>
      
      <div className="mt-2 h-3 w-32 rounded bg-slate-800 animate-pulse"></div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm h-full min-h-[300px] flex flex-col">
      <div className="mb-6">
        <div className="h-6 w-48 rounded bg-slate-800 animate-pulse mb-2"></div>
        <div className="h-4 w-32 rounded bg-slate-800 animate-pulse"></div>
      </div>
      <div className="flex-1 rounded-xl bg-slate-800/50 animate-pulse"></div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div className="mb-6">
        <div className="h-6 w-40 rounded bg-slate-800 animate-pulse mb-2"></div>
        <div className="h-4 w-48 rounded bg-slate-800 animate-pulse"></div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-800 animate-pulse"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 w-3/4 rounded bg-slate-800 animate-pulse"></div>
              <div className="h-3 w-1/2 rounded bg-slate-800 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

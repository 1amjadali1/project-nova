import { KPISkeleton, ChartSkeleton, ListSkeleton } from "@/components/dashboard/LoadingSkeletons";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 pb-12 max-w-[1600px] mx-auto animate-pulse">
      
      {/* Welcome Header Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-sm">
        <div>
          <div className="h-8 w-64 rounded bg-slate-800 mb-2"></div>
          <div className="h-4 w-48 rounded bg-slate-800"></div>
        </div>
        <div className="h-10 w-40 rounded-xl bg-slate-800"></div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPISkeleton />
        <KPISkeleton />
        <KPISkeleton />
        <KPISkeleton />
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">
          <ChartSkeleton />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ListSkeleton count={3} />
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
              <div className="h-6 w-32 rounded bg-slate-800 mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 rounded-xl bg-slate-800"></div>
                <div className="h-24 rounded-xl bg-slate-800"></div>
                <div className="h-24 rounded-xl bg-slate-800"></div>
                <div className="h-24 rounded-xl bg-slate-800"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <ListSkeleton count={4} />
          <ListSkeleton count={4} />
        </div>
        
      </div>
      
    </div>
  );
}

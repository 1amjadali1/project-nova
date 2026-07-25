export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-10 w-48 rounded-lg bg-slate-800"></div>
        <div className="mt-3 h-5 w-64 rounded bg-slate-800/60"></div>
      </div>

      {/* New Form Skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="mb-6 h-8 w-48 rounded bg-slate-800"></div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-12 w-full rounded-lg bg-slate-800/60"></div>
          <div className="h-12 w-full rounded-lg bg-slate-800/60"></div>
          <div className="h-12 w-full rounded-lg bg-slate-800/60"></div>
          <div className="h-12 w-full rounded-lg bg-slate-800/60"></div>
          <div className="md:col-span-2 h-12 w-full rounded-lg bg-slate-800/60"></div>
        </div>
        <div className="mt-6 h-12 w-48 rounded-xl bg-slate-800"></div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="h-12 w-full max-w-md rounded-lg bg-slate-800/60"></div>
          <div className="h-10 w-32 rounded-lg bg-slate-800/60"></div>
        </div>
        
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-800 text-sm">
                <tr>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <th key={i} className="px-6 py-4">
                      <div className="h-4 w-16 rounded bg-slate-700"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-t border-slate-800">
                    <td className="px-6 py-4"><div className="h-4 w-32 rounded bg-slate-800"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 rounded bg-slate-800"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-40 rounded bg-slate-800"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-28 rounded bg-slate-800"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 rounded-full bg-slate-800"></div></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <div className="h-7 w-12 rounded bg-slate-800"></div>
                        <div className="h-7 w-16 rounded bg-slate-800"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination Skeleton */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-6">
          <div className="h-5 w-24 rounded bg-slate-800"></div>
          <div className="flex gap-2">
            <div className="h-9 w-20 rounded-lg bg-slate-800"></div>
            <div className="h-9 w-20 rounded-lg bg-slate-800"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

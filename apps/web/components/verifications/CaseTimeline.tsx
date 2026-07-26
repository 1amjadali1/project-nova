import { prisma } from "@/lib/prisma";

type Props = {
  requestId: string;
};

export default async function CaseTimeline({ requestId }: Props) {
  const events = await prisma.timelineEvent.findMany({
    where: { verificationRequestId: requestId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { firstName: true, lastName: true } } },
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl mt-8">
      <h2 className="mb-6 text-xl font-semibold text-white">Case Timeline & Audit</h2>
      
      {events.length === 0 ? (
        <div className="text-sm text-slate-400 italic">No timeline events found.</div>
      ) : (
        <div className="relative border-l border-slate-700 ml-3 space-y-6">
          {events.map((event) => (
            <div key={event.id} className="relative pl-6">
              <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-cyan-500 ring-4 ring-slate-900" />
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                <span className="text-sm font-semibold text-white">
                  {event.action.replace(/_/g, " ")}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(event.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-slate-300">
                {event.comment || <span className="italic text-slate-500">No comment</span>}
              </div>
              <div className="text-xs text-slate-500 mt-2 flex gap-2 items-center">
                <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {event.userRole || "System"}
                </span>
                <span>
                  {event.user ? `${event.user.firstName} ${event.user.lastName}` : "System"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

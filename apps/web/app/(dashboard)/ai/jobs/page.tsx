import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BrainCircuit, Search, Filter } from "lucide-react";
import AIJobTable from "@/components/ai/AIJobTable";

export default async function AIJobsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const orgFilter = { organizationId: session.user.organizationId };

  const jobs = await prisma.aIJob.findMany({
    where: orgFilter,
    orderBy: { createdAt: "desc" },
    include: {
      document: { select: { originalFileName: true } },
      candidate: { select: { firstName: true, lastName: true } },
    }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-cyan-400" />
            AI Jobs
          </h1>
          <p className="mt-2 text-slate-400">
            View all processing queues and extraction histories.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search jobs by ID or Candidate name..."
            className="w-full rounded-lg bg-slate-950 border border-slate-700 py-2 pl-10 pr-4 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition">
            <Filter className="h-4 w-4" />
            Filter Status
          </button>
        </div>
      </div>

      <AIJobTable jobs={jobs} />
    </div>
  );
}

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";
import AIJobTable from "@/components/ai/AIJobTable";

export default async function AIReviewQueuePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const orgFilter = { organizationId: session.user.organizationId };

  const reviewJobs = await prisma.aIJob.findMany({
    where: {
      ...orgFilter,
      status: "WAITING_FOR_REVIEW",
    },
    orderBy: { priority: "desc", createdAt: "asc" }, // Highest priority first, then oldest
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
            <AlertCircle className="h-8 w-8 text-orange-400" />
            Human Review Queue
          </h1>
          <p className="mt-2 text-slate-400">
            AI extractions with low confidence or validation errors that require manual verification.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-4 mb-6">
        <p className="text-sm font-medium text-orange-400">
          There {reviewJobs.length === 1 ? "is" : "are"} currently <strong>{reviewJobs.length}</strong> {reviewJobs.length === 1 ? "job" : "jobs"} waiting for human review.
        </p>
      </div>

      <AIJobTable jobs={reviewJobs} />
    </div>
  );
}

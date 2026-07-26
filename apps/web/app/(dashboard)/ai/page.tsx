import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BrainCircuit, ListOrdered, CheckCircle2, XCircle, Clock, Zap, AlertCircle, Server } from "lucide-react";
import Link from "next/link";
import AIQueueCard from "@/components/ai/AIQueueCard";
import AIJobTable from "@/components/ai/AIJobTable";

export default async function AIDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const orgFilter = { organizationId: session.user.organizationId };

  // Run aggregations in parallel
  const [
    recentJobs,
    totalQueued,
    totalProcessing,
    totalReview,
    totalCompleted,
    totalFailed,
    avgProcessingTimeObj,
    avgConfidenceObj
  ] = await Promise.all([
    prisma.aIJob.findMany({
      where: orgFilter,
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        document: { select: { originalFileName: true } },
        candidate: { select: { firstName: true, lastName: true } },
      }
    }),
    prisma.aIJob.count({ where: { ...orgFilter, status: "QUEUED" } }),
    prisma.aIJob.count({ where: { ...orgFilter, status: "PROCESSING" } }),
    prisma.aIJob.count({ where: { ...orgFilter, status: "WAITING_FOR_REVIEW" } }),
    prisma.aIJob.count({ where: { ...orgFilter, status: "COMPLETED" } }),
    prisma.aIJob.count({ where: { ...orgFilter, status: "FAILED" } }),
    prisma.aIJob.aggregate({
      where: { ...orgFilter, status: "COMPLETED", processingTime: { not: null } },
      _avg: { processingTime: true }
    }),
    prisma.aIJob.aggregate({
      where: { ...orgFilter, status: "COMPLETED", confidenceScore: { not: null } },
      _avg: { confidenceScore: true }
    })
  ]);

  const avgProcessingTime = avgProcessingTimeObj._avg.processingTime 
    ? (avgProcessingTimeObj._avg.processingTime / 1000).toFixed(1) + "s" 
    : "-";
    
  const avgConfidence = avgConfidenceObj._avg.confidenceScore 
    ? avgConfidenceObj._avg.confidenceScore.toFixed(1) + "%" 
    : "-";

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <BrainCircuit className="h-8 w-8 text-cyan-400" />
            AI Intelligence Hub
          </h1>
          <p className="mt-2 text-slate-400">
            Monitor background processing pipelines and OCR extractions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/ai/providers"
            className="rounded-lg bg-slate-900 border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 transition flex items-center gap-2"
          >
            <Server className="h-4 w-4" /> Manage Providers
          </Link>
          <Link 
            href="/ai/jobs"
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition"
          >
            View All Jobs
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AIQueueCard 
          title="Queued Jobs" 
          value={totalQueued} 
          icon={ListOrdered} 
          trend="Waiting for worker"
        />
        <AIQueueCard 
          title="Processing" 
          value={totalProcessing} 
          icon={Zap} 
          trend="Currently running"
          trendUp={true}
        />
        <AIQueueCard 
          title="Needs Review" 
          value={totalReview} 
          icon={AlertCircle}
          trend={totalReview > 0 ? "Requires attention" : "All clear"}
          trendUp={totalReview === 0}
        />
        <AIQueueCard 
          title="Completed" 
          value={totalCompleted} 
          icon={CheckCircle2} 
        />
        <AIQueueCard 
          title="Failed / Cancelled" 
          value={totalFailed} 
          icon={XCircle} 
        />
        <AIQueueCard 
          title="Avg Processing Time" 
          value={avgProcessingTime} 
          icon={Clock} 
        />
        <AIQueueCard 
          title="Avg Confidence" 
          value={avgConfidence} 
          icon={BrainCircuit} 
          trendUp={avgConfidenceObj._avg.confidenceScore ? avgConfidenceObj._avg.confidenceScore > 80 : undefined}
        />
      </div>

      <div className="pt-4">
        <h2 className="text-xl font-semibold text-white mb-6">Recent AI Activity</h2>
        <AIJobTable jobs={recentJobs} />
      </div>
    </div>
  );
}

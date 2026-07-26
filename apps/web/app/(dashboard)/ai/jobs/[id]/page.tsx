import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AIStatusBadge from "@/components/ai/AIStatusBadge";
import ConfidenceBadge from "@/components/ai/ConfidenceBadge";
import AIJobTimeline from "@/components/ai/AIJobTimeline";
import JobControls from "@/components/ai/JobControls";
import OCRResultCard from "@/components/ai/OCRResultCard";
import ConfidenceTable from "@/components/ai/ConfidenceTable";
import { format } from "date-fns";

export default async function AIJobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) redirect("/login");

  const job = await prisma.aIJob.findUnique({
    where: { id },
    include: {
      document: true,
      candidate: true,
      extractions: true,
      auditLogs: {
        orderBy: { createdAt: "desc" },
        include: { performedBy: { select: { firstName: true, lastName: true } } }
      }
    },
  });

  if (!job) redirect("/ai/jobs");

  if (job.organizationId !== session.user.organizationId) {
    redirect("/ai/jobs");
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/ai/jobs"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              Job {job.id.slice(-8)}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Type: {job.jobType.replace(/_/g, " ")} • Created {format(job.createdAt, "PPP p")}
            </p>
          </div>
        </div>
        <JobControls jobId={job.id} status={job.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Extractions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-6">Processing Details</h3>
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-slate-400">Status</dt>
                <dd className="mt-1"><AIStatusBadge status={job.status} /></dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-slate-400">Overall Confidence</dt>
                <dd className="mt-1">
                  {job.confidenceScore ? <ConfidenceBadge score={job.confidenceScore} /> : <span className="text-slate-600">-</span>}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-slate-400">Candidate</dt>
                <dd className="mt-1 text-cyan-400 hover:underline">
                  <Link href={`/candidates/${job.candidateId}`}>
                    {job.candidate.firstName} {job.candidate.lastName}
                  </Link>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-slate-400">Document</dt>
                <dd className="mt-1 text-cyan-400 hover:underline">
                  <Link href={`/documents/${job.documentId}`}>
                    {job.document.originalFileName}
                  </Link>
                </dd>
              </div>

              {job.processingTime && (
                <div>
                  <dt className="text-sm font-medium text-slate-400">Processing Time</dt>
                  <dd className="mt-1 text-slate-300">{(job.processingTime / 1000).toFixed(2)}s</dd>
                </div>
              )}

              {job.errorMessage && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-slate-400">Error Message</dt>
                  <dd className="mt-1 text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{job.errorMessage}</dd>
                </div>
              )}
            </dl>
          </div>

          {(job.status === "COMPLETED" || job.status === "WAITING_FOR_REVIEW") && (
            <>
              <OCRResultCard 
                provider={job.provider}
                modelVersion={job.modelVersion}
                confidenceScore={job.confidenceScore}
                validationScore={job.validationScore}
                processingTime={job.processingTime}
              />
              
              <ConfidenceTable extractions={job.extractions} />

              {/* Technical / Raw Data Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-sm overflow-hidden mt-6">
                <div className="p-6 border-b border-slate-800 bg-slate-950/50">
                  <h3 className="text-lg font-semibold text-white">Raw Output Payload</h3>
                </div>
                <div className="p-6 space-y-6">
                  {job.rawText && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-2">Raw Text</h4>
                      <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 overflow-x-auto">
                        {job.rawText}
                      </pre>
                    </div>
                  )}
                  {job.structuredJson && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-2">Provider JSON Payload</h4>
                      <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs text-green-400 overflow-x-auto">
                        {JSON.stringify(job.structuredJson, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Timeline */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-6">Audit Log</h3>
            <div className="pl-2 pt-2">
              <AIJobTimeline logs={job.auditLogs} />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

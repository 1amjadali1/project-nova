import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DocumentStatusBadge from "@/components/documents/DocumentStatusBadge";
import Link from "next/link";
import { format } from "date-fns";
import DocumentViewer from "./DocumentViewer";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import DocumentAIControls from "@/components/documents/DocumentAIControls";
import AIStatusBadge from "@/components/ai/AIStatusBadge";

export default async function DocumentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { roles: { include: { role: true } } },
  });

  if (!user) redirect("/login");

  const isSuperAdmin = user.roles.some((ur) => ur.role.name === "Super Admin");

  const document = await prisma.document.findUnique({
    where: { id },
    include: {
      candidate: true,
      uploadedBy: true,
      verifiedBy: true,
      aiJobs: {
        orderBy: { createdAt: "desc" },
        take: 5
      }
    },
  });

  if (!document || document.isDeleted) redirect("/documents");

  if (!isSuperAdmin && document.organizationId !== user.organizationId) {
    redirect("/documents");
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link 
          href="/documents"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{document.originalFileName}</h1>
          <p className="mt-1 text-sm text-slate-400">
            Document for <Link href={`/candidates/${document.candidateId}`} className="text-cyan-400 hover:underline">{document.candidate.firstName} {document.candidate.lastName}</Link>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Document Metadata Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-white">Metadata</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Type</p>
                <p className="mt-1 text-sm font-medium text-slate-300">{document.documentType}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</p>
                <div className="mt-1">
                  <DocumentStatusBadge status={document.status} />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">File Size</p>
                <p className="mt-1 text-sm text-slate-300">{(document.fileSize / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Uploaded At</p>
                <p className="mt-1 text-sm text-slate-300">{format(document.createdAt, "PPP 'at' p")}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Uploaded By</p>
                <p className="mt-1 text-sm text-slate-300">
                  {document.uploadedBy ? `${document.uploadedBy.firstName} ${document.uploadedBy.lastName}` : "System"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-white">Notes</h3>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">
              {document.notes || <span className="italic text-slate-500">No notes provided.</span>}
            </p>
          </div>

          {/* AI Processing Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-cyan-400" />
              AI Intelligence
            </h3>
            
            <div className="mb-6">
              <DocumentAIControls documentId={document.id} />
            </div>

            {document.aiJobs.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Recent Jobs</p>
                {document.aiJobs.map(job => (
                  <Link 
                    key={job.id} 
                    href={`/ai/jobs/${job.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition group"
                  >
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-cyan-400">{job.jobType.replace(/_/g, " ")}</p>
                      <p className="text-xs text-slate-500">{format(new Date(job.createdAt), "MMM d, h:mm a")}</p>
                    </div>
                    <AIStatusBadge status={job.status} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Inline Viewer */}
        <div className="lg:col-span-2">
          <div className="h-[800px] rounded-2xl border border-slate-800 bg-slate-900 shadow-sm overflow-hidden flex flex-col">
            <div className="border-b border-slate-800 px-6 py-4 flex justify-between items-center bg-slate-950">
              <h3 className="font-semibold text-white">Preview</h3>
            </div>
            <div className="flex-1 overflow-hidden p-4 bg-slate-950/50">
               <DocumentViewer documentId={document.id} mimeType={document.mimeType} fileName={document.originalFileName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

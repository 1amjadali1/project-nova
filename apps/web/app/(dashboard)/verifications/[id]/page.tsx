import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/verifications/StatusBadge";
import PriorityBadge from "@/components/verifications/PriorityBadge";
import Link from "next/link";
import UploadZone from "@/components/documents/UploadZone";
import DocumentAIControls from "@/components/documents/DocumentAIControls";
import DocumentStatusBadge from "@/components/documents/DocumentStatusBadge";
import CaseControlPanel from "@/components/verifications/CaseControlPanel";
import CaseTimeline from "@/components/verifications/CaseTimeline";
import { getEnterpriseSession } from "@/lib/auth/session";

export default async function VerificationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const sessionData = await getEnterpriseSession();
  if (!sessionData?.user) return null;
  const profile = await prisma.employeeProfile.findUnique({
    where: { userId: sessionData.user.id },
    include: { EmployeeRoleAssignment: { include: { Role: true } } }
  });
  const myLevel = Math.max(...(profile?.EmployeeRoleAssignment.map(r => r.Role.hierarchyLevel) || [0]));

  const verification = await prisma.verificationRequest.findUnique({
    where: { id },
    include: {
      candidate: {
        include: {
          organization: true,
          documents: {
            orderBy: { createdAt: "desc" }
          },
        }
      },
      owner: {
        include: { user: true }
      }
    },
  });

  if (!verification) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          {verification.type.replace(/_/g, " ")}
        </h1>
        <p className="mt-2 text-slate-400">
          Verification Request Details - Case ID: <span className="font-mono text-xs">{verification.id}</span>
        </p>
      </div>

      <CaseControlPanel 
        requestId={verification.id} 
        currentStage={verification.currentStage} 
        status={verification.status} 
        myLevel={myLevel} 
      />

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h2 className="mb-6 text-xl font-semibold text-white">Request Information</h2>
        
        <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-sm font-medium text-slate-400">Workflow Stage</dt>
            <dd className="mt-2">
              <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-sm font-semibold text-slate-300 border border-slate-700">
                {verification.currentStage.replace(/_/g, " ")}
              </span>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-slate-400">Current Owner</dt>
            <dd className="mt-2 text-slate-200">
              {verification.owner ? `${verification.owner.user.firstName} ${verification.owner.user.lastName}` : <span className="italic text-slate-500">Unassigned</span>}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-slate-400">Status</dt>
            <dd className="mt-2">
              <StatusBadge status={verification.status} />
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-slate-400">Priority</dt>
            <dd className="mt-2">
              <PriorityBadge priority={verification.priority} />
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-slate-400">Candidate</dt>
            <dd className="mt-2">
              <Link 
                href={`/candidates/${verification.candidateId}`}
                className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                {verification.candidate.firstName} {verification.candidate.lastName}
              </Link>
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-slate-400">Organization</dt>
            <dd className="mt-2 text-slate-200">
              {verification.candidate.organization.name}
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-slate-400">Requested On</dt>
            <dd className="mt-2 text-slate-200">
              {new Date(verification.createdAt).toLocaleString()}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-slate-400">Last Updated</dt>
            <dd className="mt-2 text-slate-200">
              {new Date(verification.updatedAt).toLocaleString()}
            </dd>
          </div>
        </dl>

        <div className="mt-8 border-t border-slate-800 pt-8">
          <dt className="text-sm font-medium text-slate-400">Additional Notes</dt>
          <dd className="mt-3 rounded-xl bg-slate-950 p-4 text-slate-300">
            {verification.notes || <span className="text-slate-500 italic">No additional notes provided.</span>}
          </dd>
        </div>
      </div>

      <CaseTimeline requestId={verification.id} />

      {/* Document Workflow Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Column */}
        <div className="lg:col-span-1">
          <UploadZone candidateId={verification.candidateId} />
        </div>

        {/* Document List Column */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-slate-800 p-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Uploaded Documents</h2>
            <span className="text-sm text-slate-400">{verification.candidate.documents.length} Total</span>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950/50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Uploaded At</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {verification.candidate.documents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      No documents uploaded yet. Upload a document to start verification.
                    </td>
                  </tr>
                ) : (
                  verification.candidate.documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-300">
                        {doc.documentType}
                        <div className="text-xs text-slate-500 mt-1">{doc.originalFileName}</div>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(doc.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <DocumentStatusBadge status={doc.status} />
                      </td>
                      <td className="px-6 py-4">
                        {doc.status === "UPLOADED" ? (
                          <DocumentAIControls documentId={doc.id} />
                        ) : (
                          <div className="text-right text-xs text-slate-500">
                            {doc.status === "PROCESSING" ? "Processing..." : "Action Completed"}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

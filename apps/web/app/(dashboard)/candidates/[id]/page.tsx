import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/verifications/StatusBadge";
import UploadZone from "@/components/documents/UploadZone";
import DocumentPreviewWrapper from "@/app/(dashboard)/documents/DocumentPreviewWrapper";

export default async function CandidateDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: {
      organization: true,
      verifications: {
        orderBy: { createdAt: "desc" },
      },
      documents: {
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
      }
    },
  });

  if (!candidate) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          {candidate.firstName} {candidate.lastName}
        </h1>
        <p className="mt-2 text-slate-400">
          Candidate Details for {candidate.organization.name}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-white">Profile Information</h2>
        
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-400">Email</dt>
            <dd className="mt-1 text-slate-200">{candidate.email}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-slate-400">Phone</dt>
            <dd className="mt-1 text-slate-200">{candidate.phone || "Not provided"}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-slate-400">Status</dt>
            <dd className="mt-1">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${candidate.isActive ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'}`}>
                {candidate.isActive ? 'Active' : 'Inactive'}
              </span>
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-slate-400">Added On</dt>
            <dd className="mt-1 text-slate-200">
              {new Date(candidate.createdAt).toLocaleDateString()}
            </dd>
          </div>
        </dl>
      </div>
      
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Background Checks</h2>
          <Link
            href="/verifications"
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-cyan-400 hover:bg-slate-700"
          >
            Manage Verifications
          </Link>
        </div>
        
        {candidate.verifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 py-12">
            <svg
              className="mb-3 h-10 w-10 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="font-medium text-slate-400">No verifications requested yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-300">
                <tr>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Requested</th>
                  <th className="px-6 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                {candidate.verifications.map((ver) => (
                  <tr key={ver.id} className="transition hover:bg-slate-800/40">
                    <td className="px-6 py-4 font-medium text-white">
                      {ver.type.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ver.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {new Date(ver.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/verifications/${ver.id}`}
                        className="text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">Candidate Documents</h2>
        </div>
        
        <div className="mb-8">
          <UploadZone candidateId={candidate.id} />
        </div>

        {candidate.documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 py-12">
            <svg className="mb-3 h-10 w-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <p className="font-medium text-slate-400">No documents uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <DocumentPreviewWrapper documents={candidate.documents} />
          </div>
        )}
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/verifications/StatusBadge";
import Link from "next/link";

export default async function VerificationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const verification = await prisma.verificationRequest.findUnique({
    where: { id },
    include: {
      candidate: {
        include: {
          organization: true,
        }
      },
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
          Verification Request Details
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h2 className="mb-6 text-xl font-semibold text-white">Request Information</h2>
        
        <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-slate-400">Status</dt>
            <dd className="mt-2">
              <StatusBadge status={verification.status} />
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
    </div>
  );
}

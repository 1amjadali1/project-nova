import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/verifications/StatusBadge";

export default async function CheckDetailsPage({
  params,
}: {
  params: Promise<{ id: string; checkId: string }>;
}) {
  const { id, checkId } = await params;

  const check = await prisma.verificationCheck.findUnique({
    where: { id: checkId },
    include: {
      verificationRequest: {
        include: {
          candidate: true,
          client: true,
        }
      },
      documents: true,
      verificationResults: true,
    }
  });

  if (!check || check.verificationRequestId !== id) {
    notFound();
  }

  const { candidate, client } = check.verificationRequest;

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav className="text-sm font-medium text-slate-400 mb-6 flex items-center space-x-2">
        <Link href={`/candidates/${candidate.id}`} className="hover:text-cyan-400 transition">Candidate Profile</Link>
        <span>/</span>
        <Link href={`/verifications/${id}`} className="hover:text-cyan-400 transition">{client?.name || 'Request'}</Link>
        <span>/</span>
        <span className="text-slate-200">{check.subCategory || check.category}</span>
      </nav>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white capitalize">
              {check.subCategory || check.category.replace(/_/g, " ")}
            </h1>
            <p className="text-slate-400 mt-1">Verification Check Details</p>
          </div>
          <StatusBadge status={check.status} />
        </div>

        <div className="text-slate-400 mt-8 border-t border-slate-800 pt-8">
          <p>Detailed view for this verification module goes here.</p>
          <p className="mt-2 text-sm text-slate-500">Includes module-specific documents, AI insights, and manual review overrides.</p>
        </div>
      </div>
    </div>
  );
}

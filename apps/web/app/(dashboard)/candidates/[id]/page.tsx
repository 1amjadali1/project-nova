import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import CandidateWorkspace from "@/components/candidates/CandidateWorkspace";

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
        include: {
          client: true,
          package: true,
          checks: {
            include: {
              verificationResults: true,
              documents: true,
            }
          }
        },
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

  // Fetch Timeline and Audit Logs
  const timelineEvents = await prisma.timelineEvent.findMany({
    where: { candidateId: id },
    orderBy: { createdAt: "desc" },
  });

  const auditLogs = await prisma.systemAuditLog.findMany({
    where: { 
      entityType: "CANDIDATE",
      entityId: id,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      
      {/* Breadcrumbs */}
      <nav className="text-sm font-medium text-slate-400 mb-6 flex items-center space-x-2">
        <Link href="/candidates" className="hover:text-cyan-400 transition">Candidates</Link>
        <span>/</span>
        <span className="text-slate-200">{candidate.firstName} {candidate.lastName}</span>
      </nav>

      {/* Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50 p-8 shadow-xl flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-cyan-500 overflow-hidden ring-4 ring-slate-800/50 relative">
            {candidate.photoUrl ? (
               
              <img src={candidate.photoUrl} alt="Candidate" className="h-full w-full object-cover" />
            ) : (
              `${candidate.firstName[0]}${candidate.lastName[0]}`
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              {candidate.firstName} {candidate.lastName}
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                candidate.candidateStatus === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                'bg-slate-500/10 text-slate-400 border border-slate-500/20'
              }`}>
                {candidate.candidateStatus}
              </span>
            </h1>
            <p className="mt-1 text-slate-400 text-sm">ID: {candidate.id.split('-').pop() || candidate.id}</p>
          </div>
        </div>

        <div className="flex-1 max-w-md w-full border-l border-slate-800 pl-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Overall Progress</span>
            <span className="font-medium text-cyan-400">0%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <div>
              <div className="text-slate-500">Risk Score</div>
              <div className="font-semibold text-white">Pending</div>
            </div>
            <div>
              <div className="text-slate-500">Active Requests</div>
              <div className="font-semibold text-white">{candidate.verifications.length}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Main Workspace (Tabs) */}
      <CandidateWorkspace 
        candidate={candidate}
        timelineEvents={timelineEvents}
        auditLogs={auditLogs}
      />
      
    </div>
  );
}

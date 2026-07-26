import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, User, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import RiskBadge from "@/components/verification/RiskBadge";
import RiskGauge from "@/components/verification/RiskGauge";
import MatchTable from "@/components/verification/MatchTable";
import RecommendationCard from "@/components/verification/RecommendationCard";
import VerificationSummary from "@/components/verification/VerificationSummary";
import { format } from "date-fns";

export default async function VerificationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const result = await prisma.verificationResult.findUnique({
    where: { id },
    include: {
      candidate: true,
      document: true,
      job: true
    }
  });

  if (!result || result.organizationId !== session.user.organizationId) {
    notFound();
  }

  // Safe parse JSON 
  const matchedFields = result.matchedFields as Record<string, string>;
  const mismatchedFields = result.mismatchedFields as Record<string, { expected: string; actual: string; riskPoints: number; mustMatchFailed: boolean }>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/verification-engine"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Verification Report
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {format(new Date(result.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <RiskBadge level={result.riskLevel} />
          {result.overallStatus === "VERIFIED" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
              <CheckCircle2 className="h-4 w-4" /> Verified
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Context & Summary */}
        <div className="lg:col-span-2 space-y-6">
          {result.explanation && <VerificationSummary explanation={result.explanation} />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <User className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white">Candidate Profile</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-500">Name</div>
                  <div className="text-sm font-medium text-white">{result.candidate.firstName} {result.candidate.lastName}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Email</div>
                  <div className="text-sm font-medium text-slate-300">{result.candidate.email}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">PAN Number</div>
                  <div className="text-sm font-medium text-slate-300">{result.candidate.panNumber || "Not Provided"}</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white">Processed Document</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-500">Document Type</div>
                  <div className="text-sm font-medium text-white">{result.document.documentType}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Original File</div>
                  <div className="text-sm font-medium text-slate-300 truncate">{result.document.originalFileName}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">AI Confidence</div>
                  <div className="text-sm font-medium text-slate-300">{result.confidence.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>

          <MatchTable matchedFields={matchedFields} mismatchedFields={mismatchedFields} />
        </div>

        {/* Right Column: Risk & Recommendations */}
        <div className="space-y-6">
          <RiskGauge score={result.riskScore} />
          <RecommendationCard recommendations={result.recommendations} />
        </div>

      </div>
    </div>
  );
}

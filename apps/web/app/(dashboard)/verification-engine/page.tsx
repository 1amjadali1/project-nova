import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ShieldCheck, Search, SlidersHorizontal, Eye } from "lucide-react";
import Link from "next/link";
import RiskBadge from "@/components/verification/RiskBadge";
import { format } from "date-fns";

export default async function VerificationEnginePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const results = await prisma.verificationResult.findMany({
    where: { organizationId: session.user.organizationId },
    include: {
      candidate: true,
      document: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-cyan-400" />
            Verification Intelligence
          </h1>
          <p className="mt-2 text-slate-400">
            Monitor automated OCR verification results, risk scores, and discrepancies.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 p-4 bg-slate-950/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search candidate or document..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-sm font-medium text-slate-300 hover:bg-slate-800 transition">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-950/50 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Candidate</th>
                <th className="px-6 py-4 font-medium">Document</th>
                <th className="px-6 py-4 font-medium text-center">Score</th>
                <th className="px-6 py-4 font-medium">Risk Level</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No verification results generated yet.
                  </td>
                </tr>
              ) : (
                results.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-800/50 transition group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{res.candidate.firstName} {res.candidate.lastName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{res.candidate.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-300">{res.document.documentType}</div>
                      <div className="text-xs text-slate-500 mt-0.5 max-w-[200px] truncate">{res.document.originalFileName}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm ${
                        res.riskScore >= 70 ? "bg-red-500/10 text-red-400" :
                        res.riskScore >= 40 ? "bg-orange-500/10 text-orange-400" :
                        res.riskScore >= 15 ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-green-500/10 text-green-400"
                      }`}>
                        {res.riskScore}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <RiskBadge level={res.riskLevel} />
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {format(new Date(res.createdAt), "MMM d, h:mm a")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/verification-engine/${res.id}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                      >
                        <Eye className="h-4 w-4" /> View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

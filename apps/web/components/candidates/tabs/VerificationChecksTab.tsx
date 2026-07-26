 
import Link from "next/link";
import StatusBadge from "@/components/verifications/StatusBadge";

export default function VerificationChecksTab({ candidate }: { candidate: any }) {
  // Aggregate all checks across all requests
  const allChecks = candidate.verifications.flatMap((req: any) => 
    (req.checks || []).map((check: any) => ({
      ...check,
      requestId: req.id,
      clientName: req.client?.name || candidate.organization.name
    }))
  );

  // Group by category dynamically
  const groupedChecks = allChecks.reduce((acc: Record<string, any[]>, check: any) => {
    const cat = check.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(check);
    return acc;
  }, {});

  const categories = Object.keys(groupedChecks).sort();

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 py-16">
        <svg className="mb-4 h-12 w-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-lg font-medium text-slate-300">No verification checks found.</p>
        <p className="mt-1 text-sm text-slate-500">This candidate does not have any active verification modules.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold text-white capitalize flex items-center gap-2">
            <span className="h-6 w-1 rounded-full bg-cyan-500"></span>
            {category.replace(/_/g, " ")}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedChecks[category].map((check: any) => (
              <div key={check.id} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-sm overflow-hidden hover:border-slate-700 transition-colors">
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-slate-200">{check.subCategory || check.category}</h4>
                      <p className="text-xs text-slate-500 mt-1">For {check.clientName}</p>
                    </div>
                    <StatusBadge status={check.status} />
                  </div>
                  
                  <div className="text-sm text-slate-400 space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span>Documents:</span>
                      <span className="text-slate-300">{check.documents?.length || 0} attached</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span className="text-slate-300">{new Date(check.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-slate-800 bg-slate-950/50 p-4">
                  <Link 
                    href={`/verifications/${check.requestId}/checks/${check.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 py-2 px-4 text-sm font-medium text-cyan-400 hover:bg-slate-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

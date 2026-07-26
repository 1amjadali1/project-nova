 
export default function AIIntelligenceTab({ candidate }: { candidate: any }) {
  const allResults = candidate.verifications.flatMap((req: any) => 
    (req.checks || []).flatMap((check: any) => 
      check.verificationResults?.map((res: any) => ({
        ...res,
        checkName: check.subCategory || check.category
      })) || []
    )
  );

  if (allResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 py-16">
        <p className="text-lg font-medium text-slate-300">No AI Intelligence results found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {allResults.map((result: any) => (
        <div key={result.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
            <h4 className="text-lg font-medium text-white">AI Analysis for {result.checkName}</h4>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              result.riskLevel === 'HIGH' ? 'bg-red-500/10 text-red-400' :
              result.riskLevel === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-400' :
              'bg-green-500/10 text-green-400'
            }`}>
              {result.riskLevel} RISK ({result.riskScore})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium text-slate-500">Overall Status</div>
              <div className="mt-1 text-slate-200">{result.overallStatus}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Confidence Score</div>
              <div className="mt-1 text-slate-200">{(result.confidence * 100).toFixed(1)}%</div>
            </div>
            {result.explanation && (
              <div className="md:col-span-2">
                <div className="text-sm font-medium text-slate-500">AI Explanation</div>
                <div className="mt-1 text-slate-300 p-4 rounded-xl bg-slate-950/50">{result.explanation}</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

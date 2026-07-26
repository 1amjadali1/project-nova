import { CheckCircle2, XCircle } from "lucide-react";

interface MatchTableProps {
  matchedFields: Record<string, string>;
  mismatchedFields: Record<string, { expected: string; actual: string; riskPoints: number; mustMatchFailed: boolean }>;
}

export default function MatchTable({ matchedFields, mismatchedFields }: MatchTableProps) {
  const allFields = [
    ...Object.entries(matchedFields).map(([k, v]) => ({
      key: k,
      expected: v,
      actual: v,
      status: "MATCH",
      risk: 0
    })),
    ...Object.entries(mismatchedFields).map(([k, v]) => ({
      key: k,
      expected: v.expected,
      actual: v.actual,
      status: v.mustMatchFailed ? "CRITICAL_MISMATCH" : "MISMATCH",
      risk: v.riskPoints
    }))
  ];

  if (allFields.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
      <div className="p-6 border-b border-slate-800">
        <h3 className="text-lg font-semibold text-white">Extraction Matching</h3>
        <p className="mt-1 text-sm text-slate-400">Comparing OCR output against Candidate Profile.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-950/50 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Field</th>
              <th className="px-6 py-4 font-medium">Expected (Profile)</th>
              <th className="px-6 py-4 font-medium">Actual (OCR)</th>
              <th className="px-6 py-4 font-medium text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {allFields.map((f, i) => (
              <tr key={i} className="hover:bg-slate-800/50 transition">
                <td className="px-6 py-4 font-medium text-slate-300 capitalize">
                  {f.key.replace(/([A-Z])/g, " $1").trim()}
                </td>
                <td className="px-6 py-4 text-slate-400 font-mono">
                  {f.expected || <span className="italic opacity-50">Empty</span>}
                </td>
                <td className="px-6 py-4 font-mono">
                  <span className={f.status.includes("MISMATCH") ? "text-red-400 font-medium" : "text-slate-400"}>
                    {f.actual || <span className="italic opacity-50">Empty</span>}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                  {f.status === "MATCH" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
                      <CheckCircle2 className="h-3 w-3" /> Exact Match
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${f.status === "CRITICAL_MISMATCH" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-orange-500/10 text-orange-400"}`}>
                      <XCircle className="h-3 w-3" /> 
                      {f.status === "CRITICAL_MISMATCH" ? "Critical Mismatch" : "Mismatch"}
                      <span className="ml-1 opacity-70">(+{f.risk} pts)</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

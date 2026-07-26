import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";

export interface ExtractionRow {
  id: string;
  fieldName: string;
  fieldValue: string;
  confidence: number;
  validationError: string | null;
  isAutoVerified: boolean;
}

interface ConfidenceTableProps {
  extractions: ExtractionRow[];
}

export default function ConfidenceTable({ extractions }: ConfidenceTableProps) {
  if (!extractions || extractions.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
      <div className="p-6 border-b border-slate-800 bg-slate-950/50">
        <h3 className="text-lg font-semibold text-white">Extracted Fields & Validation</h3>
        <p className="mt-1 text-sm text-slate-400">Detailed breakdown of the OCR provider&apos;s extraction.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Field</th>
              <th className="px-6 py-4 font-medium">Extracted Value</th>
              <th className="px-6 py-4 font-medium">Confidence</th>
              <th className="px-6 py-4 font-medium">Validation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900">
            {extractions.map((ext) => (
              <tr key={ext.id} className="transition hover:bg-slate-800/50">
                <td className="px-6 py-4 font-medium text-slate-300">
                  {ext.fieldName.replace(/_/g, " ")}
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono bg-slate-950 px-2 py-1 rounded text-white border border-slate-800">
                    {ext.fieldValue}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <ConfidenceBadge score={ext.confidence} />
                </td>
                <td className="px-6 py-4">
                  {ext.validationError ? (
                    <div className="flex items-center gap-1.5 text-red-400 text-xs font-medium bg-red-500/10 px-2.5 py-1 rounded-full w-fit border border-red-500/20">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {ext.validationError}
                    </div>
                  ) : ext.isAutoVerified ? (
                    <div className="flex items-center gap-1.5 text-green-400 text-xs font-medium bg-green-500/10 px-2.5 py-1 rounded-full w-fit border border-green-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Valid
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium bg-slate-500/10 px-2.5 py-1 rounded-full w-fit border border-slate-500/20">
                      <XCircle className="h-3.5 w-3.5" />
                      Not Verified
                    </div>
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

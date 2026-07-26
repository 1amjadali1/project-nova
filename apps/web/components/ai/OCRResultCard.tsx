import { BrainCircuit, Clock, ShieldCheck, Tag } from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";

interface OCRResultCardProps {
  provider: string | null;
  modelVersion: string | null;
  confidenceScore: number | null;
  validationScore: number | null;
  processingTime: number | null;
}

export default function OCRResultCard({ 
  provider, 
  modelVersion, 
  confidenceScore, 
  validationScore, 
  processingTime 
}: OCRResultCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <BrainCircuit className="h-5 w-5 text-cyan-400" />
        AI Engine Results
      </h3>
      
      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-slate-400 flex items-center gap-1.5 mb-1">
            <Tag className="h-4 w-4" /> Provider
          </dt>
          <dd className="text-white font-medium">
            {provider ? provider.replace(/_/g, " ") : "Unknown"}
            {modelVersion && <span className="ml-2 text-xs text-slate-500">v{modelVersion}</span>}
          </dd>
        </div>
        
        <div>
          <dt className="text-sm font-medium text-slate-400 flex items-center gap-1.5 mb-1">
            <Clock className="h-4 w-4" /> Processing Time
          </dt>
          <dd className="text-slate-300">
            {processingTime ? `${(processingTime / 1000).toFixed(2)}s` : "-"}
          </dd>
        </div>
        
        <div>
          <dt className="text-sm font-medium text-slate-400 mb-1">Overall Confidence</dt>
          <dd>
            {confidenceScore ? <ConfidenceBadge score={confidenceScore} /> : <span className="text-slate-600">-</span>}
          </dd>
        </div>
        
        <div>
          <dt className="text-sm font-medium text-slate-400 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="h-4 w-4" /> Validation Score
          </dt>
          <dd>
            {validationScore !== null ? (
              <span className={`font-semibold ${validationScore === 100 ? "text-green-400" : "text-orange-400"}`}>
                {validationScore.toFixed(0)}%
              </span>
            ) : <span className="text-slate-600">-</span>}
          </dd>
        </div>
      </dl>
    </div>
  );
}

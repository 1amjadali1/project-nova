import { CheckCircle2, ChevronRight } from "lucide-react";

interface RecommendationCardProps {
  recommendations: string[];
}

export default function RecommendationCard({ recommendations }: RecommendationCardProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recommended Actions</h3>
      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950/50 hover:border-cyan-500/30 transition">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-cyan-400" />
              <span className="text-sm font-medium text-slate-200">{rec}</span>
            </div>
            <button className="text-slate-500 hover:text-white transition">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ConfidenceBadgeProps {
  score: number | null | undefined;
}

export default function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  if (score === null || score === undefined) return null;

  let colorClass = "bg-slate-500/10 text-slate-400 ring-slate-500/20";
  
  if (score >= 90) {
    colorClass = "bg-green-500/10 text-green-400 ring-green-500/20";
  } else if (score >= 70) {
    colorClass = "bg-orange-500/10 text-orange-400 ring-orange-500/20";
  } else {
    colorClass = "bg-red-500/10 text-red-400 ring-red-500/20";
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${colorClass}`}>
      {score.toFixed(1)}% Confidence
    </span>
  );
}

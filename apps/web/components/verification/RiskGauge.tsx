interface RiskGaugeProps {
  score: number;
}

export default function RiskGauge({ score }: RiskGaugeProps) {
  // 0-100 scale.
  const capped = Math.min(Math.max(score, 0), 100);
  
  let color = "text-green-400";
  let stroke = "stroke-green-400";
  
  if (capped >= 70) {
    color = "text-red-400";
    stroke = "stroke-red-400";
  } else if (capped >= 40) {
    color = "text-orange-400";
    stroke = "stroke-orange-400";
  } else if (capped >= 15) {
    color = "text-yellow-400";
    stroke = "stroke-yellow-400";
  }

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (capped / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-800 bg-slate-900">
      <h3 className="absolute top-4 left-6 text-sm font-medium text-slate-400">Risk Score</h3>
      
      <div className="relative mt-4">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-800"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ease-out ${stroke}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className={`text-3xl font-bold ${color}`}>{capped}</span>
          <span className="text-xs text-slate-500 mt-1">/ 100</span>
        </div>
      </div>
    </div>
  );
}

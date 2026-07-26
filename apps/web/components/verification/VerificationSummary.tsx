import { Bot } from "lucide-react";

interface VerificationSummaryProps {
  explanation: string;
}

export default function VerificationSummary({ explanation }: VerificationSummaryProps) {
  return (
    <div className="rounded-2xl border border-cyan-900/30 bg-cyan-950/10 p-6 shadow-sm">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-cyan-400">AI Explanation</h3>
          <p className="mt-1 text-sm text-slate-300 leading-relaxed">
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
}

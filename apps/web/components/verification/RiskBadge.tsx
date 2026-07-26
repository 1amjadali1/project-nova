import { ShieldAlert, ShieldCheck, Shield, AlertTriangle } from "lucide-react";

interface RiskBadgeProps {
  level: string;
}

export default function RiskBadge({ level }: RiskBadgeProps) {
  const norm = level.toUpperCase();
  
  if (norm === "LOW") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
        <ShieldCheck className="h-4 w-4" />
        Low Risk
      </span>
    );
  }
  
  if (norm === "MEDIUM") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-400 ring-1 ring-inset ring-yellow-500/20">
        <Shield className="h-4 w-4" />
        Medium Risk
      </span>
    );
  }
  
  if (norm === "HIGH") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-400 ring-1 ring-inset ring-orange-500/20">
        <AlertTriangle className="h-4 w-4" />
        High Risk
      </span>
    );
  }
  
  if (norm === "CRITICAL") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400 ring-1 ring-inset ring-red-500/20 animate-pulse">
        <ShieldAlert className="h-4 w-4" />
        Critical Risk
      </span>
    );
  }

  return null;
}

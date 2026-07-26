"use client";

import { useState } from "react";
import { toggleProviderStatus, updateProviderPriority } from "@/app/actions/ai-providers";
import { Power, ArrowUp, ArrowDown } from "lucide-react";

interface ProviderControlsProps {
  providerId: string;
  enabled: boolean;
  priority: number;
  isAdmin: boolean;
}

export default function ProviderControls({ providerId, enabled, priority, isAdmin }: ProviderControlsProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isAdmin) return null;

  const handleToggle = async () => {
    setIsProcessing(true);
    try {
      await toggleProviderStatus(providerId, !enabled);
    } catch {
      alert("Failed to toggle provider");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePriority = async (increment: number) => {
    setIsProcessing(true);
    try {
      await updateProviderPriority(providerId, priority + increment);
    } catch {
      alert("Failed to update priority");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col gap-1 mr-2 bg-slate-900 border border-slate-700 rounded-md p-1">
        <button
          disabled={isProcessing}
          onClick={() => handlePriority(1)}
          className="text-slate-400 hover:text-cyan-400 transition disabled:opacity-50"
          title="Increase Priority"
        >
          <ArrowUp className="h-3 w-3" />
        </button>
        <span className="text-xs text-center text-white font-mono">{priority}</span>
        <button
          disabled={isProcessing}
          onClick={() => handlePriority(-1)}
          className="text-slate-400 hover:text-cyan-400 transition disabled:opacity-50"
          title="Decrease Priority"
        >
          <ArrowDown className="h-3 w-3" />
        </button>
      </div>

      <button
        disabled={isProcessing}
        onClick={handleToggle}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50 ${
          enabled 
            ? "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            : "bg-green-600/10 text-green-400 border border-green-500/20 hover:bg-green-600/20"
        }`}
      >
        <Power className="h-4 w-4" />
        {enabled ? "Disable" : "Enable"}
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { createSimulatedAIJob } from "@/app/actions/ai";
import { BrainCircuit } from "lucide-react";
import { useRouter } from "next/navigation";

interface DocumentAIControlsProps {
  documentId: string;
}

export default function DocumentAIControls({ documentId }: DocumentAIControlsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleSimulate = async () => {
    setIsProcessing(true);
    try {
      await createSimulatedAIJob(documentId, "OCR");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to create AI Job");
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleSimulate}
      disabled={isProcessing}
      className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-600/10 border border-cyan-500/20 px-4 py-3 text-sm font-medium text-cyan-400 hover:bg-cyan-600/20 transition disabled:opacity-50"
    >
      <BrainCircuit className={`h-4 w-4 ${isProcessing ? "animate-pulse" : ""}`} />
      {isProcessing ? "Queueing..." : "Start AI Processing"}
    </button>
  );
}

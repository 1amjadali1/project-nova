"use client";

import { useTransition, useState, useEffect } from "react";
import { deleteCandidate } from "@/app/actions/candidate";

type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
};

type Props = {
  onClose: () => void;
  candidate: Candidate;
};

export default function DeleteCandidateModal({
  onClose,
  candidate,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  function handleDelete() {
    setToastMessage(null);

    startTransition(async () => {
      try {
        await deleteCandidate(candidate.id);
        setToastMessage({ type: 'success', text: "✅ Candidate deleted successfully." });
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) {
        console.error(error);
        setToastMessage({ type: 'error', text: "❌ Failed to delete candidate." });
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
        
        {toastMessage && (
          <div 
            role="alert"
            aria-live="polite"
            className={`absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium shadow-lg transition-all ${toastMessage.type === 'success' ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/50' : 'bg-red-500/20 text-red-400 ring-1 ring-red-500/50'}`}
          >
            {toastMessage.type === 'success' ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            )}
            {toastMessage.text}
          </div>
        )}

        <h2 className="mb-4 text-2xl font-bold text-red-500">
          Delete Candidate
        </h2>

        <p className="mb-8 text-slate-300">
          Are you sure you want to delete <strong className="text-white">{candidate.firstName} {candidate.lastName}</strong>? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={pending}
            className="rounded-xl border border-slate-700 px-5 py-3 hover:bg-slate-800 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={pending}
            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-500 disabled:opacity-50"
          >
            {pending ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

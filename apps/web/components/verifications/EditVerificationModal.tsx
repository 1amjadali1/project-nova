"use client";

import { updateVerification } from "@/app/actions/verification";
import { useState, useTransition } from "react";

type Verification = {
  id: string;
  type: string;
  status: string;
  notes: string | null;
};

type Props = {
  verification: Verification;
  onClose: () => void;
};

export default function EditVerificationModal({ verification, onClose }: Props) {
  const [pending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [status, setStatus] = useState(verification.status);
  const [notes, setNotes] = useState(verification.notes || "");

  function handleSubmit(formData: FormData) {
    setToastMessage(null);

    startTransition(async () => {
      try {
        await updateVerification(verification.id, formData);
        setToastMessage({ type: 'success', text: "Verification updated successfully." });
        setTimeout(() => onClose(), 2000);
      } catch (error) {
        console.error(error);
        setToastMessage({ type: 'error', text: "Failed to update verification." });
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
        
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

        <h2 className="mb-6 text-2xl font-bold text-white">
          Edit Verification ({verification.type})
        </h2>

        <form action={handleSubmit}>
          <div className="grid gap-5">
            <div>
              <label htmlFor="edit-status" className="mb-2 block text-sm font-medium text-slate-300">Status *</label>
              <select
                id="edit-status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
                aria-required="true"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            <div>
              <label htmlFor="edit-notes" className="mb-2 block text-sm font-medium text-slate-300">Notes</label>
              <textarea
                id="edit-notes"
                name="notes"
                placeholder="Add any internal notes..."
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="rounded-xl border border-slate-700 px-6 py-3 hover:bg-slate-800 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={pending}
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
            >
              {pending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

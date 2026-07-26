"use client";

import { createVerification } from "@/app/actions/verification";
import { useRef, useState, useTransition } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type Props = {
  candidates: { id: string; firstName: string; lastName: string }[];
};

export default function NewVerificationForm({ candidates }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const [pending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  function handleSubmit(formData: FormData) {
    setToastMessage(null);

    startTransition(async () => {
      try {
        await createVerification(formData);
        formRef.current?.reset();
        setToastMessage({ type: 'success', text: "Verification requested successfully." });
        setTimeout(() => setToastMessage(null), 3000);
      } catch (error) {
        if (isRedirectError(error)) {
          throw error;
        }
        console.error(error);
        setToastMessage({ type: 'error', text: "Failed to request verification." });
      }
    });
  }

  return (
    <div className="relative">
      {toastMessage && (
        <div 
          role="alert"
          aria-live="polite"
          className={`absolute right-4 top-4 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium shadow-lg transition-all ${toastMessage.type === 'success' ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/50' : 'bg-red-500/20 text-red-400 ring-1 ring-red-500/50'}`}
        >
          {toastMessage.type === 'success' ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          )}
          {toastMessage.text}
        </div>
      )}

      <form
        ref={formRef}
        action={handleSubmit}
        className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
      >
        <h2 className="mb-6 text-2xl font-bold text-white">
          New Verification Request
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="new-candidate" className="mb-2 block text-sm font-medium text-slate-300">Candidate *</label>
            <select
              id="new-candidate"
              name="candidateId"
              defaultValue=""
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
              aria-required="true"
            >
              <option value="" disabled>Select a Candidate</option>
              {candidates.map(candidate => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.firstName} {candidate.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="new-type" className="mb-2 block text-sm font-medium text-slate-300">Verification Type *</label>
            <select
              id="new-type"
              name="type"
              defaultValue=""
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
              aria-required="true"
            >
              <option value="" disabled>Select Type</option>
              <option value="CRIMINAL_RECORD">Criminal Record Check</option>
              <option value="EMPLOYMENT">Employment Verification</option>
              <option value="EDUCATION">Education Verification</option>
              <option value="REFERENCE">Reference Check</option>
              <option value="IDENTITY">Identity Verification</option>
            </select>
          </div>

          <div>
            <label htmlFor="new-priority" className="mb-2 block text-sm font-medium text-slate-300">Priority *</label>
            <select
              id="new-priority"
              name="priority"
              defaultValue="NORMAL"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
              aria-required="true"
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal (Default)</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="new-notes" className="mb-2 block text-sm font-medium text-slate-300">Additional Notes</label>
            <textarea
              id="new-notes"
              name="notes"
              placeholder="Any specific instructions for this check..."
              rows={3}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
        >
          {pending ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}

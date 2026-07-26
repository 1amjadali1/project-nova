/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createCandidate } from "@/app/actions/candidate";
import { useRef, useState, useTransition } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type Props = {
  organizations: { id: string; name: string }[];
};

export default function NewCandidateForm({ organizations }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const [pending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  function handleSubmit(formData: FormData) {
    setToastMessage(null);

    startTransition(async () => {
      try {
        await createCandidate(formData);
        formRef.current?.reset();
        setToastMessage({ type: 'success', text: "Candidate created successfully." });
        setTimeout(() => setToastMessage(null), 3000);
      } catch (error) {
        if (isRedirectError(error)) {
          throw error;
        }
        console.error(error);
        setToastMessage({ type: 'error', text: "Failed to create candidate." });
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
          Add Candidate
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="new-firstName" className="mb-2 block text-sm font-medium text-slate-300">First Name *</label>
            <input
              id="new-firstName"
              name="firstName"
              placeholder="Jane"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="new-lastName" className="mb-2 block text-sm font-medium text-slate-300">Last Name *</label>
            <input
              id="new-lastName"
              name="lastName"
              placeholder="Doe"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="new-email" className="mb-2 block text-sm font-medium text-slate-300">Email Address *</label>
            <input
              id="new-email"
              name="email"
              type="email"
              placeholder="jane@example.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="new-phone" className="mb-2 block text-sm font-medium text-slate-300">Phone Number</label>
            <input
              id="new-phone"
              name="phone"
              type="tel"
              placeholder="+1 555 123 4567"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="new-organization" className="mb-2 block text-sm font-medium text-slate-300">Organization *</label>
            <select
              id="new-organization"
              name="organizationId"
              defaultValue=""
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
              aria-required="true"
            >
              <option value="" disabled>Select an Organization</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Candidate"}
        </button>
      </form>
    </div>
  );
}

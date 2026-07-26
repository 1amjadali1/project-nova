"use client";

import { createOrganization } from "@/app/actions/organization";
import { useRef, useState, useTransition } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default function NewOrganizationForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [pending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  function handleSubmit(formData: FormData) {
    setToastMessage(null);

    startTransition(async () => {
      try {
        await createOrganization(formData);
        formRef.current?.reset();
        setToastMessage({ type: 'success', text: "Organization created successfully." });
        setTimeout(() => setToastMessage(null), 3000);
      } catch (error) {
        if (isRedirectError(error)) {
          throw error;
        }
        console.error(error);
        setToastMessage({ type: 'error', text: "Failed to create organization." });
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
          Create Organization
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="new-name" className="mb-2 block text-sm font-medium text-slate-300">Organization Name *</label>
            <input
              id="new-name"
              name="name"
              placeholder="Acme Corp"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="new-slug" className="mb-2 block text-sm font-medium text-slate-300">Slug *</label>
            <input
              id="new-slug"
              name="slug"
              placeholder="acme-corp"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="new-email" className="mb-2 block text-sm font-medium text-slate-300">Email Address</label>
            <input
              id="new-email"
              name="email"
              type="email"
              placeholder="contact@acme.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
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
            <label htmlFor="new-website" className="mb-2 block text-sm font-medium text-slate-300">Website URL</label>
            <input
              id="new-website"
              name="website"
              type="url"
              placeholder="https://acme.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Organization"}
        </button>
      </form>
    </div>
  );
}

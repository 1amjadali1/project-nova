"use client";

import { updateCandidate } from "@/app/actions/candidate";
import { useState, useTransition } from "react";

type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  organizationId: string;
};

type Props = {
  candidate: Candidate;
  organizations: { id: string; name: string }[];
  onClose: () => void;
};

export default function EditCandidateModal({ candidate, organizations, onClose }: Props) {
  const [pending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [firstName, setFirstName] = useState(candidate.firstName);
  const [lastName, setLastName] = useState(candidate.lastName);
  const [email, setEmail] = useState(candidate.email);
  const [phone, setPhone] = useState(candidate.phone || "");
  const [organizationId, setOrganizationId] = useState(candidate.organizationId);

  function handleSubmit(formData: FormData) {
    setToastMessage(null);

    startTransition(async () => {
      try {
        await updateCandidate(candidate.id, formData);
        setToastMessage({ type: 'success', text: "Candidate updated successfully." });
        setTimeout(() => onClose(), 2000);
      } catch (error) {
        console.error(error);
        setToastMessage({ type: 'error', text: "Failed to update candidate." });
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
          Edit Candidate
        </h2>

        <form action={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="edit-firstName" className="mb-2 block text-sm font-medium text-slate-300">First Name *</label>
              <input
                id="edit-firstName"
                name="firstName"
                placeholder="Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
                aria-required="true"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="edit-lastName" className="mb-2 block text-sm font-medium text-slate-300">Last Name *</label>
              <input
                id="edit-lastName"
                name="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
                aria-required="true"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="edit-email" className="mb-2 block text-sm font-medium text-slate-300">Email Address *</label>
              <input
                id="edit-email"
                type="email"
                name="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
                aria-required="true"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="edit-phone" className="mb-2 block text-sm font-medium text-slate-300">Phone Number</label>
              <input
                id="edit-phone"
                type="tel"
                name="phone"
                placeholder="+1 555 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="edit-organization" className="mb-2 block text-sm font-medium text-slate-300">Organization *</label>
              <select
                id="edit-organization"
                name="organizationId"
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
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

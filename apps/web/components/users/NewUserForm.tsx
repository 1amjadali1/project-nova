"use client";

import { createUser } from "@/app/actions/user";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Role = {
  id: string;
  name: string;
};

type Organization = {
  id: string;
  name: string;
};

type Props = {
  roles: Role[];
  organizations: Organization[];
};

export default function NewUserForm({ roles, organizations }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const [pending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  function handleSubmit(formData: FormData) {
    setToastMessage(null);

    startTransition(async () => {
      try {
        await createUser(formData);
        formRef.current?.reset();
        setToastMessage({ type: 'success', text: "User created successfully." });
        setTimeout(() => {
          router.push("/users");
        }, 1500);
      } catch (error: any) {
        console.error(error);
        setToastMessage({ type: 'error', text: error.message || "Failed to create user." });
      }
    });
  }

  return (
    <div className="relative">
      {toastMessage && (
        <div 
          role="alert"
          aria-live="polite"
          className={`absolute right-4 -top-12 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium shadow-lg transition-all ${toastMessage.type === 'success' ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/50' : 'bg-red-500/20 text-red-400 ring-1 ring-red-500/50'}`}
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
        className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
      >
        <h2 className="mb-6 text-2xl font-bold text-white">
          Create New User
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="new-firstName" className="mb-2 block text-sm font-medium text-slate-300">First Name *</label>
            <input
              id="new-firstName"
              name="firstName"
              type="text"
              placeholder="e.g. John"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label htmlFor="new-lastName" className="mb-2 block text-sm font-medium text-slate-300">Last Name *</label>
            <input
              id="new-lastName"
              name="lastName"
              type="text"
              placeholder="e.g. Doe"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="new-email" className="mb-2 block text-sm font-medium text-slate-300">Email Address *</label>
            <input
              id="new-email"
              name="email"
              type="email"
              placeholder="e.g. john@example.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-slate-300">Temporary Password *</label>
            <input
              id="new-password"
              name="password"
              type="password"
              placeholder="Enter a secure temporary password"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label htmlFor="new-organizationId" className="mb-2 block text-sm font-medium text-slate-300">Organization *</label>
            <select
              id="new-organizationId"
              name="organizationId"
              defaultValue=""
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            >
              <option value="" disabled>Select Organization</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="new-roleId" className="mb-2 block text-sm font-medium text-slate-300">Primary Role *</label>
            <select
              id="new-roleId"
              name="roleId"
              defaultValue=""
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            >
              <option value="" disabled>Select Role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={pending}
            className="rounded-xl border border-slate-700 px-6 py-3 font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
          >
            {pending ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}

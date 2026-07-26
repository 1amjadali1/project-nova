"use client";

import { updateUser } from "@/app/actions/user";
import { useState, useTransition } from "react";

type Role = {
  id: string;
  name: string;
};

type Props = {
  onClose: () => void;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: { role: Role }[];
  };
  roles: Role[];
};

export default function EditUserModal({ onClose, user, roles }: Props) {
  const [pending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const primaryRoleId = user.roles[0]?.role.id || "";

  function handleSubmit(formData: FormData) {
    setToastMessage(null);

    startTransition(async () => {
      try {
        await updateUser(user.id, formData);
        setToastMessage({ type: 'success', text: "User updated successfully." });
        setTimeout(() => onClose(), 2000);
      } catch (error) {
        console.error(error);
        setToastMessage({ type: 'error', text: "Failed to update user." });
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl my-8">
        
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
          Edit User
        </h2>

        <form action={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="edit-firstName" className="mb-2 block text-sm font-medium text-slate-300">First Name *</label>
              <input
                id="edit-firstName"
                name="firstName"
                type="text"
                defaultValue={user.firstName}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label htmlFor="edit-lastName" className="mb-2 block text-sm font-medium text-slate-300">Last Name *</label>
              <input
                id="edit-lastName"
                name="lastName"
                type="text"
                defaultValue={user.lastName}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="edit-email" className="mb-2 block text-sm font-medium text-slate-300">Email Address *</label>
              <input
                id="edit-email"
                name="email"
                type="email"
                defaultValue={user.email}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="edit-roleId" className="mb-2 block text-sm font-medium text-slate-300">Primary Role *</label>
              <select
                id="edit-roleId"
                name="roleId"
                defaultValue={primaryRoleId}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              >
                <option value="" disabled>Select a Role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
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

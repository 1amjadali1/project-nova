"use client";

import { useTransition, useState, useEffect } from "react";
import { deleteOrganization } from "@/app/actions/organization";

type Organization = {
  id: string;
  name: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  organization: Organization;
};

export default function DeleteOrganizationModal({
  open,
  onClose,
  organization,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!open) {
      setToastMessage(null);
    }
  }, [open]);

  if (!open) return null;

  function handleDelete() {
    setToastMessage(null);

    startTransition(async () => {
      try {
        await deleteOrganization(organization.id);
        setToastMessage({ type: 'success', text: "✅ Organization deleted successfully." });
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) {
        console.error(error);
        setToastMessage({ type: 'error', text: "❌ Failed to delete organization." });
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 p-8">
        
        {toastMessage && (
          <div className={`absolute left-1/2 top-4 -translate-x-1/2 rounded-lg px-4 py-2 text-sm font-medium ${toastMessage.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {toastMessage.text}
          </div>
        )}

        <h2 className="mb-4 text-2xl font-bold text-red-500">
          Delete Organization
        </h2>

        <p className="mb-8 text-slate-300">
          Are you sure you want to delete <strong className="text-white">{organization.name}</strong>? This action cannot be undone.
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

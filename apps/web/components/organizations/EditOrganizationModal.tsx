"use client";

import { useEffect, useState, useTransition } from "react";
import { updateOrganization } from "@/app/actions/organization";

type Organization = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  website?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  organization: Organization;
};

export default function EditOrganizationModal({
  open,
  onClose,
  organization,
}: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  const [pending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (organization) {
      setName(organization.name);
      setSlug(organization.slug);
      setEmail(organization.email ?? "");
      setPhone(organization.phone ?? "");
      setWebsite(organization.website ?? "");
    }
  }, [organization]);

  useEffect(() => {
    if (!open) {
      setToastMessage(null);
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit(formData: FormData) {
    setToastMessage(null);
    
    if (!name.trim() || !slug.trim()) {
      setToastMessage({ type: 'error', text: "❌ Organization name and slug are required." });
      return;
    }

    startTransition(async () => {
      try {
        await updateOrganization(organization.id, formData);
        setToastMessage({ type: 'success', text: "✅ Organization updated successfully." });
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) {
        console.error(error);
        setToastMessage({ type: 'error', text: "❌ Failed to update organization." });
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 p-8">
        
        {toastMessage && (
          <div className={`absolute left-1/2 top-4 -translate-x-1/2 rounded-lg px-4 py-2 text-sm font-medium ${toastMessage.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {toastMessage.text}
          </div>
        )}

        <h2 className="mb-6 text-2xl font-bold">
          Edit Organization
        </h2>

        <form action={handleSubmit}>
          <div className="grid gap-4">
            <input
              name="name"
              placeholder="Organization Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 p-3"
              required
            />

            <input
              name="slug"
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 p-3"
              required
            />

            <input
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 p-3"
            />

            <input
              name="phone"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 p-3"
            />

            <input
              name="website"
              placeholder="Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 p-3"
            />
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="rounded-xl border border-slate-700 px-5 py-3 hover:bg-slate-800 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={pending}
              className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
            >
              {pending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

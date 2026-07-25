"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (organization) {
      setName(organization.name);
      setSlug(organization.slug);
      setEmail(organization.email ?? "");
      setPhone(organization.phone ?? "");
      setWebsite(organization.website ?? "");
    }
  }, [organization]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 p-8">

        <h2 className="mb-6 text-2xl font-bold">
          Edit Organization
        </h2>

        <div className="grid gap-4">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 p-3"
          />

          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 p-3"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 p-3"
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 p-3"
          />

          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 p-3"
          />

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 px-5 py-3"
          >
            Cancel
          </button>

          <button
            className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>
  );
}

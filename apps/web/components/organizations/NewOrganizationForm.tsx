"use client";

import { createOrganization } from "@/app/actions/organization";
import { useRef, useState, useTransition } from "react";

export default function NewOrganizationForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function handleSubmit(formData: FormData) {
    setMessage("");

    startTransition(async () => {
      try {
        await createOrganization(formData);

        formRef.current?.reset();

        setMessage("✅ Organization created successfully.");
      } catch (error) {
        console.error(error);
        setMessage("❌ Failed to create organization.");
      }
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
    >
      <h2 className="mb-6 text-2xl font-bold">
        Create Organization
      </h2>

      <div className="grid gap-5 md:grid-cols-2">

        <input
          name="name"
          placeholder="Organization Name"
          className="rounded-lg border border-slate-700 bg-slate-950 p-3"
          required
        />

        <input
          name="slug"
          placeholder="Slug"
          className="rounded-lg border border-slate-700 bg-slate-950 p-3"
          required
        />

        <input
          name="email"
          placeholder="Email"
          className="rounded-lg border border-slate-700 bg-slate-950 p-3"
        />

        <input
          name="phone"
          placeholder="Phone"
          className="rounded-lg border border-slate-700 bg-slate-950 p-3"
        />

        <input
          name="website"
          placeholder="Website"
          className="rounded-lg border border-slate-700 bg-slate-950 p-3 md:col-span-2"
        />

      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Organization"}
      </button>

      {message && (
        <p className="mt-4 text-sm text-cyan-400">
          {message}
        </p>
      )}
    </form>
  );
}

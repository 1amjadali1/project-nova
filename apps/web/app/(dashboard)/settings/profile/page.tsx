"use client";

import { useState } from "react";
import { useSession, updateUser } from "@/lib/auth/client";
import Image from "next/image";

export default function ProfileSettingsPage() {
  const { data, isPending } = useSession();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [prevUserId, setPrevUserId] = useState(data?.user?.id);
  if (data?.user?.id !== prevUserId) {
    setPrevUserId(data?.user?.id);
    if (data?.user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = data.user as any;
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const { error } = await updateUser({
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      phone,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    if (error) {
      setStatus({ type: "error", message: error.message || "Failed to update profile." });
    } else {
      setStatus({ type: "success", message: "Profile updated successfully." });
    }
    
    setIsSubmitting(false);
  };

  if (isPending) {
    return <div className="text-slate-400">Loading profile...</div>;
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-white">Public Profile</h2>

      {status && (
        <div
          role="alert"
          className={`mb-6 rounded-xl p-4 text-sm font-medium ${
            status.type === "success"
              ? "bg-green-500/10 text-green-400 ring-1 ring-inset ring-green-500/20"
              : "bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20"
          }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        
        <div className="flex items-center gap-6 mb-8">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
            {data?.user?.image ? (
              <div className="relative h-full w-full">
                <Image 
                  src={data.user.image} 
                  alt="Profile" 
                  fill
                  unoptimized
                  className="object-cover" 
                />
              </div>
            ) : (
              <span className="text-2xl font-semibold text-slate-500">
                {firstName?.charAt(0)}{lastName?.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <button type="button" className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:bg-slate-700">
              Change Photo
            </button>
            <p className="mt-2 text-xs text-slate-500">JPG, GIF or PNG. Max size of 800K</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-slate-300">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-slate-300">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={data?.user?.email || ""}
            disabled
            className="w-full rounded-lg border border-slate-800 bg-slate-900 p-3 text-slate-500 cursor-not-allowed"
          />
          <p className="mt-2 text-xs text-slate-500">Email address cannot be changed.</p>
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-300">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label htmlFor="org" className="mb-2 block text-sm font-medium text-slate-300">
            Organization ID
          </label>
          <input
            id="org"
            type="text"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value={(data?.user as any)?.organizationId || ""}
            disabled
            className="w-full rounded-lg border border-slate-800 bg-slate-900 p-3 text-slate-500 cursor-not-allowed font-mono text-sm"
          />
          <p className="mt-2 text-xs text-slate-500">Contact support to change your organization.</p>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

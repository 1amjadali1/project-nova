"use client";

import { useState } from "react";
import { useSession, changePassword, sendVerificationEmail } from "@/lib/auth/client";

export default function SecuritySettingsPage() {
  const { data, isPending } = useSession();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 8) {
      setStatus({ type: "error", message: "Password must be at least 8 characters." });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    const { error } = await changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      setStatus({ type: "error", message: error.message || "Failed to change password." });
    } else {
      setStatus({ type: "success", message: "Password successfully changed. Other sessions have been revoked." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    
    setIsSubmitting(false);
  };

  const handleSendVerification = async () => {
    setIsVerifying(true);
    setVerificationStatus(null);
    
    if (!data?.user?.email) return;

    const { error } = await sendVerificationEmail({
      email: data.user.email,
    });

    if (error) {
      setVerificationStatus({ type: "error", message: error.message || "Failed to send verification email." });
    } else {
      setVerificationStatus({ type: "success", message: "Verification email sent! Check your inbox." });
    }

    setIsVerifying(false);
  };

  if (isPending) return <div className="text-slate-400">Loading security settings...</div>;

  const isEmailVerified = data?.user?.emailVerified;

  return (
    <div className="space-y-12">
      <section>
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Email Verification</h2>
            <p className="mt-1 text-sm text-slate-400">Verify your email to secure your account</p>
          </div>
          <div>
            {isEmailVerified ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Not Verified
              </span>
            )}
          </div>
        </div>

        {!isEmailVerified && (
          <div className="max-w-xl">
            {verificationStatus && (
              <div role="alert" className={`mb-4 rounded-xl p-3 text-sm font-medium ${verificationStatus.type === "success" ? "bg-green-500/10 text-green-400 ring-1 ring-green-500/20" : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"}`}>
                {verificationStatus.message}
              </div>
            )}
            <p className="mb-4 text-sm text-slate-300">Your email address <strong className="text-white">{data?.user?.email}</strong> is not verified. Please verify it to ensure you can recover your account.</p>
            <button
              onClick={handleSendVerification}
              disabled={isVerifying}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
            >
              {isVerifying ? "Sending..." : "Resend Verification Email"}
            </button>
          </div>
        )}
      </section>

      <section>
        <div className="mb-6 border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-bold text-white">Change Password</h2>
          <p className="mt-1 text-sm text-slate-400">Ensure your account is using a long, random password to stay secure.</p>
        </div>

        {status && (
          <div role="alert" className={`mb-6 max-w-xl rounded-xl p-4 text-sm font-medium ${status.type === "success" ? "bg-green-500/10 text-green-400 ring-1 ring-inset ring-green-500/20" : "bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20"}`}>
            {status.message}
          </div>
        )}

        <div className="flex flex-col gap-8 md:flex-row">
          <form onSubmit={handlePasswordSubmit} className="flex-1 space-y-5 max-w-xl">
            <div>
              <label htmlFor="currentPassword" className="mb-2 block text-sm font-medium text-slate-300">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="mb-2 block text-sm font-medium text-slate-300">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                minLength={8}
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-300">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                minLength={8}
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
              >
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>

          <div className="w-full md:w-64 shrink-0 rounded-2xl bg-slate-950 p-5 ring-1 ring-inset ring-slate-800 h-fit">
            <h3 className="font-semibold text-slate-300">Password Requirements</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Minimum 8 characters
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Should not be a common password
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

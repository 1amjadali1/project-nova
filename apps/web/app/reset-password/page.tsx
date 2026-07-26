"use client";

import { useState, Suspense } from "react";
import { resetPassword } from "@/lib/auth/client";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    if (!token) {
      setStatus({ type: "error", message: "Invalid or missing reset token." });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    const { error } = await resetPassword({
      newPassword: password,
      token,
    });

    if (error) {
      setStatus({ type: "error", message: error.message || "Failed to reset password." });
      setIsSubmitting(false);
    } else {
      setStatus({ type: "success", message: "Password has been successfully reset. Redirecting..." });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  if (!token) {
    return (
      <div className="rounded-xl bg-red-500/10 p-4 text-center text-red-400 ring-1 ring-inset ring-red-500/20">
        <p className="font-medium">Invalid Request</p>
        <p className="text-sm">No reset token found in the URL. Please request a new password reset link.</p>
      </div>
    );
  }

  return (
    <>
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-slate-300">
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            placeholder="Enter new password"
            minLength={8}
            required
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-slate-300">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            placeholder="Confirm new password"
            minLength={8}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="mt-2 text-slate-400">
            Enter a new password for your account
          </p>
        </div>

        <Suspense fallback={<div className="text-center text-slate-400">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

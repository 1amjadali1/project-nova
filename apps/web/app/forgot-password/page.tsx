"use client";

import { useState } from "react";
import { forgetPassword } from "@/lib/auth/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const { error } = await forgetPassword({
      email,
      redirectTo: "/reset-password",
    });

    if (error) {
      setStatus({ type: "error", message: error.message || "Failed to send reset email." });
    } else {
      setStatus({ type: "success", message: "If an account exists, a password reset link has been sent to your email." });
      setEmail("");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Forgot Password</h1>
          <p className="mt-2 text-slate-400">
            Enter your email to receive a reset link
          </p>
        </div>

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
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              placeholder="name@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Remembered your password?{" "}
          <Link href="/login" className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginWrapperAction, logFailedLoginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const { data, error } = await signIn.email({
      email,
      password,
      rememberMe,
    });

    if (error) {
      await logFailedLoginAction(email);
      setErrorMsg(error.message || "Invalid credentials");
      setIsSubmitting(false);
    } else {
      if (data?.session?.token) {
        await loginWrapperAction(email, data.session.token);
      }
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Project Nova</h1>
          <p className="mt-2 text-slate-400">
            Sign in to access your dashboard
          </p>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="mb-6 rounded-xl bg-red-500/10 p-4 text-sm font-medium text-red-400 ring-1 ring-inset ring-red-500/20"
          >
            {errorMsg}
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

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <Link href="/forgot-password" className="text-sm font-medium text-cyan-400 hover:text-cyan-300 hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
            />
            <label htmlFor="remember-me" className="text-sm text-slate-400 cursor-pointer">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

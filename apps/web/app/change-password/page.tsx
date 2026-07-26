import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePasswordAction } from "@/app/actions/auth";

export default async function ChangePasswordPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const profile = await prisma.employeeProfile.findUnique({
    where: { userId: session.user.id }
  });

  // If they don't actually need to change it, send them to dashboard
  if (!profile?.passwordResetRequired) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Project <span className="text-cyan-400">Nova</span></h2>
          <h3 className="mt-6 text-xl font-medium text-white">Mandatory Password Update</h3>
          <p className="mt-2 text-sm text-slate-400">
            For security reasons, you must change your default password before accessing the enterprise portal.
          </p>
        </div>
        
        <form action={updatePasswordAction} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Current Password</label>
              <input
                name="currentPassword"
                type="password"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
              <input
                name="newPassword"
                type="password"
                required
                minLength={8}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Confirm New Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Update Password and Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

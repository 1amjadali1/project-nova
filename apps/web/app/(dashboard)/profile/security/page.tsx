import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { updatePasswordAction } from "@/app/actions/auth";

export default async function SecurityPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Security Settings</h2>
          <p className="text-sm text-slate-400 mt-1">Manage your password and security preferences.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <form action={updatePasswordAction} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-slate-800 pb-2">Change Password</h3>
            
            <p className="text-sm text-slate-400 bg-slate-800/50 p-4 rounded-xl border border-slate-800">
              Your password must be at least 12 characters long and include an uppercase letter, a lowercase letter, a number, and a special character. You cannot reuse any of your last 5 passwords.
            </p>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Current Password</label>
              <input required type="password" name="currentPassword" 
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" 
                placeholder="••••••••" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                <input required type="password" name="newPassword" 
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" 
                  placeholder="••••••••" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Confirm New Password</label>
                <input required type="password" name="confirmPassword" 
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" 
                  placeholder="••••••••" 
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="rounded-lg bg-cyan-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500 transition-colors">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

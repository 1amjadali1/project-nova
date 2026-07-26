import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { updatePasswordAction } from "@/app/actions/auth";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/sign-in");

  const profile = await prisma.employeeProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      department: true,
      designation: true,
      manager: { include: { user: true } },
      user: true,
      EmployeeRoleAssignment: {
        include: { Role: true }
      }
    }
  });

  if (!profile) return <div>Profile not found</div>;

  const primaryRole = profile.EmployeeRoleAssignment[0]?.Role?.name || "Unassigned";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Identity & Hierarchy */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-4 mb-4">Identity Information</h2>
            
            <div className="flex items-start space-x-6">
              <div className="h-24 w-24 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center border border-slate-700 overflow-hidden">
                {profile.user.image ? (
                  <img src={profile.user.image} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl text-slate-500">{profile.user.name.charAt(0)}</span>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Full Name</p>
                    <p className="text-white font-medium">{profile.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email Address</p>
                    <p className="text-white font-medium">{profile.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Employee ID</p>
                    <p className="text-white font-medium">{profile.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Phone Number</p>
                    <p className="text-white font-medium">{profile.user.phone || "Not Set"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-4 mb-4">Organizational Hierarchy</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Department</p>
                <p className="text-white font-medium">{profile.department?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Designation</p>
                <p className="text-white font-medium">{profile.designation?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Primary Role</p>
                <p className="text-white font-medium">{primaryRole}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Reporting Manager</p>
                <p className="text-white font-medium">{profile.manager?.user.name || "None"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="col-span-1 space-y-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white border-b border-slate-800 pb-4 mb-4">Security</h2>
            
            <form action={updatePasswordAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Current Password</label>
                <input
                  name="currentPassword"
                  type="password"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                <input
                  name="newPassword"
                  type="password"
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Confirm New Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full justify-center rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

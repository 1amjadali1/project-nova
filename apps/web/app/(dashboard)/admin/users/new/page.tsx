import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { createUserAction } from "@/app/actions/admin/users";

export default async function CreateUserPage() {
  const [departments, teams, roles, managers] = await Promise.all([
    prisma.department.findMany(),
    prisma.team.findMany(),
    prisma.role.findMany(),
    prisma.employeeProfile.findMany({ include: { user: true } }), // In real app, filter for manager level
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Create Enterprise User</h2>
          <p className="text-sm text-slate-400 mt-1">Provision a new employee account and hierarchy mapping.</p>
        </div>
        <Link href="/admin/users" className="text-sm text-cyan-400 hover:underline">
          &larr; Back to Users
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <form action={createUserAction} className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-slate-800 pb-2">Identity Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Employee ID</label>
                <input required type="text" name="employeeId" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" placeholder="e.g. NOVA0100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                <div className="flex gap-2">
                  <input required type="text" name="firstName" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" placeholder="First Name" />
                  <input required type="text" name="lastName" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" placeholder="Last Name" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Official Email</label>
                <input required type="email" name="email" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" placeholder="name@projectnova.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Mobile Number</label>
                <input type="text" name="phone" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" placeholder="+91 9999999999" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-slate-800 pb-2">Hierarchy & Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Department</label>
                <select name="departmentId" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500">
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Team</label>
                <select name="teamId" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500">
                  <option value="">Select Team</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Reporting Manager</label>
                <select name="managerId" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500">
                  <option value="">Select Manager</option>
                  {managers.map(m => <option key={m.id} value={m.id}>{m.user.firstName} {m.user.lastName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">System Role</label>
                <select name="roleId" required className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500">
                  <option value="">Select Role</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white border-b border-slate-800 pb-2">Account Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Joining Date</label>
                <input required type="date" name="joiningDate" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                <select name="status" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="requirePasswordChange" name="requirePasswordChange" value="true" defaultChecked className="h-5 w-5 rounded border-slate-600 bg-slate-900 text-cyan-600 focus:ring-cyan-600 focus:ring-offset-slate-900" />
                <label htmlFor="requirePasswordChange" className="text-sm font-medium text-white">Require password change on first login</label>
              </div>
              <p className="mt-2 text-xs text-slate-400 ml-8">
                The account will be provisioned with the default password <span className="font-mono text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded">Welcome@2026</span>.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-4">
            <Link href="/admin/users" className="rounded-lg px-6 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800">
              Cancel
            </Link>
            <button type="submit" className="rounded-lg bg-cyan-600 px-8 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-500 shadow-lg shadow-cyan-900/20">
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

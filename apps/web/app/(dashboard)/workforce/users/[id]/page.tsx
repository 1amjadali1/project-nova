import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/candidates/StatusBadge";

export default async function EmployeeProfilePage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      employeeProfile: {
        include: {
          department: true,
          designation: true,
          manager: { include: { user: true } },
          subordinates: { include: { user: true } },
          assignedWork: {
            include: { verificationCheck: true }
          }
        }
      },
      roles: { include: { role: true } }
    }
  });

  if (!user) notFound();

  const profile = user.employeeProfile;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Profile Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden">
        <div className="p-8 flex items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-3xl font-bold text-cyan-500 shrink-0">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-white">{user.firstName} {user.lastName}</h2>
                <div className="flex items-center gap-3 mt-1 text-slate-400">
                  <span className="font-medium text-cyan-400">{profile?.designation?.name || "No Designation"}</span>
                  <span>•</span>
                  <span>{profile?.department?.name || "No Department"}</span>
                  <span>•</span>
                  <span>ID: {profile?.employeeId || "N/A"}</span>
                </div>
              </div>
              <StatusBadge active={user.isActive} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-sm">
              <div>
                <div className="text-slate-500">Email Address</div>
                <div className="text-slate-200 mt-1 truncate">{user.email}</div>
              </div>
              <div>
                <div className="text-slate-500">Reporting Manager</div>
                <div className="text-slate-200 mt-1">
                  {profile?.manager ? `${profile.manager.user.firstName} ${profile.manager.user.lastName}` : "None"}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Joining Date</div>
                <div className="text-slate-200 mt-1">
                  {profile?.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-slate-500">System Roles</div>
                <div className="text-slate-200 mt-1">
                  {user.roles.map(r => r.role.name).join(", ") || "No Roles"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Direct Reports & Contact info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h3 className="text-lg font-medium text-white border-b border-slate-800 pb-2 mb-4">Contact & HR Info</h3>
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-slate-500">Emergency Contact</div>
                <div className="text-slate-200 mt-1">{profile?.emergencyContact || "Not provided"}</div>
              </div>
              <div>
                <div className="text-slate-500">Office Location</div>
                <div className="text-slate-200 mt-1">{profile?.officeLocation || "Remote / Not provided"}</div>
              </div>
            </div>
          </div>

          {profile?.subordinates && profile.subordinates.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h3 className="text-lg font-medium text-white border-b border-slate-800 pb-2 mb-4">Direct Reports ({profile.subordinates.length})</h3>
              <ul className="space-y-3">
                {profile.subordinates.map(sub => (
                  <li key={sub.id} className="flex justify-between items-center text-sm">
                    <span className="text-slate-200">{sub.user.firstName} {sub.user.lastName}</span>
                    <Link href={`/workforce/users/${sub.user.id}`} className="text-cyan-400 hover:underline">
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Work Assignments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Current Work Assignments</h3>
              <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-full">
                {profile?.assignedWork?.length || 0} active
              </span>
            </div>
            
            <div className="p-0">
              {profile?.assignedWork && profile.assignedWork.length > 0 ? (
                <ul className="divide-y divide-slate-800">
                  {profile.assignedWork.map(work => (
                    <li key={work.id} className="p-6 hover:bg-slate-800/40 transition">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-white font-medium">{work.verificationCheck.category} Verification</div>
                          <div className="text-xs text-slate-500 mt-1">Check ID: {work.verificationCheck.id}</div>
                        </div>
                        <div className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          work.status === "COMPLETED" ? "bg-green-500/20 text-green-400" :
                          work.status === "IN_PROGRESS" ? "bg-cyan-500/20 text-cyan-400" :
                          "bg-slate-700 text-slate-300"
                        }`}>
                          {work.status}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-4 pt-4 border-t border-slate-800/50">
                        <div className="text-slate-400">
                          Assigned: {new Date(work.assignedAt).toLocaleDateString()}
                        </div>
                        <div className="text-slate-400">
                          SLA Due: {work.slaDueDate ? new Date(work.slaDueDate).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-10 text-center text-slate-500">
                  No active work assignments for this employee.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

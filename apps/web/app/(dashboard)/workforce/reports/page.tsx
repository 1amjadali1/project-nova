import { prisma } from "@/lib/prisma";
import { AssignmentStatus, SLAStatus } from "@prisma/client";

export default async function ProductivityReportsPage() {
  const [
    totalAssignments,
    completedAssignments,
    delayedAssignments,
    overdueAssignments
  ] = await Promise.all([
    prisma.workAssignment.count(),
    prisma.workAssignment.count({ where: { status: AssignmentStatus.COMPLETED } }),
    prisma.workAssignment.count({ where: { slaStatus: SLAStatus.DELAYED } }),
    prisma.workAssignment.count({ where: { slaStatus: SLAStatus.OVERDUE } }),
  ]);

  const completionRate = totalAssignments > 0 
    ? Math.round((completedAssignments / totalAssignments) * 100) 
    : 0;

  // Let's also fetch employee-level productivity
  const topEmployees = await prisma.employeeProfile.findMany({
    include: {
      user: true,
      assignedWork: true
    },
    take: 10
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Productivity & SLA Reports</h2>
          <p className="text-sm text-slate-400 mt-1">Real-time metrics on workflow engine performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="text-slate-400 text-sm font-medium">Total Assignments</div>
          <div className="text-3xl font-bold text-white mt-2">{totalAssignments}</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="text-slate-400 text-sm font-medium">Completed / Rate</div>
          <div className="text-3xl font-bold text-green-400 mt-2">{completedAssignments} <span className="text-lg text-green-500/50">({completionRate}%)</span></div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="text-slate-400 text-sm font-medium">SLA Delayed</div>
          <div className="text-3xl font-bold text-yellow-400 mt-2">{delayedAssignments}</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="text-slate-400 text-sm font-medium">SLA Overdue</div>
          <div className="text-3xl font-bold text-red-400 mt-2">{overdueAssignments}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-medium text-white">Agent Productivity Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800 text-slate-300">
              <tr>
                <th className="px-6 py-4 font-medium">Agent</th>
                <th className="px-6 py-4 font-medium text-center">Total Assigned</th>
                <th className="px-6 py-4 font-medium text-center">Completed</th>
                <th className="px-6 py-4 font-medium text-center">In Progress</th>
                <th className="px-6 py-4 font-medium text-center">Overdue</th>
                <th className="px-6 py-4 font-medium text-right">Performance Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {topEmployees.map((emp) => {
                const total = emp.assignedWork.length;
                const completed = emp.assignedWork.filter(w => w.status === 'COMPLETED').length;
                const inProgress = emp.assignedWork.filter(w => w.status === 'IN_PROGRESS').length;
                const overdue = emp.assignedWork.filter(w => w.slaStatus === 'OVERDUE').length;
                const score = total > 0 ? Math.round((completed / total) * 100) : 0;
                
                return (
                  <tr key={emp.id} className="transition hover:bg-slate-800/40">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{emp.user.firstName} {emp.user.lastName}</div>
                      <div className="text-xs text-slate-500 mt-1">{emp.user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-center text-white font-medium">{total}</td>
                    <td className="px-6 py-4 text-center text-green-400 font-medium">{completed}</td>
                    <td className="px-6 py-4 text-center text-cyan-400 font-medium">{inProgress}</td>
                    <td className="px-6 py-4 text-center text-red-400 font-medium">{overdue}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div className="bg-cyan-500 h-full" style={{ width: `${score}%` }}></div>
                        </div>
                        <span className="text-white font-medium w-8">{score}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {topEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                    No agents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

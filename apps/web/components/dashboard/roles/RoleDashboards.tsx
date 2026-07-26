import { prisma } from "@/lib/prisma";

export async function SuperAdminDashboard({ userId }: { userId: string }) {
  const users = await prisma.user.count();
  const orgs = await prisma.organization.count();
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Platform Super Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 font-medium">Total Organizations</h3>
          <p className="text-3xl text-white font-bold mt-2">{orgs}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 font-medium">Total Users</h3>
          <p className="text-3xl text-white font-bold mt-2">{users}</p>
        </div>
      </div>
    </div>
  );
}

export async function ITAdminDashboard({ userId }: { userId: string }) {
  const auditCount = await prisma.auditLog.count();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">IT System Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 font-medium">System Health</h3>
          <p className="text-3xl text-green-400 font-bold mt-2">100%</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 font-medium">Audit Logs Generated</h3>
          <p className="text-3xl text-white font-bold mt-2">{auditCount}</p>
        </div>
      </div>
    </div>
  );
}

export async function ManagerDashboard({ userId }: { userId: string }) {
  const reqs = await prisma.verificationRequest.count();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Operations Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 font-medium">Total Verifications</h3>
          <p className="text-3xl text-white font-bold mt-2">{reqs}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 font-medium">Active Teams</h3>
          <p className="text-3xl text-white font-bold mt-2">1</p>
        </div>
      </div>
    </div>
  );
}

export async function TeamLeaderDashboard({ userId }: { userId: string }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Team Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 font-medium">Team Throughput</h3>
          <p className="text-3xl text-cyan-400 font-bold mt-2">Good</p>
        </div>
      </div>
    </div>
  );
}

export async function QADashboard({ userId }: { userId: string }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Quality Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 font-medium">Pending Reviews</h3>
          <p className="text-3xl text-yellow-400 font-bold mt-2">0</p>
        </div>
      </div>
    </div>
  );
}

export async function AgentDashboard({ userId }: { userId: string }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">My Work Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-slate-400 font-medium">Assigned Tasks</h3>
          <p className="text-3xl text-white font-bold mt-2">0</p>
        </div>
      </div>
    </div>
  );
}

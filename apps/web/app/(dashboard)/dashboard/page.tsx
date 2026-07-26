import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  SuperAdminDashboard, 
  ITAdminDashboard, 
  ManagerDashboard, 
  TeamLeaderDashboard, 
  QADashboard, 
  AgentDashboard 
} from "@/components/dashboard/roles/RoleDashboards";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect("/sign-in");
  }

  const profile = await prisma.employeeProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      EmployeeRoleAssignment: {
        include: { Role: true }
      }
    }
  });

  if (!profile) {
    redirect("/sign-in");
  }

  const primaryRole = profile.EmployeeRoleAssignment[0]?.Role?.name || "Unknown";

  return (
    <div className="space-y-8 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <WelcomeHeader 
        userName={session.user.name} 
        organizationName="Project Nova Enterprise" 
      />
      
      {primaryRole === "Platform Super Admin" && <SuperAdminDashboard userId={session.user.id} />}
      {primaryRole === "IT Admin" && <ITAdminDashboard userId={session.user.id} />}
      {primaryRole === "Operations Manager" && <ManagerDashboard userId={session.user.id} />}
      {primaryRole === "Team Leader" && <TeamLeaderDashboard userId={session.user.id} />}
      {primaryRole === "QA" && <QADashboard userId={session.user.id} />}
      {primaryRole === "Agent" && <AgentDashboard userId={session.user.id} />}
      
      {primaryRole === "Unknown" && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center">
          <h2 className="text-xl text-white mb-2">Welcome to Project Nova</h2>
          <p className="text-slate-400">Your account has not been assigned a role yet.</p>
        </div>
      )}
    </div>
  );
}

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import KPICards from "@/components/dashboard/KPICards";
import VerificationChart from "@/components/dashboard/VerificationChart";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import QuickActions from "@/components/dashboard/QuickActions";
import SystemStatus from "@/components/dashboard/SystemStatus";
import WorkQueue from "@/components/dashboard/WorkQueue";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch full user with roles and organization
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      organization: true,
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Role detection
  const isSuperAdmin = user.roles.some((ur) => ur.role.name === "Super Admin");
  const isOrgAdmin = user.roles.some((ur) => ur.role.name === "Organization Admin");

  // Parallel data fetching for KPIs
  const whereClause = isSuperAdmin ? {} : { organizationId: user.organizationId };

  const [orgCount, candidateCount, verificationCount, userCount] = await Promise.all([
    isSuperAdmin ? prisma.organization.count() : Promise.resolve(0),
    prisma.candidate.count({ where: whereClause }),
    prisma.verificationRequest.count({
      where: isSuperAdmin 
        ? {} 
        : { candidate: { organizationId: user.organizationId } },
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  const counts = {
    organizations: orgCount,
    candidates: candidateCount,
    verifications: verificationCount,
    users: userCount,
  };

  return (
    <div className="space-y-8 pb-12 max-w-[1600px] mx-auto">
      
      {/* Section 1: Welcome Header */}
      <WelcomeHeader 
        userName={user.firstName} 
        organizationName={user.organization?.name || "your organization"} 
      />

      {/* Section 2: KPI Cards */}
      <KPICards 
        counts={counts} 
        showOrganizations={isSuperAdmin} 
      />

      {/* Section 3 & 4: Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Spans 2 cols on extra large screens) */}
        <div className="xl:col-span-2 space-y-8">
          <VerificationChart />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <WorkQueue />
            <QuickActions />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <ActivityTimeline />
          {isSuperAdmin && <SystemStatus />}
        </div>
        
      </div>
      
    </div>
  );
}

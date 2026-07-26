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
import CandidatePipeline from "@/components/dashboard/analytics/CandidatePipeline";
import VerificationTypeChart from "@/components/dashboard/analytics/VerificationTypeChart";
import MonthlyTrendChart from "@/components/dashboard/analytics/MonthlyTrendChart";
import SLADashboard from "@/components/dashboard/analytics/SLADashboard";

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
  const whereClause = isSuperAdmin ? {} : { organizationId: user.organizationId };
  const verificationWhereClause = isSuperAdmin ? {} : { candidate: { organizationId: user.organizationId } };

  // Data ranges
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Parallel data fetching for KPIs & Analytics
  const [
    orgCount, 
    candidateCount, 
    verificationCount, 
    userCount,
    verificationTypes,
    recentCandidates,
    recentVerifications,
    pipelineRunningCount,
    pipelineCompletedCount,
    workQueueItems
  ] = await Promise.all([
    isSuperAdmin ? prisma.organization.count() : Promise.resolve(0),
    prisma.candidate.count({ where: whereClause }),
    prisma.verificationRequest.count({ where: verificationWhereClause }),
    prisma.user.count({ where: whereClause }),
    
    // Analytics: Verification Types Breakdown
    prisma.verificationRequest.groupBy({
      by: ["type"],
      _count: { type: true },
      where: verificationWhereClause,
    }),

    // Analytics: Monthly Trend Data (Candidates)
    prisma.candidate.findMany({
      where: { ...whereClause, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    }),

    // Analytics: Monthly Trend Data (Verifications)
    prisma.verificationRequest.findMany({
      where: { ...verificationWhereClause, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    }),

    // Pipeline Data (Running)
    prisma.candidate.count({
      where: {
        ...whereClause,
        verifications: { some: { status: { in: ["PENDING", "IN_PROGRESS"] } } },
      },
    }),

    // Pipeline Data (Completed)
    prisma.candidate.count({
      where: {
        ...whereClause,
        verifications: { some: { status: "COMPLETED" } },
      },
    }),

    // Work Queue (Top Priority)
    prisma.verificationRequest.findMany({
      where: {
        ...verificationWhereClause,
        status: { in: ["PENDING", "IN_PROGRESS"] }
      },
      orderBy: [
        { priority: 'desc' }, // URGENT > NORMAL > LOW (alphabetical? No, wait. Prisma sorts enums based on declaration order! LOW, NORMAL, HIGH, URGENT. So 'desc' will put URGENT first.)
        { createdAt: 'asc' }
      ],
      take: 5,
      include: {
        candidate: {
          select: { firstName: true, lastName: true }
        }
      }
    })
  ]);

  const counts = {
    organizations: orgCount,
    candidates: candidateCount,
    verifications: verificationCount,
    users: userCount,
  };

  // Map Verification Types for Pie Chart
  const typeDistribution = verificationTypes.map((t) => ({
    name: t.type,
    value: t._count.type,
  }));

  // Map Monthly Trend Series
  const monthlyDataMap: Record<string, { Candidates: number; Verifications: number }> = {};
  
  // Initialize last 30 days
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
    monthlyDataMap[dateStr] = { Candidates: 0, Verifications: 0 };
  }

  recentCandidates.forEach((c) => {
    const dateStr = c.createdAt.toISOString().split("T")[0];
    if (monthlyDataMap[dateStr]) monthlyDataMap[dateStr].Candidates += 1;
  });

  recentVerifications.forEach((v) => {
    const dateStr = v.createdAt.toISOString().split("T")[0];
    if (monthlyDataMap[dateStr]) monthlyDataMap[dateStr].Verifications += 1;
  });

  const trendData = Object.entries(monthlyDataMap).map(([date, counts]) => ({
    date: date.substring(5), // MM-DD for x-axis
    ...counts,
  }));

  // Synthetic Pipeline Mocking for unsupported stages
  const pipelineMetrics = {
    applied: Math.max(0, candidateCount - pipelineRunningCount - pipelineCompletedCount),
    documentsPending: Math.floor(pipelineRunningCount * 0.3), // Mock
    verificationRunning: pipelineRunningCount,
    completed: pipelineCompletedCount,
    rejected: Math.floor(candidateCount * 0.05), // Mock
  };

  // Synthetic SLA Mocking
  const slaMetrics = {
    averageTime: "2.4 Days",
    pendingToday: Math.floor(pipelineRunningCount * 0.2),
    overdueCases: workQueueItems.filter(i => i.priority === "URGENT").length, // Show urgent as overdue/attention
    completedToday: 5,
  };

  return (
    <div className="space-y-8 pb-12 max-w-[1600px] mx-auto">
      
      {/* Section 1: Welcome Header */}
      <WelcomeHeader 
        userName={user.firstName} 
        organizationName={user.organization?.name || "your organization"} 
      />

      {/* SLA Metrics Top Bar */}
      <SLADashboard metrics={slaMetrics} />

      {/* Section 2: KPI Cards */}
      <KPICards 
        counts={counts} 
        showOrganizations={isSuperAdmin} 
      />

      {/* Section 3: Candidate Pipeline */}
      <CandidatePipeline metrics={pipelineMetrics} />

      {/* Main Analytical Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Spans 2 cols) */}
        <div className="xl:col-span-2 space-y-8">
          <MonthlyTrendChart data={trendData} />
          <VerificationChart />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <WorkQueue items={workQueueItems} />
            <QuickActions />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <VerificationTypeChart data={typeDistribution} />
          <ActivityTimeline />
          {isSuperAdmin && <SystemStatus />}
        </div>
        
      </div>
      
    </div>
  );
}

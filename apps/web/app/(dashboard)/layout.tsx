import { getEnterpriseSession } from "@/lib/auth/session";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/dashboard/Sidebar";
import TopHeader from "@/components/dashboard/TopHeader";
import ImpersonationBanner from "@/components/dashboard/ImpersonationBanner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionData = await getEnterpriseSession();

  if (!sessionData?.user) {
    redirect("/sign-in");
  }

  const { user, isImpersonating, originalUser } = sessionData;

  const profile = await prisma.employeeProfile.findUnique({
    where: { userId: user.id },
    include: { EmployeeRoleAssignment: { include: { Role: true } } }
  });

  if (profile?.passwordResetRequired && !isImpersonating) {
    redirect("/change-password");
  }

  let originalProfile = null;
  if (isImpersonating && originalUser) {
    originalProfile = await prisma.employeeProfile.findUnique({
      where: { userId: originalUser.id },
      include: { EmployeeRoleAssignment: { include: { Role: true } } }
    });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white flex-col">
      {isImpersonating && originalUser && (
        <ImpersonationBanner 
          originalUserName={`${originalUser.firstName} ${originalUser.lastName}`}
          originalUserRole={originalProfile?.EmployeeRoleAssignment[0]?.Role.name || "Unknown"}
          impersonatedUserName={user.name}
          impersonatedUserRole={profile?.EmployeeRoleAssignment[0]?.Role.name || "Unknown"}
        />
      )}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopHeader />
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

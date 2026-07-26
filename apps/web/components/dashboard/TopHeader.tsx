import { getEnterpriseSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import ProfileDropdown from "./ProfileDropdown";

export default async function TopHeader() {
  const sessionData = await getEnterpriseSession();

  if (!sessionData?.user) return null;
  const session = sessionData;

  // Get the primary role for the display
  const profile = await prisma.employeeProfile.findUnique({
    where: { userId: session.user.id },
    include: { EmployeeRoleAssignment: { include: { Role: true } } }
  });

  const roleName = profile?.EmployeeRoleAssignment[0]?.Role.name || "Employee";

  const user = {
    firstName: session.user.firstName as string || "User",
    lastName: session.user.lastName as string || "",
    email: session.user.email,
    role: roleName,
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-8 backdrop-blur-xl">
      <div>
        {/* Placeholder for left side if needed */}
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors">
          Notifications
        </button>

        <ProfileDropdown user={user} />
      </div>
    </header>
  );
}

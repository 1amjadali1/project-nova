import { prisma } from "@/lib/prisma";
import NewVerificationForm from "@/components/verifications/NewVerificationForm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function NewVerificationPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const isSuperAdmin = await prisma.userRole.findFirst({
    where: { userId: session.user.id, role: { name: "SUPER_ADMIN" } }
  });

  const candidates = await prisma.candidate.findMany({
    where: isSuperAdmin ? {} : { organizationId: session.user.organizationId },
    select: { id: true, firstName: true, lastName: true },
    orderBy: { lastName: "asc" }
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Request Verification</h1>
        <p className="mt-2 text-slate-400">
          Start a new verification request for an existing candidate.
        </p>
      </div>

      <NewVerificationForm candidates={candidates} />
    </div>
  );
}

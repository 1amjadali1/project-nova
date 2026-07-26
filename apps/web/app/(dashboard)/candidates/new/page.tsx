import { prisma } from "@/lib/prisma";
import NewCandidateForm from "@/components/candidates/NewCandidateForm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

export default async function NewCandidatePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    const { redirect } = await import("next/navigation");
    redirect("/login");
  }
  
  // Super Admin can select orgs, others use their own.
  // Wait, NewCandidateForm expects organizations.
  const organizations = await prisma.organization.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Add Candidate</h1>
        <p className="mt-2 text-slate-400">
          Create a new candidate profile to begin verifications.
        </p>
      </div>

      <NewCandidateForm organizations={organizations} />
    </div>
  );
}

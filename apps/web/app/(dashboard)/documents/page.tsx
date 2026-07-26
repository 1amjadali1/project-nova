import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Search, Filter, FileText } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import DocumentPreviewWrapper from "./DocumentPreviewWrapper";

export default async function DocumentsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch full user for role checking
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { roles: { include: { role: true } } },
  });

  if (!user) redirect("/login");

  const isSuperAdmin = user.roles.some((ur) => ur.role.name === "Super Admin");
  const orgFilter = isSuperAdmin ? {} : { organizationId: user.organizationId };

  const documents = await prisma.document.findMany({
    where: {
      ...orgFilter,
      isDeleted: false,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      candidate: { select: { firstName: true, lastName: true } },
    },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Documents</h1>
          <p className="mt-1 text-slate-400">View and manage all uploaded candidate documents.</p>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search documents by name, candidate, or type..."
            className="w-full rounded-lg bg-slate-950 border border-slate-700 py-2 pl-10 pr-4 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Documents Found"
          description="There are no documents uploaded yet. Documents uploaded to candidate profiles will appear here."
          actionLabel="View Candidates"
          actionHref="/candidates"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <DocumentPreviewWrapper documents={documents} />
        </div>
      )}
    </div>
  );
}

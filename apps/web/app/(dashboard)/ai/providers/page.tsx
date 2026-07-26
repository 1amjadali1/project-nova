import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Server, Settings2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { hasRole } from "@/lib/auth/rbac";
import ProviderStatusBadge from "@/components/ai/providers/ProviderStatusBadge";
import ProviderControls from "@/components/ai/providers/ProviderControls";

export default async function AIProvidersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const orgFilter = { organizationId: session.user.organizationId };
  const isAdmin = await hasRole(session.user.id, "SUPER_ADMIN");

  // Fetch Providers
  let providers = await prisma.aIProvider.findMany({
    where: orgFilter,
    orderBy: { priority: "desc" },
  });

  // Seed providers if none exist for this org (for the sake of Sprint 8)
  if (providers.length === 0 && isAdmin) {
    await prisma.aIProvider.createMany({
      data: [
        {
          organizationId: session.user.organizationId,
          name: "Mock Extraction Engine",
          code: "MOCK",
          version: "v1.0",
          priority: 10,
          supportedFeatures: ["OCR", "DOCUMENT_CLASSIFICATION"],
        },
        {
          organizationId: session.user.organizationId,
          name: "Google Cloud Vision",
          code: "GOOGLE",
          version: "v1",
          priority: 5,
          supportedFeatures: ["OCR", "FACE_MATCH"],
        }
      ]
    });
    providers = await prisma.aIProvider.findMany({ where: orgFilter, orderBy: { priority: "desc" } });
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Server className="h-8 w-8 text-cyan-400" />
            AI Provider Management
          </h1>
          <p className="mt-2 text-slate-400">
            Configure OCR engines, routing priorities, and automatic failovers.
          </p>
        </div>
      </div>

      {!isAdmin && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-red-400 mt-0.5" />
          <p className="text-sm font-medium text-red-400">
            You do not have Super Admin privileges. Configuration changes are disabled.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {providers.map(provider => (
          <div key={provider.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Link href={`/ai/providers/${provider.id}`} className="hover:text-cyan-400 transition">
                      {provider.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-slate-500 font-mono mt-1">{provider.code} • {provider.version}</p>
                </div>
                <ProviderStatusBadge status={provider.status} enabled={provider.enabled} />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {provider.supportedFeatures.map(feature => (
                  <span key={feature} className="px-2 py-1 rounded bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700">
                    {feature.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <Link 
                href={`/ai/providers/${provider.id}`}
                className="text-sm font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <Settings2 className="h-4 w-4" /> View Metrics
              </Link>
              
              <ProviderControls 
                providerId={provider.id}
                enabled={provider.enabled}
                priority={provider.priority}
                isAdmin={isAdmin}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

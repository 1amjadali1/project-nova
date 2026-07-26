import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ArrowLeft, Server, Activity, Database, Zap } from "lucide-react";
import Link from "next/link";
import ProviderStatusBadge from "@/components/ai/providers/ProviderStatusBadge";
import ProviderMetricTable from "@/components/ai/providers/ProviderMetricTable";
import FeatureMatrix from "@/components/ai/providers/FeatureMatrix";
import AIQueueCard from "@/components/ai/AIQueueCard";

export default async function AIProviderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const provider = await prisma.aIProvider.findUnique({
    where: { id },
    include: {
      metrics: {
        orderBy: { date: "desc" },
        take: 30
      }
    }
  });

  if (!provider || provider.organizationId !== session.user.organizationId) {
    redirect("/ai/providers");
  }

  // Aggregate stats
  const totalRequests = provider.metrics.reduce((acc, m) => acc + m.totalRequests, 0);
  const totalSuccess = provider.metrics.reduce((acc, m) => acc + m.successCount, 0);
  const totalFails = provider.metrics.reduce((acc, m) => acc + m.failureCount, 0);
  
  const overallSuccessRate = totalRequests > 0 ? ((totalSuccess / totalRequests) * 100).toFixed(1) + "%" : "-";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/ai/providers"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <Server className="h-6 w-6 text-cyan-400" />
              {provider.name}
            </h1>
            <p className="mt-1 text-sm text-slate-400 font-mono">
              {provider.code} • Version {provider.version}
            </p>
          </div>
        </div>
        <ProviderStatusBadge status={provider.status} enabled={provider.enabled} />
      </div>

      {/* Aggregate Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AIQueueCard 
          title="Total Requests" 
          value={totalRequests} 
          icon={Database} 
        />
        <AIQueueCard 
          title="Success Rate" 
          value={overallSuccessRate} 
          icon={Activity}
          trendUp={parseFloat(overallSuccessRate) >= 95}
        />
        <AIQueueCard 
          title="Total Failures" 
          value={totalFails} 
          icon={Zap}
        />
        <AIQueueCard 
          title="Routing Priority" 
          value={provider.priority} 
          icon={Server}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-white">Daily Telemetry</h2>
          <ProviderMetricTable metrics={provider.metrics} />
        </div>
        
        <div className="space-y-6">
          <FeatureMatrix features={provider.supportedFeatures} />

          {/* Cost Modeling Prep */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-white mb-4">Cost Modeling</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-sm text-slate-400">Cost Per Request</span>
                <span className="text-sm font-medium text-white">
                  {provider.costPerRequest ? `$${provider.costPerRequest.toFixed(4)}` : "Free / Not Set"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-sm text-slate-400">Cost Per Page</span>
                <span className="text-sm font-medium text-white">
                  {provider.costPerPage ? `$${provider.costPerPage.toFixed(4)}` : "Free / Not Set"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-400">Estimated Total Cost</span>
                <span className="text-sm font-bold text-cyan-400">
                  {provider.costPerRequest ? `$${(provider.costPerRequest * totalRequests).toFixed(2)}` : "$0.00"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import KPICards from "@/components/dashboard/KPICards";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <KPICards />

      <RecentActivity />

    </div>
  );
}

import StatsCard from "./StatsCard";
import { Building2, Users, FileCheck2, UserCircle } from "lucide-react";

interface KPICardsProps {
  counts: {
    organizations: number;
    candidates: number;
    verifications: number;
    users: number;
  };
  showOrganizations?: boolean;
}

export default function KPICards({ counts, showOrganizations = false }: KPICardsProps) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 ${showOrganizations ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      
      {showOrganizations && (
        <StatsCard
          title="Organizations"
          value={counts.organizations}
          description="Total active tenants"
          icon={Building2}
          trend={{ value: 12, isPositive: true }}
        />
      )}

      <StatsCard
        title="Candidates"
        value={counts.candidates}
        description="Registered in system"
        icon={Users}
        trend={{ value: 8, isPositive: true }}
      />

      <StatsCard
        title="Verification Requests"
        value={counts.verifications}
        description="Total lifetime requests"
        icon={FileCheck2}
        trend={{ value: 24, isPositive: true }}
      />

      <StatsCard
        title="Team Members"
        value={counts.users}
        description="Active system users"
        icon={UserCircle}
        trend={{ value: 2, isPositive: true }}
      />

    </div>
  );
}

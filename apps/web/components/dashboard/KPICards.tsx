import KPICard from "./KPICard";

export default function KPICards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <KPICard
        title="Organizations"
        value="1"
        subtitle="Active organizations"
      />

      <KPICard
        title="Candidates"
        value="0"
        subtitle="Registered candidates"
      />

      <KPICard
        title="Verifications"
        value="0"
        subtitle="Verification requests"
      />

      <KPICard
        title="Reports"
        value="0"
        subtitle="Generated reports"
      />

    </div>
  );
}

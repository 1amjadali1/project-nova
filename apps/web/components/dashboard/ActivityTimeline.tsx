import { UserPlus, FileText, CheckCircle, Building } from "lucide-react";

export default function ActivityTimeline() {
  const activities = [
    {
      id: 1,
      type: "verification_completed",
      title: "Verification Completed",
      description: "Criminal record check cleared for Sarah Jenkins",
      time: "10 minutes ago",
      icon: CheckCircle,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
      iconRing: "ring-green-500/20",
    },
    {
      id: 2,
      type: "candidate_added",
      title: "New Candidate Added",
      description: "Michael Chen was added to Engineering cohort",
      time: "2 hours ago",
      icon: UserPlus,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
      iconRing: "ring-cyan-500/20",
    },
    {
      id: 3,
      type: "verification_started",
      title: "Verification Started",
      description: "Employment verification initiated for David Park",
      time: "4 hours ago",
      icon: FileText,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      iconRing: "ring-amber-500/20",
    },
    {
      id: 4,
      type: "org_created",
      title: "Organization Onboarded",
      description: "Acme Corp successfully completed setup",
      time: "1 day ago",
      icon: Building,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
      iconRing: "ring-purple-500/20",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Recent Activity</h2>
        <p className="text-sm text-slate-400">Latest actions across your organization</p>
      </div>

      <div className="flex-1 relative">
        <div className="absolute left-6 top-2 bottom-0 w-px bg-slate-800"></div>
        <div className="space-y-6 relative">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4 group">
              <div
                className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${activity.iconBg} ${activity.iconColor} ${activity.iconRing} transition-transform group-hover:scale-110`}
              >
                <activity.icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col pt-1">
                <p className="text-sm font-semibold text-slate-200">{activity.title}</p>
                <p className="text-sm text-slate-400">{activity.description}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const activities = [
  {
    title: "Organization created",
    description: "Project Nova organization was created",
    time: "2 mins ago",
  },
  {
    title: "Admin login",
    description: "amjad.ali@nova.com logged in",
    time: "5 mins ago",
  },
  {
    title: "Dashboard initialized",
    description: "Enterprise dashboard is ready",
    time: "Today",
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-6 text-xl font-semibold">
        Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((activity) => (
          <div
            key={activity.title}
            className="border-b border-slate-800 pb-4 last:border-none"
          >
            <h3 className="font-semibold text-white">
              {activity.title}
            </h3>

            <p className="text-sm text-slate-400">
              {activity.description}
            </p>

            <span className="text-xs text-cyan-400">
              {activity.time}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
}

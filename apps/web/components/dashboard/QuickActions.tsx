import Link from "next/link";
import { UserPlus, FileCheck, Building2, Send } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      name: "New Candidate",
      href: "/candidates/new",
      icon: UserPlus,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/20",
    },
    {
      name: "New Verification",
      href: "/verifications/new",
      icon: FileCheck,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/20",
    },
    {
      name: "Invite User",
      href: "/users/new",
      icon: Send,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20 hover:border-green-500/50 hover:bg-green-500/20",
    },
    {
      name: "New Organization",
      href: "/organizations/new",
      icon: Building2,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/20",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white tracking-tight">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className={`group flex flex-col items-center justify-center gap-3 rounded-xl border ${action.border} bg-slate-950 p-4 transition-all duration-200`}
          >
            <div className={`rounded-full ${action.bg} p-3 ${action.color}`}>
              <action.icon className="h-6 w-6" />
            </div>
            <span className="text-center text-sm font-medium text-slate-300 group-hover:text-white">
              {action.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

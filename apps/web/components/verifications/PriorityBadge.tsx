import React from "react";

type Priority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export default function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<Priority, { color: string; bg: string; icon: string }> = {
    LOW: { color: "text-green-400", bg: "bg-green-500/10", icon: "🟢" },
    NORMAL: { color: "text-blue-400", bg: "bg-blue-500/10", icon: "🔵" },
    HIGH: { color: "text-orange-400", bg: "bg-orange-500/10", icon: "🟠" },
    URGENT: { color: "text-red-400", bg: "bg-red-500/10", icon: "🔴" },
  };

  const config = styles[priority as Priority] || styles.NORMAL;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ring-current/20 ${config.bg} ${config.color}`}
    >
      <span className="text-[10px]">{config.icon}</span>
      {priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()}
    </span>
  );
}

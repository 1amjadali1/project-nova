type Props = {
  status: string;
};

export default function StatusBadge({ status }: Props) {
  let colors = "bg-slate-500/10 text-slate-400 border-slate-500/20";
  let label = status;

  switch (status) {
    case "PENDING":
      colors = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      label = "Pending";
      break;
    case "IN_PROGRESS":
      colors = "bg-blue-500/10 text-blue-400 border-blue-500/20";
      label = "In Progress";
      break;
    case "COMPLETED":
      colors = "bg-green-500/10 text-green-400 border-green-500/20";
      label = "Completed";
      break;
    case "FAILED":
      colors = "bg-red-500/10 text-red-400 border-red-500/20";
      label = "Failed";
      break;
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors}`}>
      {label}
    </span>
  );
}

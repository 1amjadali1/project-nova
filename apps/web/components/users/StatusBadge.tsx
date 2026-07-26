type Props = {
  isActive: boolean;
};

export default function StatusBadge({ isActive }: Props) {
  const colors = isActive
    ? "bg-green-500/10 text-green-400 border-green-500/20"
    : "bg-slate-500/10 text-slate-400 border-slate-500/20";
    
  const label = isActive ? "Active" : "Inactive";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors}`}>
      {label}
    </span>
  );
}

type Props = {
  active: boolean;
};

export default function StatusBadge({ active }: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? "bg-green-500/20 text-green-400"
          : "bg-red-500/20 text-red-400"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

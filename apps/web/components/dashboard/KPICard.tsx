type KPICardProps = {
  title: string;
  value: string;
  subtitle: string;
};

export default function KPICard({
  title,
  value,
  subtitle,
}: KPICardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-bold text-white">
        {value}
      </h2>

      <p className="mt-2 text-sm text-cyan-400">
        {subtitle}
      </p>

    </div>
  );
}

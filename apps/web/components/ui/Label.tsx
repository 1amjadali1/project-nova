type LabelProps = {
  children: React.ReactNode;
};

export default function Label({ children }: LabelProps) {
  return (
    <label className="mb-2 block text-sm font-medium text-slate-300">
      {children}
    </label>
  );
}

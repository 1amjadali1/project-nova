type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

export default function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
}: ButtonProps) {
  const variants = {
    primary:
      "bg-cyan-500 hover:bg-cyan-400 text-slate-950",
    secondary:
      "border border-slate-700 bg-slate-900 hover:border-cyan-500 text-white",
    danger:
      "bg-red-500 hover:bg-red-400 text-white",
    ghost:
      "bg-transparent hover:bg-slate-800 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-xl px-5 py-3 font-semibold transition ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

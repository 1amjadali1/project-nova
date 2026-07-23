import Link from "next/link";

const menu = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Organizations", href: "/organizations" },
  { name: "Candidates", href: "/candidates" },
  { name: "Verifications", href: "/verifications" },
  { name: "Reports", href: "/reports" },
  { name: "Users", href: "/users" },
  { name: "Settings", href: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-2xl font-bold">
          Project <span className="text-cyan-400">Nova</span>
        </h1>
      </div>

      <nav className="p-4">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="mb-2 block rounded-lg px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

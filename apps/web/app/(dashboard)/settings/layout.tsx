"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Profile", href: "/settings/profile" },
    { name: "Security", href: "/settings/security" },
    { name: "Sessions", href: "/settings/sessions" },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-slate-400">
          Manage your account settings and security preferences.
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>
        
        <main className="flex-1">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

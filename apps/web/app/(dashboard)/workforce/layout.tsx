import Link from "next/link";

export default async function WorkforceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Workforce Administration</h1>
        <p className="mt-2 text-slate-400">
          Manage employees, roles, access, and organization hierarchy.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-800">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          <Link
            href="/workforce/users"
            className="whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm font-medium text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-colors"
          >
            Users & Profiles
          </Link>
          <Link
            href="/workforce/roles"
            className="whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm font-medium text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-colors"
          >
            Role Management
          </Link>
          <Link
            href="/workforce/access"
            className="whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm font-medium text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-colors"
          >
            Access & Security
          </Link>
          <Link
            href="/workforce/org-chart"
            className="whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm font-medium text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-colors"
          >
            Org Chart
          </Link>
          <Link
            href="/workforce/reports"
            className="whitespace-nowrap border-b-2 border-transparent px-1 py-4 text-sm font-medium text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-colors"
          >
            Productivity Reports
          </Link>
        </nav>
      </div>

      <div className="pt-4">
        {children}
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      {children}
    </main>
  );
}

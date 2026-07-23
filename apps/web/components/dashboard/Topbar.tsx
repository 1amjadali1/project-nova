export default function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-8">

      <div>
        <h2 className="text-xl font-semibold text-white">
          Dashboard
        </h2>

        <p className="text-sm text-slate-400">
          Enterprise Background Verification Platform
        </p>
      </div>

      <div className="flex items-center gap-4">

        <button className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
          Notifications
        </button>

        <div className="rounded-full bg-cyan-500 px-4 py-2 font-semibold text-slate-950">
          AA
        </div>

      </div>

    </header>
  );
}

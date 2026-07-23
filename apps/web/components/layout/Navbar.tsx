export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="text-2xl font-bold text-cyan-400">
          Project Nova
        </div>

        <div className="hidden gap-8 text-sm text-slate-300 md:flex">
          <a href="#">Features</a>
          <a href="#">Industries</a>
          <a href="#">Pricing</a>
          <a href="#">Contact</a>
        </div>

        <button className="rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-slate-950 hover:bg-cyan-400">
          Request Demo
        </button>
      </nav>
    </header>
  );
}

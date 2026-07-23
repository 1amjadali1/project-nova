export default function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
      <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1 text-sm text-cyan-300">
        Enterprise Background Verification Platform
      </span>

      <h1 className="mt-8 max-w-5xl text-5xl font-extrabold tracking-tight md:text-7xl">
        Project <span className="text-cyan-400">Nova</span>
      </h1>

      <p className="mt-6 max-w-3xl text-lg text-slate-300 md:text-xl">
        AI-powered Background Verification platform for Enterprises, HR Teams,
        Staffing Agencies and Verification Partners.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <button className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
          Get Started
        </button>

        <button className="rounded-xl border border-slate-600 px-6 py-3 font-semibold transition hover:border-cyan-400 hover:text-cyan-400">
          Request Demo
        </button>
      </div>
    </section>
  );
}

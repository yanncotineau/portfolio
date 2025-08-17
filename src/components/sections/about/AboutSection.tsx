export default function AboutSection() {
  const items = [
    "Who I am",
    "What I value",
    "How I work",
    "Principles",
    "Impact-first",
    "Quality & speed",
  ];
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 scroll-mt-28">
      <h2 className="text-2xl font-semibold">About</h2>
      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((title) => (
          <div key={title} className="rounded-xl ring-1 ring-slate-900/10 dark:ring-white/10 p-5 bg-white/60 dark:bg-white/5">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Placeholder card — replace with real content soon.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
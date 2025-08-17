import Navbar from "@/components/navbar/NavBar";
import AboutSection from "@/components/sections/about/AboutSection";
import BlogSection from "@/components/sections/blog/BlogSection";
import ContactSection from "@/components/sections/contact/ContactSection";
import ExperienceSection from "@/components/sections/experience/ExperienceSection";
import SkillsSection from "@/components/sections/skills/SkillsSection";

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Dummy content – replace later with your sections */}
      <section id="home" className="relative">
        <div className="relative isolate overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=2000&auto=format&fit=crop"
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/80 via-white/50 to-white dark:from-slate-950/80 dark:via-slate-950/50 dark:to-slate-950" />

          {/* Floating blobs */}
          <div className="pointer-events-none absolute -top-10 left-10 h-48 w-48 rounded-full bg-emerald-400/30 blur-3xl animate-blob" />
          <div
            className="pointer-events-none absolute top-24 right-10 h-56 w-56 rounded-full bg-indigo-400/30 blur-3xl animate-blob"
            style={{ animationDelay: "-4s" }}
          />
          <div
            className="pointer-events-none absolute -bottom-10 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-fuchsia-400/30 blur-3xl animate-blob"
            style={{ animationDelay: "-8s" }}
          />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-black/5 backdrop-blur dark:bg-white/10 dark:text-slate-200 dark:ring-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Ships fast • Obsessive about details • Impact focused
            </p>

            <h1 className="mt-6 max-w-4xl text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
              Full-Stack Engineer building robust web platforms &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-500">
                AI-powered
              </span>{" "}
              experiences.
            </h1>

            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
              I design, build, and scale apps across the stack — React/Next, Node/Express, Postgres/Redis — and explore
              emerging tech like LLMs, RAG pipelines, vector search, and realtime UIs.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#projects" className="rounded-lg bg-slate-900 px-4 py-2 text-white dark:bg-white dark:text-slate-900">
                See Projects
              </a>
              <a href="#contact" className="rounded-lg px-4 py-2 ring-1 ring-slate-900/10 dark:ring-white/10">
                Get in touch
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 max-w-md text-center text-sm">
              <div className="p-3 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 bg-white/40 dark:bg-white/5">
                <div className="text-2xl font-semibold">20+</div>
                <div className="text-slate-500">Projects shipped</div>
              </div>
              <div className="p-3 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 bg-white/40 dark:bg-white/5">
                <div className="text-2xl font-semibold">~10ms</div>
                <div className="text-slate-500">API p95 targets</div>
              </div>
              <div className="p-3 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 bg-white/40 dark:bg-white/5">
                <div className="text-2xl font-semibold">LLM</div>
                <div className="text-slate-500">RAG · Vector · Tools</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <AboutSection />
      <SkillsSection />
      <BlogSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// R3F scene (no SSR)
const SkillsScene = dynamic(() => import("./SkillsScene"), { ssr: false });

// ----- Demo data -----
const CATEGORIES = [
  {
    name: "Frontend",
    cards: [
      { id: "react", title: "React / Next", subtitle: "Hooks, SSR, RSC" },
      { id: "ts", title: "TypeScript", subtitle: "Typesafety, DX" },
      { id: "ui", title: "Tailwind / UI", subtitle: "Design Systems" },
      { id: "r3f", title: "R3F", subtitle: "3D UX, shaders" },
      { id: "testing", title: "Testing", subtitle: "Vitest, RTL" },
      { id: "perf", title: "Perf", subtitle: "LCP / TTI budgets" },
    ],
  },
  {
    name: "Backend",
    cards: [
      { id: "node", title: "Node / Express", subtitle: "REST, WS" },
      { id: "auth", title: "Auth", subtitle: "JWT, OAuth" },
      { id: "ci", title: "CI / CD", subtitle: "Build, deploy" },
      { id: "obs", title: "Observability", subtitle: "Logs, traces" },
      { id: "queue", title: "Queues", subtitle: "BullMQ" },
      { id: "arch", title: "Architecture", subtitle: "Clean / Hex" },
    ],
  },
  {
    name: "Data",
    cards: [
      { id: "pg", title: "Postgres", subtitle: "Schemas, tuning" },
      { id: "redis", title: "Redis", subtitle: "Caching" },
      { id: "prisma", title: "Prisma", subtitle: "ORM" },
      { id: "search", title: "Search", subtitle: "Text / vector" },
      { id: "etl", title: "ETL", subtitle: "Pipelines" },
      { id: "migrations", title: "Migrations", subtitle: "Safe rollout" },
    ],
  },
  {
    name: "Infra",
    cards: [
      { id: "docker", title: "Docker", subtitle: "Images, compose" },
      { id: "cloud", title: "Cloud", subtitle: "Azure / AWS" },
      { id: "cdn", title: "CDN", subtitle: "Edges, caching" },
      { id: "secrets", title: "Secrets", subtitle: "Vault / KMS" },
      { id: "monitor", title: "Monitoring", subtitle: "Grafana" },
      { id: "network", title: "Networking", subtitle: "TLS, DNS" },
    ],
  },
  {
    name: "AI",
    cards: [
      { id: "llm", title: "LLMs", subtitle: "Prompting, tools" },
      { id: "rag", title: "RAG", subtitle: "Chunking, evals" },
      { id: "vector", title: "Vector DB", subtitle: "Qdrant" },
      { id: "eval", title: "Evaluation", subtitle: "Harnesses" },
      { id: "agents", title: "Agents", subtitle: "Orchestration" },
      { id: "realtime", title: "Realtime", subtitle: "Live UIs" },
    ],
  },
];

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function SkillsSection() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [modalCard, setModalCard] = useState<{ title: string; subtitle?: string } | null>(null);

  const currCards = CATEGORIES[categoryIndex].cards;
  const lastCategory = CATEGORIES.length - 1;

  // Left / Right → slide the row (cards move; title fixed)
  const prevCard = () => setCardIndex((i) => (i - 1 + currCards.length) % currCards.length);
  const nextCard = () => setCardIndex((i) => (i + 1) % currCards.length);

  // Non-passive wheel handling on the container so we can truly prevent page scrolling
  const containerRef = useRef<HTMLDivElement>(null);
  const catRef = useRef(categoryIndex);
  const lastWheelAt = useRef(0);

  useEffect(() => { catRef.current = categoryIndex; }, [categoryIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      const dir = e.deltaY > 0 ? 1 : -1; // down = next category
      const idx = catRef.current;

      const atTop = idx === 0;
      const atBottom = idx === lastCategory;
      const canGo = (dir > 0 && !atBottom) || (dir < 0 && !atTop);

      if (canGo) {
        e.preventDefault(); // block page scroll
        // one step per ~140ms to feel crisp on trackpads
        if (now - lastWheelAt.current > 140) {
          setCategoryIndex((prev) => clamp(prev + dir, 0, lastCategory));
          setCardIndex(0);
          lastWheelAt.current = now;
        }
      } else {
        // At an edge → allow page to scroll (do NOT preventDefault)
      }
    };

    // critical: passive:false so preventDefault actually works
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel as any);
  }, [lastCategory]);

  // (Optional) touch scrolling inside the scene with the same edge logic
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startY = 0;
    let moved = false;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      moved = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      const dy = startY - e.touches[0].clientY; // >0 means swipe up → next category
      if (Math.abs(dy) < 8) return;
      const dir = dy > 0 ? 1 : -1;

      const idx = catRef.current;
      const atTop = idx === 0;
      const atBottom = idx === lastCategory;
      const canGo = (dir > 0 && !atBottom) || (dir < 0 && !atTop);

      if (canGo) {
        e.preventDefault();
        if (!moved) {
          setCategoryIndex((prev) => clamp(prev + dir, 0, lastCategory));
          setCardIndex(0);
          moved = true;
        }
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onTouchStart as any);
      el.removeEventListener("touchmove", onTouchMove as any);
    };
  }, [lastCategory]);

  const sceneData = useMemo(
    () => CATEGORIES.map((c) => ({ name: c.name, cards: c.cards.map(({ title, subtitle }) => ({ title, subtitle })) })),
    []
  );

  return (
    <section id="skills" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 scroll-mt-28">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-md bg-slate-900/5 dark:bg-white/10 px-2 py-1">
            Category: <b>{CATEGORIES[categoryIndex].name}</b>
          </span>
          <span className="rounded-md bg-slate-900/5 dark:bg-white/10 px-2 py-1">
            Card: <b>{cardIndex + 1}</b> / {currCards.length}
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative mt-5 rounded-2xl ring-1 ring-slate-900/10 dark:ring-white/10 bg-white/60 dark:bg-white/5 overflow-hidden"
        style={{ touchAction: "none" }}
      >
        {/* Buttons on top of canvas so clicks never hit the card */}
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-between px-3">
          <button
            onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onClick={(e) => { e.stopPropagation(); prevCard(); }}
            className="pointer-events-auto rounded-full p-2 bg-white/70 dark:bg-slate-900/70 ring-1 ring-black/10 dark:ring-white/10 hover:brightness-105"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onClick={(e) => { e.stopPropagation(); nextCard(); }}
            className="pointer-events-auto rounded-full p-2 bg-white/70 dark:bg-slate-900/70 ring-1 ring-black/10 dark:ring-white/10 hover:brightness-105"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Scene */}
        <div className="h-[68vh] min-h-[520px]">
          <SkillsScene
            categories={sceneData}
            activeCategory={categoryIndex}
            activeCard={cardIndex}
            onSelect={(c) => setModalCard(c)}
          />
        </div>
      </div>

      {/* Modal */}
      {modalCard && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setModalCard(null)}
        >
          <div
            className="w-full max-w-4xl rounded-xl bg-white dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-white/10 grid md:grid-cols-2 gap-6 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[3/4] rounded-lg ring-1 ring-slate-900/10 dark:ring-white/10 overflow-hidden">
              <SkillsScene
                categories={[{ name: CATEGORIES[categoryIndex].name, cards: [modalCard] }]}
                activeCategory={0}
                activeCard={0}
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold">{modalCard.title}</h3>
                <button
                  onClick={() => setModalCard(null)}
                  className="rounded-md p-2 hover:bg-slate-900/5 dark:hover:bg-white/5"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {modalCard.subtitle ?? "Detailed description coming soon…"}
              </p>
              <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Replace with real skill details, links, badges, etc.
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

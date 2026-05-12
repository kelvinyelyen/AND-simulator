import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

const phases = [
  {
    id: 1,
    label: "Part 1",
    title: "The Foundations",
    subtitle: "Input & Integration",
    color: "emerald",
    labs: [
      {
        num: 1,
        slug: "/labs/linear-algebra",
        title: "Signal Integration",
        subtitle: "Linear Algebra & The Geometry of Inputs",
      },
      {
        num: 2,
        slug: "/labs/diff-eqn",
        title: "Membrane Dynamics",
        subtitle: "Differential Equations & Stability Analysis",
      },
      {
        num: 3,
        slug: "/labs/probability",
        title: "Neural Stochasticity",
        subtitle: "Probability, Noise & Information Coding",
      },
    ],
  },
  {
    id: 2,
    label: "Part 2",
    title: "The Action Potential",
    subtitle: "Spike Generation",
    color: "blue",
    labs: [
      {
        num: 4,
        slug: "/labs/lif",
        title: "LIF Synthesis",
        subtitle: "Simulating the First Artificial Neuron",
      },
      {
        num: 5,
        slug: "/labs/phase-space",
        title: "Phase Space Biophysics",
        subtitle: "The Geometry of the Spike",
      },
      {
        num: 6,
        slug: "/labs/hodgkin-huxley",
        title: "The Hodgkin-Huxley Engine",
        subtitle: "Ion Channel Conductance",
      },
    ],
  },
  {
    id: 3,
    label: "Part 3",
    title: "Connectivity & Plasticity",
    subtitle: "Learning",
    color: "amber",
    labs: [
      {
        num: 7,
        slug: "/labs/synapse",
        title: "Synaptic Mechanics",
        subtitle: "Chemical Transmission",
      },
      {
        num: 8,
        slug: "/labs/stdp",
        title: "STDP & Hebbian Learning",
        subtitle: "Temporal Causality",
      },
    ],
  },
  {
    id: 4,
    label: "Part 4",
    title: "Systems & Populations",
    subtitle: "Emergent Behavior",
    color: "rose",
    labs: [
      {
        num: 9,
        slug: "/labs/population",
        title: "Population Feedback",
        subtitle: "E-I Dynamics",
      },
      {
        num: 10,
        slug: "/labs/decoding",
        title: "Neural Decoding",
        subtitle: "Tuning Curves & Information Theory",
      },
    ],
  },
];

const colorMap: Record<string, { dot: string; num: string; border: string }> = {
  emerald: { dot: "bg-emerald-500", num: "text-emerald-600", border: "border-emerald-500/10" },
  blue: { dot: "bg-blue-500", num: "text-blue-600", border: "border-blue-500/10" },
  amber: { dot: "bg-amber-500", num: "text-amber-600", border: "border-amber-500/10" },
  rose: { dot: "bg-rose-500", num: "text-rose-600", border: "border-rose-500/10" },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">

      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white">Applied Neural Dynamics</h1>
          </div>
          <Link
            href="/syllabus"
            className="flex items-center gap-2 text-[11px] text-zinc-500 hover:text-emerald-400 transition-colors px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-emerald-500/30 bg-zinc-900/50"
          >
            <BookOpen className="w-3 h-3" />
            Syllabus
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-8 py-16">
        <div className="space-y-16">
          {phases.map((phase) => {
            const colors = colorMap[phase.color];
            return (
              <section key={phase.id}>
                {/* Phase Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${colors.num}`}>
                    {phase.label}
                  </span>
                  <span className="text-[10px] text-zinc-700 uppercase tracking-wider">—</span>
                  <span className="text-xs text-zinc-400 font-medium">{phase.title}</span>
                  <span className="text-[10px] text-zinc-600 italic hidden sm:inline">({phase.subtitle})</span>
                </div>

                {/* Labs */}
                <ul className={`space-y-1 border-l ${colors.border} ml-[3px] pl-6`}>
                  {phase.labs.map((lab) => (
                    <li key={lab.slug}>
                      <Link
                        href={lab.slug}
                        className="group flex items-center justify-between py-3 px-4 -mx-4 rounded-lg hover:bg-zinc-900/60 transition-all duration-200"
                      >
                        <div className="flex items-baseline gap-3">
                          <span className={`text-[10px] font-black tabular-nums ${colors.num} opacity-50 group-hover:opacity-100 transition-opacity w-5`}>
                            {String(lab.num).padStart(2, '0')}
                          </span>
                          <div>
                            <span className="text-sm font-medium tracking-tight text-zinc-200 group-hover:text-white transition-colors">
                              {lab.title}
                            </span>
                            <p className="mt-0.5 text-[11px] text-zinc-600 leading-snug group-hover:text-zinc-500 transition-colors">
                              {lab.subtitle}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-3 w-3 text-zinc-800 group-hover:text-zinc-500 transition-all duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}

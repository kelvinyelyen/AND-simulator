import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-mono">

      {/* Header */}
      <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white">Neural Circuit Dynamics <span className="text-[10px] text-neutral-500 italic hidden sm:inline">In silico</span></h1>
          </div>
          <Link
            href="/overview"
            className="text-[11px] text-neutral-500 hover:text-teal-400 transition-colors"
          >
            Overview
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-8 py-16">
        <div className="space-y-16">
          {phases.map((phase) => {
            return (
              <section key={phase.id}>
                {/* Phase Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500/80" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                    {phase.label}
                  </span>
                  <span className="text-[10px] text-neutral-700 uppercase tracking-wider">—</span>
                  <span className="text-xs text-neutral-300 font-medium">{phase.title}</span>
                  <span className="text-[10px] text-neutral-500 italic hidden sm:inline">({phase.subtitle})</span>
                </div>

                {/* Labs */}
                <ul className="space-y-1 border-l border-teal-500/20 ml-[3px] pl-6">
                  {phase.labs.map((lab) => (
                    <li key={lab.slug}>
                      <Link
                        href={lab.slug}
                        className="group flex items-center justify-between py-3 px-4 -mx-4 rounded-lg hover:bg-neutral-900/50 transition-all duration-200"
                      >
                        <div className="flex items-baseline gap-3">
                          <span className="text-[10px] font-black tabular-nums text-neutral-500 opacity-50 group-hover:opacity-100 transition-opacity w-5">
                            {String(lab.num).padStart(2, '0')}
                          </span>
                          <div>
                            <span className="text-sm font-medium tracking-tight text-white group-hover:text-teal-100 transition-colors">
                              {lab.title}
                            </span>
                            <p className="mt-0.5 text-[11px] text-neutral-500 leading-snug group-hover:text-neutral-400 transition-colors">
                              {lab.subtitle}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-3 w-3 text-neutral-700 group-hover:text-teal-500/70 transition-all duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 mt-24">
        <div className="max-w-4xl mx-auto px-8 py-8 flex items-center justify-between">
          <span className="text-[10px] text-neutral-600">NCDL — Neural Circuit Dynamics Lab</span>
          <a href="https://github.com/kelvinyelyen/neural-circuit-dynamics" target="_blank" rel="noopener noreferrer" className="text-[10px] text-neutral-500 hover:text-teal-400 transition-colors">
            GitHub ↗
          </a>
        </div>
      </footer>
    </div>
  );
}

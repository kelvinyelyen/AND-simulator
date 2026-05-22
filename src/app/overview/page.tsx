'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ArrowLeft, FlaskConical, Lightbulb, Cpu } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface LabEntry {
  num: number;
  title: string;
  slug: string;
  concept: React.ReactNode;
  analogy: React.ReactNode;
  math: React.ReactNode;
  code: string;
}

interface PhaseData {
  id: number;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  labs: LabEntry[];
}

const phases: PhaseData[] = [
  {
    id: 1,
    label: "Part 1",
    title: "The Foundations",
    subtitle: "Input & Integration",
    description: "Establishing how a biological system processes the raw physics of its environment.",
    color: "emerald",
    labs: [
      {
        num: 1,
        title: "Signal Integration",
        slug: "/labs/linear-algebra",
        concept: (
          <span>A neuron receives thousands of inputs across its dendritic tree. This is fundamentally a geometric problem of <strong>spatial summation</strong>.</span>
        ),
        analogy: (
          <span><strong>The Corporate Boardroom.</strong> A CEO (soma) takes a vote. Not all board members (inputs) have the same equity. The CEO calculates the dot product: multiplying each member&apos;s vote by their specific voting power (dendritic weight) and summing it to reach a consensus.</span>
        ),
        math: (
          <div className="space-y-2">
            <p className="text-xs text-zinc-400">The membrane voltage response at the soma is the linear combination of inputs <InlineMath math="x" /> and synaptic weights <InlineMath math="w" />.</p>
            <BlockMath math="y = \sum_{i=1}^{N} w_i x_i = \mathbf{w}^T \mathbf{x}" />
          </div>
        ),
        code: "Use NumPy dot products. Create an input vector x (binary spike presence: 0 or 1) and a weight matrix W. This lab proves that a single biological layer is mathematically equivalent to a linear perceptron.",
      },
      {
        num: 2,
        title: "Membrane Dynamics",
        slug: "/labs/diff-eqn",
        concept: (
          <span>Biology is not instantaneous. The lipid bilayer of the cell acts as an insulator (capacitor), while ion channels act as resistors.</span>
        ),
        analogy: (
          <span><strong>The Leaky Bucket.</strong> You pour water (current) into a bucket with a small hole. To raise the water level (voltage), you must pour water in faster than it can escape.</span>
        ),
        math: (
          <div className="space-y-2">
            <p className="text-xs text-zinc-400">Modeled as an RC circuit. The rate of change of voltage <InlineMath math="V" /> depends on the membrane time constant <InlineMath math="\tau_m = R_m C_m" />.</p>
            <BlockMath math="\tau_m \frac{dV}{dt} = -(V - E_L) + R_m I_e(t)" />
            <p className="text-xs text-zinc-500">Where <InlineMath math="E_L" /> is the resting leak potential (usually <InlineMath math="-70\text{mV}" />), and <InlineMath math="I_e" /> is the external current.</p>
          </div>
        ),
        code: "Use Euler's Method to solve the ODE numerically. Update V at each discrete time step dt: V(t+dt) = V(t) + (dt/τ_m)[−(V(t)−E_L) + R_m·I_e(t)]",
      },
      {
        num: 3,
        title: "Neural Stochasticity",
        slug: "/labs/probability",
        concept: (
          <span>The brain is noisy. Neurotransmitter vesicle release is probabilistic.</span>
        ),
        analogy: (
          <span><strong>The Crowded Party.</strong> Listening to a friend in a loud room. Background &quot;chatter&quot; actually keeps the neuron hovering close to its threshold, making it highly reactive to sudden signals (Stochastic Resonance).</span>
        ),
        math: (
          <div className="space-y-2">
            <p className="text-xs text-zinc-400">Spike trains are modeled as a Homogeneous Poisson Process. The probability of observing <InlineMath math="k" /> spikes in a time interval is:</p>
            <BlockMath math="P(k) = \frac{(\lambda T)^k e^{-\lambda T}}{k!}" />
            <p className="text-xs text-zinc-500">Where <InlineMath math="\lambda" /> is the mean firing rate.</p>
          </div>
        ),
        code: "Generate Poisson spike trains using random number generators. Compare the Fano Factor (variance/mean) of your generated spikes to real cortical data (which is usually around 1.0).",
      },
    ],
  },
  {
    id: 2,
    label: "Part 2",
    title: "The Action Potential",
    subtitle: "Spike Generation",
    description: "Transitioning from passive linear summation to active, non-linear computation.",
    color: "blue",
    labs: [
      {
        num: 4,
        title: "LIF Synthesis",
        slug: "/labs/lif",
        concept: (
          <span>The Leaky Integrate-and-Fire (LIF) model introduces a <strong>hard threshold</strong> to Lab 2.</span>
        ),
        analogy: (
          <span><strong>The Flushing Toilet.</strong> Water accumulates until a mechanical tipping point. The flush is an all-or-nothing event (the spike), followed by a mandatory refilling phase where it cannot flush again (refractory period).</span>
        ),
        math: (
          <div className="space-y-2">
            <p className="text-xs text-zinc-400">We use the ODE from Lab 2, but inject a discontinuous logical rule:</p>
            <BlockMath math="\text{If } V(t) \ge V_{th}, \text{ then } V(t) \to V_{reset}" />
          </div>
        ),
        code: "Track the voltage. When V > −55mV, record a spike at time t, instantly set V = −65mV, and force V to stay at −65mV for 2ms (the refractory constraint).",
      },
      {
        num: 5,
        title: "Phase Space Biophysics",
        slug: "/labs/phase-space",
        concept: (
          <span>To truly understand stability, we map the system&apos;s geometry using a <strong>2D Phase Plane</strong> rather than a 1D time-series.</span>
        ),
        analogy: (
          <span><strong>The Topographic Map.</strong> Instead of hiking blindly, you look at a map from above. The nullclines are the ridges and valleys. You can predict exactly where a state variable will roll.</span>
        ),
        math: (
          <div className="space-y-2">
            <p className="text-xs text-zinc-400">We reduce the neuron to two variables: Voltage (<InlineMath math="V" />) and a slow recovery variable (<InlineMath math="w" />). We plot the Nullclines (where <InlineMath math="\frac{dV}{dt} = 0" /> and <InlineMath math="\frac{dw}{dt} = 0" />).</p>
          </div>
        ),
        code: "Plot V on the X-axis and w on the Y-axis. Calculate the vector field using np.meshgrid. You will visually identify the \u201cFixed Points\u201d (resting state) and the \u201cLimit Cycle\u201d (continuous spiking trajectory).",
      },
      {
        num: 6,
        title: "The Hodgkin-Huxley Engine",
        slug: "/labs/hodgkin-huxley",
        concept: (
          <span>Removing the manual LIF reset. We simulate the actual <strong>voltage-gated ion channels</strong> that physically generate the action potential.</span>
        ),
        analogy: (
          <span><strong>Pressure-Sensitive Floodgates.</strong> A dam where gates open automatically under pressure. Sodium gates burst open causing a flood (depolarization), which physically triggers Potassium gates to open, draining the excess (repolarization).</span>
        ),
        math: (
          <div className="space-y-2">
            <p className="text-xs text-zinc-400">The membrane acts as a parallel circuit with variable conductances (<InlineMath math="g" />).</p>
            <BlockMath math="C_m \frac{dV}{dt} = I_e - I_{Na} - I_K - I_L" />
            <BlockMath math="I_{Na} = g_{Na}m^3h(V - E_{Na})" />
            <BlockMath math="I_K = g_K n^4(V - E_K)" />
            <p className="text-xs text-zinc-500">Where <InlineMath math="m, h, n" /> are gating variables (probabilities between 0 and 1) governed by their own differential equations.</p>
          </div>
        ),
        code: "This requires solving a system of four coupled non-linear ODEs simultaneously.",
      },
    ],
  },
  {
    id: 3,
    label: "Part 3",
    title: "Connectivity & Plasticity",
    subtitle: "Learning",
    description: "How the architecture mathematically alters its own weights based on temporal experience.",
    color: "amber",
    labs: [
      {
        num: 7,
        title: "Synaptic Mechanics",
        slug: "/labs/synapse",
        concept: (
          <span>Spikes are electrical, but synapses are chemical. The binary spike must be converted into a <strong>continuous, decaying conductance change</strong> in the postsynaptic neuron.</span>
        ),
        analogy: (
          <span><strong>The Chemical Ferry.</strong> You drive a car (electrical spike) to a river (synaptic cleft). You must load cargo onto a ferry (neurotransmitters), which drifts across to unlock gates on the other side.</span>
        ),
        math: (
          <div className="space-y-2">
            <p className="text-xs text-zinc-400">Modeled using an &quot;Alpha Function&quot; to simulate the rise and exponential decay of synaptic conductance (<InlineMath math="g_{syn}" />).</p>
            <BlockMath math="g_{syn}(t) = \bar{g}_{syn} \frac{t}{\tau_{syn}} e^{1 - \frac{t}{\tau_{syn}}}" />
          </div>
        ),
        code: "When the presynaptic neuron fires, trigger this function to temporarily increase the conductance in the postsynaptic neuron's differential equation, altering its voltage.",
      },
      {
        num: 8,
        title: "STDP & Hebbian Learning",
        slug: "/labs/stdp",
        concept: (
          <span>Spike-Timing-Dependent Plasticity (STDP). The precise <strong>millisecond timing</strong> of pre- and post-synaptic spikes dictates whether a weight increases (LTP) or decreases (LTD).</span>
        ),
        analogy: (
          <span><strong>The Perfect High-Five.</strong> If Neuron A reaches out and Neuron B meets it at the exact same millisecond, there is a perfect connection (LTP). If A swings too early or too late, it&apos;s awkward, and the connection weakens (LTD).</span>
        ),
        math: (
          <div className="space-y-2">
            <p className="text-xs text-zinc-400">Weight changes (<InlineMath math="\Delta w" />) are an exponential function of the time difference (<InlineMath math="\Delta t = t_{post} - t_{pre}" />).</p>
            <BlockMath math="\Delta w = \begin{cases} A_+ e^{-\Delta t / \tau_+} & \text{if } \Delta t > 0 \\ -A_- e^{\Delta t / \tau_-} & \text{if } \Delta t < 0 \end{cases}" />
          </div>
        ),
        code: "Track the spike times of two connected LIF neurons. Continuously update the synaptic weight matrix W based on the Δt window.",
      },
    ],
  },
  {
    id: 4,
    label: "Part 4",
    title: "Systems & Populations",
    subtitle: "Emergent Behavior",
    description: "Scaling up: Thoughts, rhythms, and computations only appear in network dynamics.",
    color: "rose",
    labs: [
      {
        num: 9,
        title: "Population Feedback",
        slug: "/labs/population",
        concept: (
          <span>Brains require <strong>Excitatory (E) and Inhibitory (I) balance</strong>. Without inhibition, networks suffer from runaway excitation (seizures).</span>
        ),
        analogy: (
          <span><strong>The Predator-Prey Ecosystem.</strong> Excitatory neurons are rabbits; Inhibitory are wolves. If rabbits multiply, wolves eat them, driving activity down, allowing rabbits to recover. This creates stable brain waves (oscillations).</span>
        ),
        math: (
          <div className="space-y-2">
            <p className="text-xs text-zinc-400">The Wilson-Cowan equations use Mean-Field Theory to model the firing rates of populations.</p>
            <BlockMath math="\tau_E \frac{dE}{dt} = -E + f(w_{EE}E - w_{EI}I + I_{ext})" />
            <BlockMath math="\tau_I \frac{dI}{dt} = -I + f(w_{IE}E - w_{II}I)" />
            <p className="text-xs text-zinc-500">Where <InlineMath math="f(x)" /> is a non-linear sigmoid activation function.</p>
          </div>
        ),
        code: "Build a network of 800 Excitatory and 200 Inhibitory LIF neurons. Tune the W_EI and W_IE weights until the entire population shows synchronous, rhythmic bursting.",
      },
      {
        num: 10,
        title: "Neural Decoding",
        slug: "/labs/decoding",
        concept: (
          <span>Reverse-engineering the spike code. If a network receives a stimulus, how mathematically certain can we be about <strong>what the network &quot;saw&quot;</strong>?</span>
        ),
        analogy: (
          <span><strong>The Expert Detective.</strong> You only have the tapped-out Morse code from informants (spike trains). By analyzing the frequency of the taps, you mathematically reconstruct the suspect&apos;s face.</span>
        ),
        math: (
          <div className="space-y-2">
            <p className="text-xs text-zinc-400">Calculating Shannon Entropy (<InlineMath math="H" />) and Mutual Information to quantify how many &quot;bits&quot; of data the spike train contains about the stimulus.</p>
            <BlockMath math="H(X) = -\sum P(x) \log_2 P(x)" />
          </div>
        ),
        code: "Feed your network different stimulus angles (e.g., 0° to 180°). Plot a Tuning Curve (Firing Rate vs. Stimulus Angle). Use Maximum Likelihood Estimation (MLE) to predict which angle caused the spikes.",
      },
    ],
  },
];

const colorMap: Record<string, { dot: string; text: string; heading: string; border: string; bg: string }> = {
  emerald: { dot: "bg-emerald-500", text: "text-emerald-500", heading: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
  blue: { dot: "bg-blue-500", text: "text-blue-500", heading: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" },
  amber: { dot: "bg-amber-500", text: "text-amber-500", heading: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5" },
  rose: { dot: "bg-rose-500", text: "text-rose-500", heading: "text-rose-400", border: "border-rose-500/20", bg: "bg-rose-500/5" },
};

export default function SyllabusPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-mono">

      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-8 py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-xs">Labs</span>
          </Link>
          <span className="text-zinc-800">|</span>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            <h1 className="text-sm font-bold text-white tracking-tight">Overview</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-16">

        {/* Intro */}
        <div className="mb-20">
          <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
            The brain is a dynamic, physical system computing over time. This syllabus bridges descriptive neuroscience and high-level artificial intelligence by constructing the biological engine from the ground up — moving from physics, to single-cell logic, to network emergence.
          </p>
        </div>

        {/* Phases */}
        <div className="space-y-24">
          {phases.map((phase) => {
            const c = colorMap[phase.color];
            return (
              <section key={phase.id}>
                {/* Phase Header */}
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                    <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${c.text}`}>
                      {phase.label}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">{phase.title}</h2>
                  <p className="text-xs text-zinc-500 mt-1 italic">{phase.subtitle}</p>
                  <p className="text-sm text-zinc-500 mt-3 leading-relaxed max-w-xl">{phase.description}</p>
                </div>

                {/* Labs */}
                <div className="space-y-12">
                  {phase.labs.map((lab) => (
                    <article key={lab.num} className={`rounded-xl border ${c.border} overflow-hidden`}>
                      {/* Lab Header */}
                      <div className={`px-6 py-4 ${c.bg} border-b ${c.border} flex items-center justify-between`}>
                        <div className="flex items-baseline gap-3">
                          <span className={`text-[11px] font-black tabular-nums ${c.text} opacity-60`}>
                            {String(lab.num).padStart(2, '0')}
                          </span>
                          <h3 className="text-sm font-bold text-white tracking-tight">{lab.title}</h3>
                        </div>
                        <Link href={lab.slug} className={`text-[10px] font-bold uppercase tracking-widest ${c.text} hover:text-white transition-colors`}>
                          Open Lab →
                        </Link>
                      </div>

                      <div className="px-6 py-5 space-y-5 bg-zinc-950/50">
                        {/* Concept */}
                        <div className="flex gap-3">
                          <Lightbulb className="w-3.5 h-3.5 text-zinc-700 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 block mb-1">The Concept</span>
                            <p className="text-xs text-zinc-400 leading-relaxed">{lab.concept}</p>
                          </div>
                        </div>

                        {/* Analogy */}
                        <div className="flex gap-3">
                          <FlaskConical className="w-3.5 h-3.5 text-zinc-700 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 block mb-1">The Analogy</span>
                            <p className="text-xs text-zinc-400 leading-relaxed italic">{lab.analogy}</p>
                          </div>
                        </div>

                        {/* Math */}
                        <div className="flex gap-3">
                          <span className="text-zinc-700 mt-0.5 shrink-0 text-xs font-bold">∫</span>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 block mb-2">The Math</span>
                            <div className="bg-black/30 rounded-lg p-4 border border-zinc-800/30 overflow-x-auto">
                              {lab.math}
                            </div>
                          </div>
                        </div>

                        {/* Code */}
                        <div className="flex gap-3">
                          <Cpu className="w-3.5 h-3.5 text-zinc-700 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 block mb-1">Implementation</span>
                            <p className="text-xs text-zinc-500 leading-relaxed">{lab.code}</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 mt-24">
        <div className="max-w-4xl mx-auto px-8 py-8 flex items-center justify-between">
          <span className="text-[10px] text-zinc-700">NCDL — Neural Circuit Dynamics Lab</span>
          <Link href="/" className="text-[10px] text-zinc-600 hover:text-emerald-400 transition-colors">
            ← Back to Labs
          </Link>
        </div>
      </footer>
    </div>
  );
}

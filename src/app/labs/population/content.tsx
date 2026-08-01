import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export const populationContent = {
    title: "Population Feedback",
    subtitle: "E-I Dynamics",
    sections: [
        {
            title: "Wilson-Cowan Model",
            color: "emerald",
            content: (
                <div className="p-4 bg-neutral-900/40 rounded-lg border border-neutral-800/50 text-sm leading-relaxed text-neutral-300 shadow-inner">
                    <p className="mb-3">Instead of simulating thousands of individual neurons, we track the <strong className="text-teal-400">average firing rates</strong> of two populations:</p>
                    <div className="font-mono bg-black/50 p-3 rounded text-center text-neutral-200 mb-3 space-y-1">
                        <BlockMath math="\tau_E \frac{dE}{dt} = -E + f(W_{EE}E - W_{EI}I + I_{ext})" />
                        <BlockMath math="\tau_I \frac{dI}{dt} = -I + f(W_{IE}E - W_{II}I)" />
                    </div>
                    <p className="text-neutral-400">
                        Where <InlineMath math="f(x)" /> is a sigmoidal activation function that maps total input to a firing rate between 0 and 1.
                    </p>
                </div>
            )
        },
        {
            title: "Emergent Oscillations",
            color: "blue",
            content: (
                <div className="p-4 bg-neutral-900/40 rounded-lg border border-neutral-800/50 text-sm leading-relaxed text-neutral-300 shadow-inner">
                    <p className="mb-3">The system can spontaneously &quot;breathe&quot; through a feedback loop:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li><InlineMath math="E" /> excites itself (<InlineMath math="W_{EE}" />) and the <InlineMath math="I" /> population (<InlineMath math="W_{IE}" />).</li>
                        <li><InlineMath math="I" /> builds up and suppresses <InlineMath math="E" /> (<InlineMath math="W_{EI}" />).</li>
                        <li>With <InlineMath math="E" /> suppressed, <InlineMath math="I" /> loses its drive and decays.</li>
                        <li><InlineMath math="E" /> is released from inhibition and the cycle restarts.</li>
                    </ol>
                    <p className="mt-3 text-neutral-400 italic border-l-2 border-neutral-800 pl-3">
                        These oscillations are akin to brain waves (gamma, beta, theta rhythms) measured by EEG.
                    </p>
                </div>
            )
        },
        {
            title: "Phase Plane Analysis",
            color: "rose",
            content: (
                <div className="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800/50 text-sm leading-relaxed text-neutral-400">
                    <p>
                        By plotting <InlineMath math="E" /> vs. <InlineMath math="I" />, we can observe <strong className="text-teal-400">limit cycles</strong> — closed orbits in the phase plane indicating stable, self-sustaining oscillations.
                    </p>
                    <p className="mt-3">
                        Try increasing <InlineMath math="W_{EE}" /> and <InlineMath math="I_{ext}" /> to push the system from a stable fixed point into oscillatory dynamics.
                    </p>
                </div>
            )
        }
    ]
};

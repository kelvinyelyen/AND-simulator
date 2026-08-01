import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export const synapseContent = {
    title: "Synaptic Mechanics",
    subtitle: "Chemical Transmission",
    sections: [
        {
            title: "The Synaptic Cleft",
            color: "emerald",
            content: (
                <div className="p-4 bg-neutral-900/40 rounded-lg border border-neutral-800/50 text-sm leading-relaxed text-neutral-300 shadow-inner">
                    <p>
                        When an action potential reaches the axon terminal, it triggers the release of <strong className="text-teal-400">neurotransmitters</strong> into the synaptic cleft.
                    </p>
                    <p className="mt-3 text-neutral-400">
                        These molecules bind to receptors on the post-synaptic neuron, opening ion channels and producing a transient change in conductance <InlineMath math="g_{syn}" />.
                    </p>
                </div>
            )
        },
        {
            title: "Conductance Model",
            color: "blue",
            content: (
                <div className="p-4 bg-neutral-900/40 rounded-lg border border-neutral-800/50 text-sm leading-relaxed text-neutral-300 shadow-inner">
                    <p className="mb-3">We model the synapse with two equations:</p>
                    <div className="font-mono bg-black/50 p-3 rounded text-center text-neutral-200 mb-3 space-y-1">
                        <BlockMath math="\frac{dg_{syn}}{dt} = -\frac{g_{syn}}{\tau_{syn}}" />
                        <BlockMath math="I_{syn} = g_{syn}(V - E_{syn})" />
                    </div>
                    <ul className="space-y-2 ml-1">
                        <li className="flex items-start gap-2">
                            <div className="mt-1.5 w-1 h-1 bg-teal-500 rounded-full shrink-0" />
                            <span>On a pre-synaptic spike, <InlineMath math="g_{syn}" /> jumps by <InlineMath math="g_{max}" /> then decays exponentially.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="mt-1.5 w-1 h-1 bg-teal-500 rounded-full shrink-0" />
                            <span><InlineMath math="\tau_{syn}" /> controls how long the channel stays open.</span>
                        </li>
                    </ul>
                </div>
            )
        },
        {
            title: "Excitation vs. Inhibition",
            color: "amber",
            content: (
                <div className="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800/50 text-sm leading-relaxed text-neutral-400">
                    <p>
                        Whether a synapse is <strong className="text-teal-400">excitatory</strong> (EPSP) or <strong className="text-teal-400">inhibitory</strong> (IPSP) depends on the reversal potential <InlineMath math="E_{syn}" />:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                        <li>If <InlineMath math="E_{syn} > V_{rest}" /> (e.g. 0 mV), current flows <em>in</em> → depolarization (excitatory)</li>
                        <li>If <InlineMath math="E_{syn} < V_{rest}" /> (e.g. −80 mV), current flows <em>out</em> → hyperpolarization (inhibitory)</li>
                    </ul>
                    <p className="mt-3 text-neutral-500 italic border-l-2 border-neutral-800 pl-3">
                        Try setting <InlineMath math="E_{syn}" /> below <InlineMath math="E_L" /> to see how the synapse becomes inhibitory!
                    </p>
                </div>
            )
        }
    ]
};

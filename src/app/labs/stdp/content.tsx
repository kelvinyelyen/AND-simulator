import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export const stdpContent = {
    title: "STDP & Hebbian Learning",
    subtitle: "Temporal Causality",
    sections: [
        {
            title: "The Learning Rule",
            color: "emerald",
            content: (
                <div className="p-4 bg-neutral-900/40 rounded-lg border border-neutral-800/50 text-sm leading-relaxed text-neutral-300 shadow-inner">
                    <div className="font-mono bg-black/50 p-3 rounded text-center text-neutral-200 mb-3">
                        <BlockMath math="\Delta w = \begin{cases} A_+ e^{-\Delta t / \tau_+} & \text{if } \Delta t > 0 \text{ (LTP)} \\ -A_- e^{\Delta t / \tau_-} & \text{if } \Delta t < 0 \text{ (LTD)} \end{cases}" />
                    </div>
                    <p>
                        Where <InlineMath math="\Delta t = t_{post} - t_{pre}" />. A positive <InlineMath math="\Delta t" /> means the pre-synaptic neuron fired <strong className="text-teal-400">before</strong> the post-synaptic neuron.
                    </p>
                </div>
            )
        },
        {
            title: "Hebbian Causality",
            color: "blue",
            content: (
                <div className="p-4 bg-neutral-900/40 rounded-lg border border-neutral-800/50 text-sm leading-relaxed text-neutral-300 shadow-inner">
                    <p className="mb-3">&quot;Neurons that fire together, wire together:&quot;</p>
                    <ul className="space-y-2 ml-1">
                        <li className="flex items-start gap-2">
                            <div className="mt-1.5 w-1 h-1 bg-teal-500 rounded-full shrink-0" />
                            <span><strong className="text-teal-400">LTP</strong> (<InlineMath math="\Delta t > 0" />): Pre fires <em>before</em> Post → the input helped <em>cause</em> the spike → <strong>strengthen</strong> the synapse.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="mt-1.5 w-1 h-1 bg-teal-500 rounded-full shrink-0" />
                            <span><strong className="text-teal-400">LTD</strong> (<InlineMath math="\Delta t < 0" />): Pre fires <em>after</em> Post → the input was <em>not causal</em> → <strong>weaken</strong> the synapse.</span>
                        </li>
                    </ul>
                </div>
            )
        },
        {
            title: "Biological Backprop",
            color: "indigo",
            content: (
                <div className="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800/50 text-sm leading-relaxed text-neutral-400">
                    <p>
                        STDP is often considered a biological analogue to <strong className="text-indigo-400">error backpropagation</strong> in artificial neural networks.
                    </p>
                    <p className="mt-3">
                        It provides a <em>local, unsupervised</em> mechanism for neural circuits to extract causal patterns from temporal sequences — no global error signal required.
                    </p>
                    <p className="mt-3 text-neutral-500 italic border-l-2 border-neutral-800 pl-3">
                        Try pressing <strong>J</strong> (Pre) then <strong>K</strong> (Post) quickly to see <InlineMath math="w" /> increase. Reverse the order to see it decrease!
                    </p>
                </div>
            )
        }
    ]
};

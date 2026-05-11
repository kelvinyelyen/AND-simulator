import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export const decodingContent = {
    title: "Neural Decoding",
    subtitle: "Tuning Curves & Information Theory",
    sections: [
        {
            title: "Tuning Curves",
            color: "emerald",
            content: (
                <div className="p-4 bg-zinc-900/40 rounded-lg border border-zinc-800/50 text-sm leading-relaxed text-zinc-300 shadow-inner">
                    <p className="mb-3">
                        Many neurons are &quot;tuned&quot; to specific stimulus features. Each neuron <InlineMath math="i" /> has a preferred angle <InlineMath math="\phi_i" /> and fires maximally at rate <InlineMath math="f_{max}" /> when the stimulus matches:
                    </p>
                    <div className="font-mono bg-black/50 p-3 rounded text-center text-zinc-200 mb-3">
                        <BlockMath math="\lambda_i(\theta) = f_{max} \exp\left(-\frac{(\theta - \phi_i)^2}{2\sigma^2}\right)" />
                    </div>
                    <p className="text-zinc-400">
                        The parameter <InlineMath math="\sigma" /> controls how broadly each neuron is tuned. Narrow tuning = high precision but less overlap.
                    </p>
                </div>
            )
        },
        {
            title: "Population Coding",
            color: "blue",
            content: (
                <div className="p-4 bg-zinc-900/40 rounded-lg border border-zinc-800/50 text-sm leading-relaxed text-zinc-300 shadow-inner">
                    <p className="mb-3">
                        A single neuron&apos;s firing is <strong className="text-blue-400">noisy</strong> — modeled as a Poisson process:
                    </p>
                    <div className="font-mono bg-black/50 p-3 rounded text-center text-zinc-200 mb-3">
                        <BlockMath math="P(k \text{ spikes}) = \frac{\lambda^k e^{-\lambda}}{k!}" />
                    </div>
                    <p>
                        To reliably decode the stimulus <InlineMath math="\theta" />, we look at the <em>entire population</em> and use <strong>Population Vector Decoding</strong>:
                    </p>
                    <div className="font-mono bg-black/50 p-3 rounded text-center text-zinc-200 mt-3">
                        <BlockMath math="\hat{\theta} = \text{atan2}\left(\sum_i n_i \sin \phi_i,\, \sum_i n_i \cos \phi_i\right)" />
                    </div>
                </div>
            )
        },
        {
            title: "Information Theory",
            color: "amber",
            content: (
                <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800/50 text-sm leading-relaxed text-zinc-400">
                    <p>
                        The accuracy of decoding relates directly to <strong className="text-amber-400">Shannon Information</strong> — how many bits of certainty the spikes provide about the external world.
                    </p>
                    <p className="mt-3">
                        More neurons, longer time windows, and narrower tuning all increase the information carried by the population response.
                    </p>
                    <p className="mt-3 text-zinc-500 italic border-l-2 border-zinc-800 pl-3">
                        Try increasing the time window or reducing <InlineMath math="\sigma" /> to see the decoded angle <InlineMath math="\hat{\theta}" /> converge closer to the true angle <InlineMath math="\theta" />.
                    </p>
                </div>
            )
        }
    ]
};

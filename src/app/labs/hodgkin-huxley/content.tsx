import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export const hodgkinHuxleyContent = {
    title: "The Hodgkin-Huxley Engine",
    subtitle: "Ion Channel Conductance",
    sections: [
        {
            title: "The Full Equation",
            color: "emerald",
            content: (
                <div className="p-4 bg-neutral-900/40 rounded-lg border border-neutral-800/50 text-sm leading-relaxed text-neutral-300 shadow-inner">
                    <div className="font-mono bg-black/50 p-3 rounded text-center text-neutral-200 mb-3">
                        <BlockMath math="C \frac{dV}{dt} = I - g_{Na}m^3h(V - E_{Na}) - g_K n^4(V - E_K) - g_L(V - E_L)" />
                    </div>
                    <p>
                        This models the membrane as a parallel circuit of <strong className="text-teal-400">variable resistors</strong> (ion channels) and a capacitor.
                    </p>
                </div>
            )
        },
        {
            title: "Gating Variables",
            color: "blue",
            content: (
                <div className="p-4 bg-neutral-900/40 rounded-lg border border-neutral-800/50 text-sm leading-relaxed text-neutral-300 shadow-inner">
                    <p className="mb-3">Each ion channel has gates that open and close with voltage:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded">
                            <strong className="text-red-400 text-xs uppercase block mb-1"><InlineMath math="m" /> — Na⁺ Activation</strong>
                            <p className="text-xs text-neutral-400">Opens fast. Lets <InlineMath math="Na^+" /> rush in → depolarization.</p>
                        </div>
                        <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded">
                            <strong className="text-orange-400 text-xs uppercase block mb-1"><InlineMath math="h" /> — Na⁺ Inactivation</strong>
                            <p className="text-xs text-neutral-400">Closes slowly. Blocks <InlineMath math="Na^+" /> after a delay.</p>
                        </div>
                        <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded">
                            <strong className="text-teal-400 text-xs uppercase block mb-1"><InlineMath math="n" /> — K⁺ Activation</strong>
                            <p className="text-xs text-neutral-400">Opens slowly. Lets <InlineMath math="K^+" /> flow out → repolarization.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "The Refractory Period",
            color: "rose",
            content: (
                <div className="p-4 bg-neutral-900/50 rounded-lg border border-neutral-800/50 text-sm leading-relaxed text-neutral-400">
                    <p>
                        The refractory period is <strong className="text-teal-400">not a timer</strong> — it emerges naturally from the physics:
                    </p>
                    <ol className="list-decimal list-inside mt-2 space-y-1 ml-2">
                        <li>After a spike, <InlineMath math="h" /> (Na⁺ inactivation) is near 0 and takes time to recover.</li>
                        <li>Meanwhile, <InlineMath math="n" /> (K⁺ activation) is near 1, keeping the cell hyperpolarized.</li>
                        <li>Until <InlineMath math="h" /> recovers and <InlineMath math="n" /> decays, no new spike is possible.</li>
                    </ol>
                </div>
            )
        }
    ]
};

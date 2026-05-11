import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export const phaseSpaceContent = {
    title: "Phase Space Biophysics",
    subtitle: "The Geometry of the Spike",
    sections: [
        {
            title: "The Phase Portrait",
            color: "emerald",
            content: (
                <div className="p-4 bg-zinc-900/40 rounded-lg border border-zinc-800/50 text-sm leading-relaxed text-zinc-300 shadow-inner">
                    <p>
                        Instead of plotting <InlineMath math="V" /> vs. time, we plot the membrane voltage <InlineMath math="V" /> against a <strong className="text-emerald-400">Recovery Variable</strong> <InlineMath math="W" />.
                    </p>
                    <p className="mt-3 text-zinc-400">
                        This creates a &quot;Phase Space&quot; where the state of the neuron is a single point <InlineMath math="(V, W)" /> that traces an orbit as time evolves.
                    </p>
                </div>
            )
        },
        {
            title: "Nullclines",
            color: "blue",
            content: (
                <div className="p-4 bg-zinc-900/40 rounded-lg border border-zinc-800/50 text-sm leading-relaxed text-zinc-300 shadow-inner">
                    <p className="mb-3">Nullclines are the geometric curves where a variable&apos;s rate of change is zero:</p>
                    <ul className="space-y-2 ml-1">
                        <li className="flex items-start gap-2">
                            <div className="mt-1.5 w-1 h-1 bg-emerald-500 rounded-full shrink-0" />
                            <span><strong className="text-emerald-400">V-Nullcline</strong> (<InlineMath math="dV/dt = 0" />): A cubic curve. The system can only move <em>horizontally</em> when crossing it.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="mt-1.5 w-1 h-1 bg-blue-500 rounded-full shrink-0" />
                            <span><strong className="text-blue-400">W-Nullcline</strong> (<InlineMath math="dW/dt = 0" />): A straight line. The system can only move <em>vertically</em> when crossing it.</span>
                        </li>
                    </ul>
                    <p className="mt-3 text-zinc-400 italic border-l-2 border-zinc-800 pl-3">
                        Where they intersect is the <strong>Fixed Point</strong> (resting state). Increase <InlineMath math="I_{ext}" /> to shift the V-nullcline and destroy the stable rest!
                    </p>
                </div>
            )
        },
        {
            title: "FitzHugh-Nagumo Model",
            color: "amber",
            content: (
                <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800/50 text-sm leading-relaxed text-zinc-400">
                    <p className="mb-3">A 2D simplification of the full Hodgkin-Huxley equations:</p>
                    <div className="font-mono bg-black/50 p-3 rounded text-center text-zinc-200 mb-3 space-y-1">
                        <BlockMath math="\frac{dv}{dt} = v - \frac{v^3}{3} - w + I_{ext}" />
                        <BlockMath math="\frac{dw}{dt} = \frac{1}{\tau}(v + a - bw)" />
                    </div>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                        <li><InlineMath math="v" /> — fast excitation (voltage analogue)</li>
                        <li><InlineMath math="w" /> — slow recovery (channel inactivation analogue)</li>
                        <li><InlineMath math="\tau" /> — time-scale separation between the two</li>
                    </ul>
                </div>
            )
        }
    ]
};

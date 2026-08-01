import React from 'react';
import { cn } from '@/lib/utils';
import { InlineMath } from 'react-katex';

interface WeightMatrixProps {
    gridSize: number;
    weights: number[];
    onWeightChange: (index: number, newWeight: number) => void;
}

export const WeightMatrix: React.FC<WeightMatrixProps> = ({ gridSize, weights, onWeightChange }) => {

    const getWeightColor = (weight: number) => {
        if (weight > 0) {
            // Excitatory - Teal
            const intensity = Math.min(Math.abs(weight), 1);
            return `rgba(20, 184, 166, ${0.2 + intensity * 0.8})`;
        } else if (weight < 0) {
            // Inhibitory - Neutral-500
            const intensity = Math.min(Math.abs(weight), 1);
            return `rgba(239, 68, 68, ${0.2 + intensity * 0.8})`;
        }
        return 'transparent';
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">
                Synaptic Weights (<InlineMath math="\vec{w}" />)
            </h3>
            <div
                className="grid gap-1 p-2 bg-neutral-900 border border-neutral-800 rounded-lg shadow-inner"
                style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
            >
                {weights.map((w, i) => (
                    <div
                        key={i}
                        className={cn(
                            "relative w-12 h-12 sm:w-16 sm:h-16 border rounded cursor-pointer transition-all hover:scale-10 hover:z-10 hover:ring-2 hover:ring-neutral-400 group flex items-center justify-center",
                            w === 0 ? "border-neutral-800 bg-neutral-950" : "border-neutral-700/50"
                        )}
                        style={{ backgroundColor: getWeightColor(w) }}
                        onClick={() => {
                            // Cycle: -1 -> -0.9 ... -> 0 -> ... -> 1 -> -1
                            const nextW = w >= 1 ? -1 : parseFloat((w + 0.1).toFixed(1));
                            onWeightChange(i, nextW);
                        }}
                    >
                        <span className={cn(
                            "text-xs font-mono font-bold",
                            w === 0 ? "text-neutral-700" : "text-white drop-shadow-md"
                        )}>
                            {w === 0 ? '0' : w.toFixed(1)}
                        </span>

                        {/* Index label */}
                        <div className="absolute top-0.5 right-1 text-[8px] text-white/50 mix-blend-overlay font-mono pointer-events-none">
                            {i}
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-[10px] text-neutral-500">
                Click cells to cycle weights.
                <span className="text-teal-400"> Teal = Excitatory (+)</span> |
                <span className="text-red-400"> Red = Inhibitory (-)</span>
            </p>
        </div>
    );
};

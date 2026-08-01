import os
import subprocess

# 1. Revert the rose -> neutral replacements for synaptic weights
def revert_rose():
    # We will get the diff from before our changes
    # Wait, the commit might not be easily available if I made multiple commits.
    # Let's just find "W_EI" and "W_IE" in population/page.tsx
    pop_file = "src/app/labs/population/page.tsx"
    with open(pop_file, "r") as f:
        content = f.read()
    content = content.replace('text-neutral-300 font-bold w-12 text-right tabular-nums">{params.W_EI}', 'text-red-400 font-bold w-12 text-right tabular-nums">{params.W_EI}')
    content = content.replace('text-neutral-300 font-bold w-12 text-right tabular-nums">{params.W_IE}', 'text-teal-400 font-bold w-12 text-right tabular-nums">{params.W_IE}')
    # W_EI slider track
    content = content.replace('bg-neutral-950/50 p-2 rounded border border-neutral-800/50 gap-3">\n                    <span className="text-neutral-400 w-24 shrink-0"><InlineMath math="W_{EI}"', 'bg-neutral-950/50 p-2 rounded border border-red-500/20 gap-3">\n                    <span className="text-neutral-400 w-24 shrink-0"><InlineMath math="W_{EI}"')
    content = content.replace('bg-neutral-950/50 p-2 rounded border border-neutral-800/50 gap-3">\n                    <span className="text-neutral-400 w-24 shrink-0"><InlineMath math="W_{IE}"', 'bg-neutral-950/50 p-2 rounded border border-teal-500/20 gap-3">\n                    <span className="text-neutral-400 w-24 shrink-0"><InlineMath math="W_{IE}"')
    with open(pop_file, "w") as f:
        f.write(content)

    # In VectorMathLab.tsx, we make negative weights red
    vec_file = "src/app/labs/linear-algebra/VectorMathLab.tsx"
    with open(vec_file, "r") as f:
        content = f.read()
    content = content.replace('w < 0 ? "[&_[role=slider]]:bg-teal-500" : "[&_[role=slider]]:bg-teal-500"', 'w < 0 ? "[&_[role=slider]]:bg-red-500" : "[&_[role=slider]]:bg-teal-500"')
    content = content.replace('w < 0 ? "text-teal-400" : "text-teal-400"', 'w < 0 ? "text-red-400" : "text-teal-400"')
    with open(vec_file, "w") as f:
        f.write(content)
    
    # In WeightMatrix.tsx, we make negative weights red
    wm_file = "src/app/labs/linear-algebra/WeightMatrix.tsx"
    with open(wm_file, "r") as f:
        content = f.read()
    content = content.replace('rgba(115, 115, 115,', 'rgba(239, 68, 68,')
    content = content.replace('Grey = Inhibitory', 'Red = Inhibitory')
    content = content.replace('text-neutral-400"> Red = Inhibitory', 'text-red-400"> Red = Inhibitory')
    with open(wm_file, "w") as f:
        f.write(content)

revert_rose()
print("Reverted colors.")

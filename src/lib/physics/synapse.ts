export interface SynapseParams {
    C: number;
    gL: number;
    EL: number;
    I: number;
    tau_syn: number; // synaptic decay time constant
    Esyn: number; // synaptic reversal potential (e.g. 0 for Excitatory, -80 for Inhibitory)
    g_max: number; // Conductance increment per spike
    thresh: number;
    reset: number;
    dt: number;
}

export interface SynapseResult {
    time: number;
    V: number;
    g_syn: number;
    spiked: boolean;
    Isyn: number; // for visualization
}

export function calculateSynapseStep(
    V: number,
    g_syn: number,
    currentTime: number,
    params: SynapseParams
): SynapseResult {
    const { C, gL, EL, I, tau_syn, Esyn, thresh, reset, dt } = params;

    let spiked = false;
    let nextV = V;

    if (V >= thresh) {
        nextV = reset;
        spiked = true;
    } else {
        // Synaptic current: Isyn = g_syn * (V - Esyn)
        const Isyn_val = g_syn * (V - Esyn);
        
        // Membrane equation: C dV/dt = -gL(V-EL) - Isyn + I
        const dV = (-gL * (V - EL) - Isyn_val + I) / C;
        nextV = V + dV * dt;
    }

    // Synaptic conductance decay
    const dg_syn = -g_syn / tau_syn;
    const next_g_syn = g_syn + dg_syn * dt;

    return {
        time: currentTime + dt,
        V: nextV,
        g_syn: next_g_syn,
        spiked,
        Isyn: g_syn * (V - Esyn)
    };
}

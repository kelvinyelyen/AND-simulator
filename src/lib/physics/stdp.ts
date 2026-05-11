export interface STDPParams {
    A_plus: number; // Max potentiation
    A_minus: number; // Max depression
    tau_plus: number; // Time constant for potentiation
    tau_minus: number; // Time constant for depression
    w_max: number; // Max synaptic weight
    w_min: number; // Min synaptic weight
}

export function calculateSTDPWeightChange(
    t_pre: number,
    t_post: number,
    params: STDPParams
): number {
    const { A_plus, A_minus, tau_plus, tau_minus } = params;
    const delta_t = t_post - t_pre; // > 0 means pre before post (LTP)

    if (delta_t > 0) {
        return A_plus * Math.exp(-delta_t / tau_plus);
    } else if (delta_t < 0) {
        return -A_minus * Math.exp(delta_t / tau_minus);
    } else {
        return 0; // Exactly simultaneous spikes usually have a specific rule, here 0 for simplicity
    }
}

export interface HHParams {
    I: number; // Applied current
    gNa: number; // Max sodium conductance
    gK: number; // Max potassium conductance
    gL: number; // Leak conductance
    ENa: number; // Sodium reversal potential
    EK: number; // Potassium reversal potential
    EL: number; // Leak reversal potential
    C: number; // Membrane capacitance
    dt: number;
}

export interface HHResult {
    time: number;
    V: number;
    m: number;
    h: number;
    n: number;
    INa: number;
    IK: number;
    IL: number;
}

export function calculateHHStep(
    V: number,
    m: number,
    h: number,
    n: number,
    currentTime: number,
    params: HHParams
): HHResult {
    const { I, gNa, gK, gL, ENa, EK, EL, C, dt } = params;

    // Helper for safe division (handling x -> 0 in alpha_m, alpha_n)
    const vT_m = V + 40;
    const alpha_m = vT_m === 0 ? 1.0 : (0.1 * vT_m) / (1 - Math.exp(-vT_m / 10));
    const beta_m = 4.0 * Math.exp(-(V + 65) / 18);

    const alpha_h = 0.07 * Math.exp(-(V + 65) / 20);
    const beta_h = 1.0 / (1 + Math.exp(-(V + 35) / 10));

    const vT_n = V + 55;
    const alpha_n = vT_n === 0 ? 0.1 : (0.01 * vT_n) / (1 - Math.exp(-vT_n / 10));
    const beta_n = 0.125 * Math.exp(-(V + 65) / 80);

    const dm = alpha_m * (1 - m) - beta_m * m;
    const dh = alpha_h * (1 - h) - beta_h * h;
    const dn = alpha_n * (1 - n) - beta_n * n;

    const INa = gNa * Math.pow(m, 3) * h * (V - ENa);
    const IK = gK * Math.pow(n, 4) * (V - EK);
    const IL = gL * (V - EL);

    const dV = (I - INa - IK - IL) / C;

    return {
        time: currentTime + dt,
        V: V + dV * dt,
        m: m + dm * dt,
        h: h + dh * dt,
        n: n + dn * dt,
        INa,
        IK,
        IL
    };
}

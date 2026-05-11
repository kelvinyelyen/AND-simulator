export interface PhaseSpaceParams {
    I: number; // External current
    a: number; // Parameter a
    b: number; // Parameter b
    tau: number; // Time scale for recovery variable
    dt: number; // Time step
}

export interface PhaseSpaceForces {
    dv: number;
    dw: number;
}

export interface PhaseSpaceResult {
    time: number;
    v: number;
    w: number;
    forces: PhaseSpaceForces;
}

export function calculatePhaseSpaceStep(
    v: number,
    w: number,
    currentTime: number,
    params: PhaseSpaceParams
): PhaseSpaceResult {
    const { I, a, b, tau, dt } = params;

    // FitzHugh-Nagumo equations
    const dv = v - Math.pow(v, 3) / 3 - w + I;
    const dw = (1 / tau) * (v + a - b * w);

    // Euler integration
    const nextV = v + dv * dt;
    const nextW = w + dw * dt;
    const nextTime = currentTime + dt;

    return {
        time: nextTime,
        v: nextV,
        w: nextW,
        forces: { dv, dw }
    };
}

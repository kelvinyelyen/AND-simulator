export interface WilsonCowanParams {
    W_EE: number;
    W_EI: number;
    W_IE: number;
    W_II: number;
    I_ext_E: number;
    I_ext_I: number;
    tau_E: number;
    tau_I: number;
    a_E: number;
    theta_E: number;
    a_I: number;
    theta_I: number;
    dt: number;
}

export interface WCResult {
    time: number;
    E: number;
    I: number;
}

function sigmoid(x: number, a: number, theta: number): number {
    return 1 / (1 + Math.exp(-a * (x - theta)));
}

export function calculateWCStep(
    E: number,
    I: number,
    currentTime: number,
    params: WilsonCowanParams
): WCResult {
    const { 
        W_EE, W_EI, W_IE, W_II, 
        I_ext_E, I_ext_I, 
        tau_E, tau_I, 
        a_E, theta_E, 
        a_I, theta_I, 
        dt 
    } = params;

    const input_E = W_EE * E - W_EI * I + I_ext_E;
    const input_I = W_IE * E - W_II * I + I_ext_I;

    const dE = (-E + sigmoid(input_E, a_E, theta_E)) / tau_E;
    const dI = (-I + sigmoid(input_I, a_I, theta_I)) / tau_I;

    return {
        time: currentTime + dt,
        E: E + dE * dt,
        I: I + dI * dt
    };
}

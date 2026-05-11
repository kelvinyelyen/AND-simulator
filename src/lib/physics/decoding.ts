export interface NeuronTuning {
    id: number;
    preferredAngle: number;
    fMax: number;
    sigma: number;
}

export interface DecodingParams {
    trueAngle: number;
    noiseLevel: number; // to scale Poisson noise or variance
    numNeurons: number;
    sigma: number;
    fMax: number;
    timeWindow: number; // ms to count spikes
}

export interface SpikeCount {
    id: number;
    count: number;
}

export function generateTuningCurves(numNeurons: number, fMax: number, sigma: number): NeuronTuning[] {
    const neurons: NeuronTuning[] = [];
    const step = 360 / numNeurons;
    for (let i = 0; i < numNeurons; i++) {
        neurons.push({
            id: i,
            preferredAngle: i * step,
            fMax,
            sigma
        });
    }
    return neurons;
}

// Circular distance
function angleDiff(a: number, b: number): number {
    let diff = Math.abs(a - b) % 360;
    if (diff > 180) diff = 360 - diff;
    return diff;
}

export function getExpectedRate(theta: number, neuron: NeuronTuning): number {
    const diff = angleDiff(theta, neuron.preferredAngle);
    return neuron.fMax * Math.exp(-(diff * diff) / (2 * neuron.sigma * neuron.sigma));
}

// Generate Poisson random number (simple Knuth algorithm for small lambda)
function poisson(lambda: number): number {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
        k++;
        p *= Math.random();
    } while (p > L);
    return k - 1;
}

export function simulateSpikes(theta: number, neurons: NeuronTuning[], windowMs: number): SpikeCount[] {
    return neurons.map(n => {
        const rateHz = getExpectedRate(theta, n);
        const expectedSpikes = rateHz * (windowMs / 1000.0);
        return {
            id: n.id,
            count: poisson(expectedSpikes)
        };
    });
}

// Population Vector Decoding
export function decodePopulationVector(spikes: SpikeCount[], neurons: NeuronTuning[]): number {
    let x = 0;
    let y = 0;
    let totalSpikes = 0;

    for (let i = 0; i < neurons.length; i++) {
        const rad = neurons[i].preferredAngle * (Math.PI / 180);
        const count = spikes[i].count;
        x += count * Math.cos(rad);
        y += count * Math.sin(rad);
        totalSpikes += count;
    }

    if (totalSpikes === 0) return Math.random() * 360; // Guess if no spikes

    let angle = Math.atan2(y, x) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    return angle;
}

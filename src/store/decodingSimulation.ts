import { create } from 'zustand';
import { 
    DecodingParams, 
    NeuronTuning, 
    SpikeCount, 
    generateTuningCurves, 
    simulateSpikes, 
    decodePopulationVector 
} from '@/lib/physics/decoding';

interface DecodingState {
    params: DecodingParams;
    setParams: (params: Partial<DecodingParams>) => void;

    neurons: NeuronTuning[];
    spikes: SpikeCount[];
    decodedAngle: number;
    error: number;

    triggerStimulus: () => void;
}

const DEFAULT_PARAMS: DecodingParams = {
    trueAngle: 180,
    noiseLevel: 1.0,
    numNeurons: 20,
    sigma: 30, // degrees spread
    fMax: 50, // Hz
    timeWindow: 200 // ms
};

export const useDecodingStore = create<DecodingState>((set, get) => ({
    params: DEFAULT_PARAMS,
    setParams: (newParams) => {
        set((state) => {
            const merged = { ...state.params, ...newParams };
            // Re-generate tuning curves if numNeurons, fMax, or sigma change
            if (newParams.numNeurons !== undefined || newParams.fMax !== undefined || newParams.sigma !== undefined) {
                const newNeurons = generateTuningCurves(merged.numNeurons, merged.fMax, merged.sigma);
                return { params: merged, neurons: newNeurons, spikes: newNeurons.map(n => ({ id: n.id, count: 0 })), decodedAngle: 0, error: 0 };
            }
            return { params: merged };
        });
    },

    neurons: generateTuningCurves(DEFAULT_PARAMS.numNeurons, DEFAULT_PARAMS.fMax, DEFAULT_PARAMS.sigma),
    spikes: Array(DEFAULT_PARAMS.numNeurons).fill({ count: 0 }).map((_, i) => ({ id: i, count: 0 })),
    decodedAngle: 0,
    error: 0,

    triggerStimulus: () => {
        const { params, neurons } = get();
        const newSpikes = simulateSpikes(params.trueAngle, neurons, params.timeWindow);
        const decoded = decodePopulationVector(newSpikes, neurons);
        
        let err = Math.abs(decoded - params.trueAngle);
        if (err > 180) err = 360 - err;

        set({
            spikes: newSpikes,
            decodedAngle: decoded,
            error: err
        });
    }
}));

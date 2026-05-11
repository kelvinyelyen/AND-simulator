import { create } from 'zustand';
import { calculateSTDPWeightChange, STDPParams } from '@/lib/physics/stdp';

export interface SpikeEvent {
    time: number;
    type: 'pre' | 'post';
}

export interface WeightHistoryPoint {
    time: number;
    weight: number;
    delta_w: number;
}

interface STDPState {
    params: STDPParams;
    setParams: (params: Partial<STDPParams>) => void;

    currentTime: number;
    weight: number;
    
    spikes: SpikeEvent[];
    weightHistory: WeightHistoryPoint[];

    triggerSpike: (type: 'pre' | 'post') => void;
    resetSimulation: () => void;
}

const DEFAULT_PARAMS: STDPParams = {
    A_plus: 0.1,
    A_minus: 0.12, // Depression often slightly stronger to maintain stability
    tau_plus: 20, // ms
    tau_minus: 20, // ms
    w_max: 2.0,
    w_min: 0.0
};

export const useSTDPStore = create<STDPState>((set, get) => ({
    params: DEFAULT_PARAMS,
    setParams: (newParams) => {
        set((state) => ({ params: { ...state.params, ...newParams } }));
    },

    currentTime: 0,
    weight: 1.0, // initial weight

    spikes: [],
    weightHistory: [{ time: 0, weight: 1.0, delta_w: 0 }],

    triggerSpike: (type) => {
        const { currentTime, weight, params, spikes, weightHistory } = get();
        const newTime = currentTime + 1; // Increment step

        const newSpike: SpikeEvent = { time: newTime, type };
        const newSpikes = [...spikes, newSpike];

        // Find nearest opposite spike
        let delta_w = 0;
        const oppositeType = type === 'pre' ? 'post' : 'pre';
        const oppositeSpikes = spikes.filter(s => s.type === oppositeType);
        
        if (oppositeSpikes.length > 0) {
            const lastOpposite = oppositeSpikes[oppositeSpikes.length - 1];
            // If new is post, t_post - t_pre = newTime - lastOpposite.time (>0, LTP)
            // If new is pre, t_post - t_pre = lastOpposite.time - newTime (<0, LTD)
            const t_pre = type === 'pre' ? newTime : lastOpposite.time;
            const t_post = type === 'post' ? newTime : lastOpposite.time;

            // Only apply if within a reasonable window (e.g. 100ms)
            if (Math.abs(t_post - t_pre) < 100) {
                delta_w = calculateSTDPWeightChange(t_pre, t_post, params);
            }
        }

        let newWeight = weight + delta_w;
        // Clamp weight
        newWeight = Math.max(params.w_min, Math.min(params.w_max, newWeight));

        set({
            currentTime: newTime,
            weight: newWeight,
            spikes: newSpikes,
            weightHistory: [...weightHistory, { time: newTime, weight: newWeight, delta_w }]
        });
    },

    resetSimulation: () => set({
        currentTime: 0,
        weight: 1.0,
        spikes: [],
        weightHistory: [{ time: 0, weight: 1.0, delta_w: 0 }]
    })
}));

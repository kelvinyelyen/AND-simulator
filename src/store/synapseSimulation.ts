import { create } from 'zustand';
import { calculateSynapseStep, SynapseParams } from '@/lib/physics/synapse';

export interface SynapseTracePoint {
    time: number;
    V: number;
    g_syn: number;
    spiked: boolean;
}

export interface PreSpike {
    time: number;
}

interface SynapseState {
    params: SynapseParams;
    setParams: (params: Partial<SynapseParams>) => void;

    isRunning: boolean;
    setIsRunning: (isRunning: boolean) => void;
    resetSimulation: () => void;

    currentTime: number;
    V: number;
    g_syn: number;
    history: SynapseTracePoint[];
    maxHistoryPoints: number;
    
    preSpikes: PreSpike[]; // Track incoming spikes
    triggerPreSpike: () => void;

    step: () => void;
    stepMultiple: (steps: number) => void;
}

const DEFAULT_PARAMS: SynapseParams = {
    C: 1,
    gL: 0.1,
    EL: -70,
    I: 0,
    tau_syn: 10,
    Esyn: 0, // Excitatory by default
    g_max: 0.5,
    thresh: -50,
    reset: -80,
    dt: 0.1
};

export const useSynapseStore = create<SynapseState>((set, get) => ({
    params: DEFAULT_PARAMS,
    setParams: (newParams) => {
        set((state) => ({ params: { ...state.params, ...newParams } }));
    },

    isRunning: false,
    setIsRunning: (isRunning) => set({ isRunning }),
    resetSimulation: () => set({
        currentTime: 0,
        V: DEFAULT_PARAMS.EL,
        g_syn: 0,
        history: [],
        preSpikes: []
    }),

    currentTime: 0,
    V: DEFAULT_PARAMS.EL,
    g_syn: 0,
    history: [],
    maxHistoryPoints: 500,
    
    preSpikes: [],
    triggerPreSpike: () => {
        const { currentTime, g_syn, params, preSpikes } = get();
        // Instantly increase g_syn
        set({ 
            g_syn: g_syn + params.g_max,
            preSpikes: [...preSpikes, { time: currentTime }]
        });
    },

    step: () => {
        const { V, g_syn, currentTime, params, history, maxHistoryPoints } = get();

        const result = calculateSynapseStep(V, g_syn, currentTime, params);

        const newPoint: SynapseTracePoint = {
            time: result.time,
            V: result.V,
            g_syn: result.g_syn,
            spiked: result.spiked
        };

        const newHistory = [...history, newPoint].slice(-maxHistoryPoints);

        set({
            V: result.V,
            g_syn: result.g_syn,
            currentTime: result.time,
            history: newHistory,
        });
    },

    stepMultiple: (steps: number) => {
        let { V, g_syn, currentTime, params, history, maxHistoryPoints } = get();
        
        let newHistory = [...history];
        let spiked = false;

        for (let i = 0; i < steps; i++) {
            const result = calculateSynapseStep(V, g_syn, currentTime, params);
            V = result.V;
            g_syn = result.g_syn;
            currentTime = result.time;
            if (result.spiked) spiked = true;

            newHistory.push({
                time: result.time,
                V: result.V,
                g_syn: result.g_syn,
                spiked: result.spiked
            });
        }

        newHistory = newHistory.slice(-maxHistoryPoints);

        set({
            V,
            g_syn,
            currentTime,
            history: newHistory,
        });
    },
}));

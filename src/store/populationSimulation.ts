import { create } from 'zustand';
import { calculateWCStep, WilsonCowanParams } from '@/lib/physics/wilsonCowan';

export interface WCTracePoint {
    time: number;
    E: number;
    I: number;
}

interface WCState {
    params: WilsonCowanParams;
    setParams: (params: Partial<WilsonCowanParams>) => void;

    isRunning: boolean;
    setIsRunning: (isRunning: boolean) => void;
    resetSimulation: () => void;

    currentTime: number;
    E: number;
    I: number;
    history: WCTracePoint[];
    maxHistoryPoints: number;

    step: () => void;
    stepMultiple: (steps: number) => void;
}

const DEFAULT_PARAMS: WilsonCowanParams = {
    W_EE: 12,
    W_EI: 4,
    W_IE: 13,
    W_II: 11,
    I_ext_E: 1.5,
    I_ext_I: 0,
    tau_E: 10,
    tau_I: 10,
    a_E: 1.2,
    theta_E: 2.8,
    a_I: 1.0,
    theta_I: 4.0,
    dt: 0.1
};

export const usePopulationStore = create<WCState>((set, get) => ({
    params: DEFAULT_PARAMS,
    setParams: (newParams) => {
        set((state) => ({ params: { ...state.params, ...newParams } }));
    },

    isRunning: false,
    setIsRunning: (isRunning) => set({ isRunning }),
    resetSimulation: () => set({
        currentTime: 0,
        E: 0.1,
        I: 0.1,
        history: []
    }),

    currentTime: 0,
    E: 0.1,
    I: 0.1,
    history: [],
    maxHistoryPoints: 2000,

    step: () => {
        const { E, I, currentTime, params, history, maxHistoryPoints } = get();

        const result = calculateWCStep(E, I, currentTime, params);

        const newPoint: WCTracePoint = {
            time: result.time,
            E: result.E,
            I: result.I
        };

        const newHistory = [...history, newPoint].slice(-maxHistoryPoints);

        set({
            E: result.E,
            I: result.I,
            currentTime: result.time,
            history: newHistory,
        });
    },

    stepMultiple: (steps: number) => {
        let { E, I, currentTime } = get();
        const { params, history, maxHistoryPoints } = get();
        
        let newHistory = [...history];

        for (let i = 0; i < steps; i++) {
            const result = calculateWCStep(E, I, currentTime, params);
            E = result.E;
            I = result.I;
            currentTime = result.time;

            newHistory.push({
                time: result.time,
                E: result.E,
                I: result.I
            });
        }

        newHistory = newHistory.slice(-maxHistoryPoints);

        set({
            E,
            I,
            currentTime,
            history: newHistory,
        });
    },
}));

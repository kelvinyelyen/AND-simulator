import { create } from 'zustand';
import { calculateHHStep, HHParams } from '@/lib/physics/hodgkinHuxley';

export interface HHTracePoint {
    time: number;
    V: number;
    m: number;
    h: number;
    n: number;
    gNa_inst: number; // instantaneous Na conductance
    gK_inst: number; // instantaneous K conductance
}

interface HHState {
    params: HHParams;
    setParams: (params: Partial<HHParams>) => void;

    isRunning: boolean;
    setIsRunning: (isRunning: boolean) => void;
    resetSimulation: () => void;

    currentTime: number;
    V: number;
    m: number;
    h: number;
    n: number;
    history: HHTracePoint[];
    maxHistoryPoints: number;

    step: () => void;
    stepMultiple: (steps: number) => void;
}

const DEFAULT_PARAMS: HHParams = {
    I: 10,
    gNa: 120,
    gK: 36,
    gL: 0.3,
    ENa: 50,
    EK: -77,
    EL: -54.4,
    C: 1,
    dt: 0.05
};

// Initial conditions for HH
const INITIAL_V = -65;
const INITIAL_M = 0.052;
const INITIAL_H = 0.596;
const INITIAL_N = 0.317;

export const useHHStore = create<HHState>((set, get) => ({
    params: DEFAULT_PARAMS,
    setParams: (newParams) => {
        set((state) => ({ params: { ...state.params, ...newParams } }));
    },

    isRunning: false,
    setIsRunning: (isRunning) => set({ isRunning }),
    resetSimulation: () => set({
        currentTime: 0,
        V: INITIAL_V,
        m: INITIAL_M,
        h: INITIAL_H,
        n: INITIAL_N,
        history: []
    }),

    currentTime: 0,
    V: INITIAL_V,
    m: INITIAL_M,
    h: INITIAL_H,
    n: INITIAL_N,
    history: [],
    maxHistoryPoints: 1000,

    step: () => {
        const { V, m, h, n, currentTime, params, history, maxHistoryPoints } = get();

        const result = calculateHHStep(V, m, h, n, currentTime, params);

        const newPoint: HHTracePoint = {
            time: result.time,
            V: result.V,
            m: result.m,
            h: result.h,
            n: result.n,
            gNa_inst: params.gNa * Math.pow(result.m, 3) * result.h,
            gK_inst: params.gK * Math.pow(result.n, 4)
        };

        const newHistory = [...history, newPoint].slice(-maxHistoryPoints);

        set({
            V: result.V,
            m: result.m,
            h: result.h,
            n: result.n,
            currentTime: result.time,
            history: newHistory,
        });
    },

    stepMultiple: (steps: number) => {
        let { V, m, h, n, currentTime, params, history, maxHistoryPoints } = get();
        
        let newHistory = [...history];

        for (let i = 0; i < steps; i++) {
            const result = calculateHHStep(V, m, h, n, currentTime, params);
            V = result.V;
            m = result.m;
            h = result.h;
            n = result.n;
            currentTime = result.time;

            newHistory.push({
                time: result.time,
                V: result.V,
                m: result.m,
                h: result.h,
                n: result.n,
                gNa_inst: params.gNa * Math.pow(result.m, 3) * result.h,
                gK_inst: params.gK * Math.pow(result.n, 4)
            });
        }

        newHistory = newHistory.slice(-maxHistoryPoints);

        set({
            V,
            m,
            h,
            n,
            currentTime,
            history: newHistory,
        });
    },
}));

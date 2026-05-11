import { create } from 'zustand';
import { calculatePhaseSpaceStep, PhaseSpaceParams, PhaseSpaceForces } from '@/lib/physics/phaseSpace';

export interface PhaseSpaceTracePoint {
    time: number;
    v: number;
    w: number;
}

interface PhaseSpaceState {
    params: PhaseSpaceParams;
    setParams: (params: Partial<PhaseSpaceParams>) => void;

    isRunning: boolean;
    setIsRunning: (isRunning: boolean) => void;
    resetSimulation: () => void;

    currentTime: number;
    v: number;
    w: number;
    history: PhaseSpaceTracePoint[];
    maxHistoryPoints: number;

    forces: PhaseSpaceForces;

    hoveredTerm: string | null;
    setHoveredTerm: (term: string | null) => void;

    step: () => void;
}

const DEFAULT_PARAMS: PhaseSpaceParams = {
    I: 0.5,
    a: 0.7,
    b: 0.8,
    tau: 12.5,
    dt: 0.05
};

// Initial conditions for FHN
const INITIAL_V = -1.2;
const INITIAL_W = -0.62;

export const usePhaseSpaceStore = create<PhaseSpaceState>((set, get) => ({
    params: DEFAULT_PARAMS,
    setParams: (newParams) => {
        set((state) => ({ params: { ...state.params, ...newParams } }));
    },

    isRunning: false,
    setIsRunning: (isRunning) => set({ isRunning }),
    resetSimulation: () => set({
        currentTime: 0,
        v: INITIAL_V,
        w: INITIAL_W,
        history: [],
        forces: { dv: 0, dw: 0 }
    }),

    currentTime: 0,
    v: INITIAL_V,
    w: INITIAL_W,
    history: [],
    maxHistoryPoints: 2000, // Keep more points for drawing full orbits

    forces: { dv: 0, dw: 0 },

    hoveredTerm: null,
    setHoveredTerm: (term) => set({ hoveredTerm: term }),

    step: () => {
        const { v, w, currentTime, params, history, maxHistoryPoints } = get();

        const result = calculatePhaseSpaceStep(v, w, currentTime, params);

        const newPoint: PhaseSpaceTracePoint = {
            time: result.time,
            v: result.v,
            w: result.w
        };

        const newHistory = [...history, newPoint].slice(-maxHistoryPoints);

        set({
            v: result.v,
            w: result.w,
            currentTime: result.time,
            history: newHistory,
            forces: result.forces,
        });
    },
}));

'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSynapseStore } from '@/store/synapseSimulation';
import { ConceptDialog } from '@/components/guide/ConceptDialog';
import { synapseContent } from './content';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Activity, FunctionSquare, Zap } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function SynapseLab() {
  const {
    params,
    setParams,
    history,
    isRunning,
    setIsRunning,
    resetSimulation,
    stepMultiple,
    triggerPreSpike
  } = useSynapseStore();

  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const animate = useCallback(() => {
    const now = Date.now();
    if (now - lastTimeRef.current >= 33) {
      if (isRunning) {
        stepMultiple(5);
      }
      lastTimeRef.current = now;
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [isRunning, stepMultiple]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  return (
    <div className="h-screen bg-neutral-950 text-neutral-200 font-mono flex flex-col overflow-hidden select-none">

      {/* MOBILE GUARD */}
      <div className="flex md:hidden flex-col items-center justify-center h-full p-8 text-center space-y-6 bg-neutral-950 z-50 fixed inset-0">
        <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-800">
          <Activity className="w-8 h-8 text-teal-500 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white mb-2">Scientific Workstation</h1>
          <p className="text-neutral-500 text-sm leading-relaxed max-w-xs mx-auto">
            Please access this simulation on a <span className="text-neutral-300">Desktop</span> or <span className="text-neutral-300">Tablet</span>.
          </p>
        </div>
      </div>

      {/* DESKTOP CONTENT */}
      <div className="hidden md:flex flex-col h-full">
        <header className="h-14 border-b border-neutral-900 flex items-center justify-between px-6 bg-neutral-950 shrink-0">
          <div className="flex items-center gap-4">
            <Activity className="w-5 h-5 text-teal-500" />
            <h1 className="text-sm font-bold tracking-tight text-white">
              <Link href="/" className="hover:opacity-80 transition-opacity">NCDL</Link>
              <span className="mx-3 text-neutral-700">/</span>
              <span className="text-neutral-400 font-medium">Synaptic Mechanics</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1 mr-2 bg-neutral-900 p-1 rounded-md border border-neutral-800">
              <Button size="icon" variant="ghost" className="h-7 w-7 text-neutral-400 hover:text-teal-400 hover:bg-neutral-800" onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-neutral-400 hover:text-white hover:bg-neutral-800" onClick={resetSimulation}>
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
            <ConceptDialog {...synapseContent} />
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden p-6 gap-6">
          <aside className="w-[400px] flex flex-col shrink-0 overflow-hidden bg-neutral-900/50 border border-neutral-800 rounded-2xl shadow-sm">
            <div className="h-full flex flex-col p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden">

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FunctionSquare className="w-3.5 h-3.5 text-neutral-600" />
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-neutral-600 font-mono">Synapse Equation</span>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 flex flex-col items-center justify-center border border-neutral-800/30 text-neutral-200">
                    <BlockMath math="\frac{dg_{syn}}{dt} = -\frac{g_{syn}}{\tau_{syn}}" />
                    <BlockMath math="I_{syn} = g_{syn}(V - E_{syn})" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 mt-6 border-t border-neutral-800/50">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-teal-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white font-mono">Interact</span>
                  </div>
                  <Button onClick={triggerPreSpike} size="sm" className="bg-teal-600 hover:bg-teal-500 text-white font-bold font-mono h-7 text-xs">
                    Fire Pre-Synapse
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono bg-neutral-950/50 p-2 rounded border border-neutral-800/50 gap-3">
                    <span className="text-neutral-400 w-24 shrink-0">Decay <InlineMath math="\tau_{syn}" /></span>
                    <Slider
                      min={1} max={50} step={1}
                      value={[params.tau_syn]}
                      onValueChange={(val) => setParams({ tau_syn: val[0] })}
                      className="flex-1 cursor-pointer"
                    />
                    <span className="text-neutral-300 font-bold w-12 text-right tabular-nums">{params.tau_syn} ms</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono bg-neutral-950/50 p-2 rounded border border-neutral-800/50 gap-3">
                    <span className="text-neutral-400 w-24 shrink-0">Reversal <InlineMath math="E_{syn}" /></span>
                    <Slider
                      min={-90} max={20} step={5}
                      value={[params.Esyn]}
                      onValueChange={(val) => setParams({ Esyn: val[0] })}
                      className="flex-1 cursor-pointer"
                    />
                    <span className="text-teal-400 font-bold w-12 text-right tabular-nums">{params.Esyn} mV</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono bg-neutral-950/50 p-2 rounded border border-neutral-800/50 gap-3">
                    <span className="text-neutral-400 w-24 shrink-0">Weight <InlineMath math="g_{max}" /></span>
                    <Slider
                      min={0.1} max={5} step={0.1}
                      value={[params.g_max]}
                      onValueChange={(val) => setParams({ g_max: val[0] })}
                      className="flex-1 cursor-pointer"
                    />
                    <span className="text-teal-400 font-bold w-12 text-right tabular-nums">{params.g_max}</span>
                  </div>
                </div>
              </div>

            </div>
          </aside>

          <section className="flex-1 flex flex-col gap-6 min-w-0">

            <div className="flex-[1] bg-neutral-900/30 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col relative shadow-inner p-4">
              <span className="absolute top-4 left-4 z-10 text-sm font-black text-neutral-500 font-mono uppercase tracking-tighter">Synaptic Conductance (g_syn)</span>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 20, right: 10, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                  <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} hide />
                  <YAxis domain={[0, 'auto']} hide />
                  <Line type="monotone" dataKey="g_syn" stroke="#a3a3a3" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-[1] bg-neutral-900/30 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col relative shadow-inner p-4">
              <span className="absolute top-4 left-4 z-10 text-sm font-black text-neutral-500 font-mono uppercase tracking-tighter">Post-Synaptic Voltage (mV)</span>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 20, right: 10, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                  <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} hide />
                  <YAxis domain={[-90, -30]} hide />
                  <ReferenceLine y={params.thresh} stroke="#737373" strokeDasharray="4 4" opacity={0.5} />
                  <Line type="monotone" dataKey="V" stroke="#14b8a6" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </section>
        </main>
      </div>
    </div>
  );
}

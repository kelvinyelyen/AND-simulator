'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePopulationStore } from '@/store/populationSimulation';
import { ConceptDialog } from '@/components/guide/ConceptDialog';
import { populationContent } from './content';
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
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function PopulationLab() {
  const {
    params,
    setParams,
    history,
    isRunning,
    setIsRunning,
    resetSimulation,
    step,
    E,
    I
  } = usePopulationStore();

  const requestRef = useRef<number>();

  const animate = useCallback(() => {
    if (isRunning) {
      for (let i = 0; i < 5; i++) step();
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [isRunning, step]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  const phaseData = history.map(p => ({ E: p.E, I: p.I }));

  return (
    <div className="h-screen bg-zinc-950 text-zinc-200 font-mono flex flex-col overflow-hidden select-none font-sans">

      {/* MOBILE GUARD */}
      <div className="flex md:hidden flex-col items-center justify-center h-full p-8 text-center space-y-6 bg-zinc-950 z-50 fixed inset-0">
        <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
          <Activity className="w-8 h-8 text-emerald-500 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white mb-2">Scientific Workstation</h1>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto">
            Please access this simulation on a <span className="text-zinc-300">Desktop</span> or <span className="text-zinc-300">Tablet</span>.
          </p>
        </div>
      </div>

      {/* DESKTOP CONTENT */}
      <div className="hidden md:flex flex-col h-full">
      <header className="h-14 border-b border-zinc-900 flex items-center justify-between px-6 bg-zinc-950 shrink-0">
        <div className="flex items-center gap-4">
          <Activity className="w-5 h-5 text-emerald-500" />
          <h1 className="text-base font-semibold tracking-tight text-white">
            <Link href="/" className="hover:opacity-80 transition-opacity">ISCN</Link>
            <span className="mx-3 text-zinc-700">/</span>
            <span className="text-zinc-400 font-medium">Population Feedback</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1 mr-2 bg-zinc-900 p-1 rounded-md border border-zinc-800">
            <Button size="icon" variant="ghost" className="h-7 w-7 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800" onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-800" onClick={resetSimulation}>
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
          <ConceptDialog {...populationContent} />
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        <aside className="w-[400px] flex flex-col shrink-0 overflow-hidden bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-sm">
          <div className="h-full flex flex-col p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FunctionSquare className="w-3.5 h-3.5 text-zinc-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 font-mono">Wilson-Cowan Model</span>
                </div>
                <div className="bg-black/30 rounded-xl p-4 flex flex-col items-center justify-center border border-zinc-800/30 text-zinc-200">
                  <BlockMath math="\tau_E \frac{dE}{dt} = -E + f(W_{EE}E - W_{EI}I + I_{ext})" />
                  <BlockMath math="\tau_I \frac{dI}{dt} = -I + f(W_{IE}E - W_{II}I)" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 mt-6 border-t border-zinc-800/50">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white font-mono">Connectivity Weights</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-mono bg-zinc-950/50 p-2 rounded border border-blue-500/20 gap-3">
                  <span className="text-zinc-400 w-24 shrink-0"><InlineMath math="W_{EE}"/> (Recurrent)</span>
                  <Slider min={0} max={20} step={0.5} value={[params.W_EE]} onValueChange={(val) => setParams({ W_EE: val[0] })} className="flex-1" />
                  <span className="text-blue-400 font-bold w-12 text-right tabular-nums">{params.W_EE}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono bg-zinc-950/50 p-2 rounded border border-zinc-800/50 gap-3">
                  <span className="text-zinc-400 w-24 shrink-0"><InlineMath math="W_{EI}"/> (I to E)</span>
                  <Slider min={0} max={20} step={0.5} value={[params.W_EI]} onValueChange={(val) => setParams({ W_EI: val[0] })} className="flex-1" />
                  <span className="text-zinc-300 font-bold w-12 text-right tabular-nums">{params.W_EI}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono bg-zinc-950/50 p-2 rounded border border-zinc-800/50 gap-3">
                  <span className="text-zinc-400 w-24 shrink-0"><InlineMath math="W_{IE}"/> (E to I)</span>
                  <Slider min={0} max={20} step={0.5} value={[params.W_IE]} onValueChange={(val) => setParams({ W_IE: val[0] })} className="flex-1" />
                  <span className="text-zinc-300 font-bold w-12 text-right tabular-nums">{params.W_IE}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono bg-zinc-950/50 p-2 rounded border border-red-500/20 gap-3">
                  <span className="text-zinc-400 w-24 shrink-0"><InlineMath math="W_{II}"/> (Recurrent)</span>
                  <Slider min={0} max={20} step={0.5} value={[params.W_II]} onValueChange={(val) => setParams({ W_II: val[0] })} className="flex-1" />
                  <span className="text-red-400 font-bold w-12 text-right tabular-nums">{params.W_II}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-6 mt-6 border-t border-zinc-800/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white font-mono">External Drive</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono bg-zinc-950/50 p-2 rounded border border-amber-500/20 gap-3">
                <span className="text-zinc-400 w-24 shrink-0"><InlineMath math="I_{ext}"/></span>
                <Slider min={0} max={5} step={0.1} value={[params.I_ext_E]} onValueChange={(val) => setParams({ I_ext_E: val[0] })} className="flex-1" />
                <span className="text-amber-500 font-bold w-12 text-right tabular-nums">{params.I_ext_E.toFixed(1)}</span>
              </div>
            </div>

          </div>
        </aside>

        <section className="flex-1 flex flex-col gap-6 min-w-0">
          
          <div className="flex-[1] bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col relative shadow-inner p-4">
            <div className="absolute top-4 left-4 z-10 flex flex-col">
              <span className="text-sm font-black text-zinc-500 font-mono uppercase tracking-tighter">Firing Rates</span>
              <div className="flex items-center gap-4 mt-2 text-[10px] font-mono font-bold">
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div><span className="text-blue-500">Excitatory (E)</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div><span className="text-red-500">Inhibitory (I)</span></div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 40, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} hide />
                <YAxis domain={[0, 1]} hide />
                <Line type="monotone" dataKey="E" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="I" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-[1.5] bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col relative shadow-inner p-4 flex items-center justify-center">
            <div className="absolute top-4 left-4 z-10">
              <span className="text-sm font-black text-zinc-500 font-mono uppercase tracking-tighter">Phase Plane (E vs I)</span>
            </div>
            <div className="w-full h-full max-w-lg aspect-square">
                <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" />
                    <XAxis type="number" dataKey="E" domain={[0, 1]} name="E" tick={{fill: '#52525b', fontSize: 10}} />
                    <YAxis type="number" dataKey="I" domain={[0, 1]} name="I" tick={{fill: '#52525b', fontSize: 10}} />
                    <ZAxis range={[10, 10]} />
                    <Scatter data={phaseData} fill="#ffffff" line={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.5 }} shape={() => <></>} />
                    <Scatter data={[{E, I}]} fill="#10b981" shape="circle" />
                </ScatterChart>
                </ResponsiveContainer>
            </div>
          </div>

        </section>
      </main>
      </div>
    </div>
  );
}

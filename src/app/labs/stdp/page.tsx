'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSTDPStore } from '@/store/stdpSimulation';
import { ConceptDialog } from '@/components/guide/ConceptDialog';
import { stdpContent } from './content';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCcw, Activity, FunctionSquare, Zap } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine
} from 'recharts';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function STDPLab() {
  const {
    params,
    setParams,
    weightHistory,
    spikes,
    triggerSpike,
    resetSimulation
  } = useSTDPStore();

  // For the STDP curve plot
  const stdpCurveData = [];
  for (let dt = -60; dt <= 60; dt += 2) {
    let dw = 0;
    if (dt > 0) dw = params.A_plus * Math.exp(-dt / params.tau_plus);
    else if (dt < 0) dw = -params.A_minus * Math.exp(dt / params.tau_minus);
    stdpCurveData.push({ dt, dw });
  }

  // Handle keyboard shortcuts for Pre (J) and Post (K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'j' || e.key === 'J') triggerSpike('pre');
      if (e.key === 'k' || e.key === 'K') triggerSpike('post');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerSpike]);

  // Format spikes for scatter plot timeline
  const preSpikesData = spikes.filter(s => s.type === 'pre').map(s => ({ time: s.time, y: 1 }));
  const postSpikesData = spikes.filter(s => s.type === 'post').map(s => ({ time: s.time, y: 0 }));

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
              <Link href="/" className="hover:opacity-80 transition-opacity">AND</Link>
              <span className="mx-3 text-zinc-700">/</span>
              <span className="text-zinc-400 font-medium">STDP & Hebbian Learning</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button size="icon" variant="ghost" className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-800" onClick={resetSimulation}>
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
            <ConceptDialog {...stdpContent} />
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden p-6 gap-6">
          <aside className="w-[400px] flex flex-col shrink-0 overflow-hidden bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-sm">
            <div className="h-full flex flex-col p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden">

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FunctionSquare className="w-3.5 h-3.5 text-zinc-600" />
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 font-mono">Learning Rule</span>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 flex flex-col items-center justify-center border border-zinc-800/30 text-zinc-200">
                    <BlockMath math="\Delta w = \begin{cases} A_+ e^{-\Delta t/\tau_+} & \text{if } \Delta t > 0 \\ -A_- e^{\Delta t/\tau_-} & \text{if } \Delta t < 0 \end{cases}" />
                    <div className="text-xs text-zinc-500 mt-2"><InlineMath math="\Delta t = t_{post} - t_{pre}" /></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 mt-6 border-t border-zinc-800/50">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white font-mono">Manual Trigger</span>
                </div>
                <div className="flex gap-4">
                  <Button onClick={() => triggerSpike('pre')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold h-12">
                    PRE Spike (J)
                  </Button>
                  <Button onClick={() => triggerSpike('post')} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12">
                    POST Spike (K)
                  </Button>
                </div>
              </div>

              <div className="space-y-4 pt-6 mt-6 border-t border-zinc-800/50">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white font-mono">Parameters</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono bg-zinc-950/50 p-2 rounded border border-zinc-800/50 gap-3">
                    <span className="text-zinc-400 w-24 shrink-0">LTP <InlineMath math="A_+" /></span>
                    <Slider min={0} max={0.5} step={0.01} value={[params.A_plus]} onValueChange={(val) => setParams({ A_plus: val[0] })} className="flex-1" />
                    <span className="text-zinc-300 font-bold w-12 text-right tabular-nums">{params.A_plus.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono bg-zinc-950/50 p-2 rounded border border-zinc-800/50 gap-3">
                    <span className="text-zinc-400 w-24 shrink-0">LTD <InlineMath math="A_-" /></span>
                    <Slider min={0} max={0.5} step={0.01} value={[params.A_minus]} onValueChange={(val) => setParams({ A_minus: val[0] })} className="flex-1" />
                    <span className="text-zinc-300 font-bold w-12 text-right tabular-nums">{params.A_minus.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono bg-zinc-950/50 p-2 rounded border border-zinc-800/50 gap-3">
                    <span className="text-zinc-400 w-24 shrink-0">Time <InlineMath math="\tau" /></span>
                    <Slider min={5} max={50} step={1} value={[params.tau_plus]} onValueChange={(val) => setParams({ tau_plus: val[0], tau_minus: val[0] })} className="flex-1" />
                    <span className="text-zinc-300 font-bold w-12 text-right tabular-nums">{params.tau_plus}</span>
                  </div>
                </div>
              </div>

              {/* Visual STDP Curve inside sidebar */}
              <div className="mt-8 h-40 bg-black/20 rounded-xl p-2 border border-zinc-800/30">
                <span className="text-[10px] text-zinc-500 uppercase font-bold ml-2">STDP Window</span>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stdpCurveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" />
                    <XAxis dataKey="dt" type="number" domain={[-60, 60]} tick={{ fontSize: 8, fill: '#52525b' }} />
                    <YAxis domain={[-0.5, 0.5]} tick={{ fontSize: 8, fill: '#52525b' }} />
                    <ReferenceLine x={0} stroke="#52525b" />
                    <ReferenceLine y={0} stroke="#52525b" />
                    <Line type="monotone" dataKey="dw" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

            </div>
          </aside>

          <section className="flex-1 flex flex-col gap-6 min-w-0">

            <div className="flex-[1] bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col relative shadow-inner p-4">
              <span className="absolute top-4 left-4 z-10 text-sm font-black text-zinc-500 font-mono uppercase tracking-tighter">Event Timeline</span>
              <div className="absolute top-4 right-4 z-10 flex gap-4 text-[10px] font-bold font-mono">
                <span className="text-blue-500 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Pre-Spikes</span>
                <span className="text-emerald-500 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Post-Spikes</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 40, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                  <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} hide />
                  <YAxis dataKey="y" type="number" domain={[-0.5, 1.5]} hide />
                  <ZAxis range={[100, 100]} />
                  <Scatter data={preSpikesData} fill="#3b82f6" shape="circle" isAnimationActive={false} />
                  <Scatter data={postSpikesData} fill="#10b981" shape="circle" isAnimationActive={false} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-[1.5] bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col relative shadow-inner p-4">
              <span className="absolute top-4 left-4 z-10 text-sm font-black text-zinc-500 font-mono uppercase tracking-tighter">Synaptic Weight (w)</span>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightHistory} margin={{ top: 30, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                  <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} hide />
                  <YAxis domain={[params.w_min, params.w_max]} stroke="#52525b" />
                  <Line type="stepAfter" dataKey="weight" stroke="#f59e0b" strokeWidth={3} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </section>
        </main>
      </div>
    </div>
  );
}

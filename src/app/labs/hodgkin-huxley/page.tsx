'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useHHStore } from '@/store/hhSimulation';
import { ConceptDialog } from '@/components/guide/ConceptDialog';
import { hodgkinHuxleyContent } from './content';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Activity, FunctionSquare, Zap } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function HodgkinHuxleyLab() {
  const {
    params,
    setParams,
    history,
    isRunning,
    setIsRunning,
    resetSimulation,
    stepMultiple
  } = useHHStore();

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
        {/* Header */}
        <header className="h-14 border-b border-neutral-900 flex items-center justify-between px-6 bg-neutral-950 shrink-0">
          <div className="flex items-center gap-4">
            <Activity className="w-5 h-5 text-teal-500" />
            <h1 className="text-sm font-bold tracking-tight text-white">
              <Link href="/" className="hover:opacity-80 transition-opacity">NCDL</Link>
              <span className="mx-3 text-neutral-700">/</span>
              <span className="text-neutral-400 font-medium">The Hodgkin-Huxley Engine</span>
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
            <ConceptDialog {...hodgkinHuxleyContent} />
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden p-6 gap-6">
          {/* Sidebar */}
          <aside className="w-[400px] flex flex-col shrink-0 overflow-hidden bg-neutral-900/50 border border-neutral-800 rounded-2xl shadow-sm">
            <div className="h-full flex flex-col p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden">

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FunctionSquare className="w-3.5 h-3.5 text-neutral-600" />
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-neutral-600 font-mono">HH Equations</span>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 flex flex-col items-center justify-center border border-neutral-800/30 text-neutral-200 text-sm">
                    <BlockMath math="C \frac{dV}{dt} = I - I_{Na} - I_K - I_L" />
                    <div className="text-[10px] text-neutral-500 mt-1 pt-2 border-t border-neutral-800/30 w-full text-center space-y-1">
                      <BlockMath math="I_{Na} = g_{Na}m^3h(V - E_{Na})" />
                      <BlockMath math="I_K = g_K n^4(V - E_K)" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 mt-6 border-t border-neutral-800/50">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-3.5 h-3.5 text-teal-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white font-mono">Channel Conductances</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono bg-neutral-950/50 p-2 rounded border border-teal-500/20 gap-3">
                    <span className="text-neutral-400 w-24 shrink-0">Current (I)</span>
                    <Slider
                      min={0} max={30} step={0.5}
                      value={[params.I]}
                      onValueChange={(val) => setParams({ I: val[0] })}
                      className="flex-1 cursor-pointer [&_[role=slider]]:bg-teal-500"
                    />
                    <span className="text-teal-500 font-bold w-12 text-right tabular-nums">{params.I}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono bg-neutral-950/50 p-2 rounded border border-neutral-800/50 gap-3">
                    <span className="text-neutral-400 w-24 shrink-0">Max <InlineMath math="g_{Na}" /></span>
                    <Slider
                      min={0} max={200} step={1}
                      value={[params.gNa]}
                      onValueChange={(val) => setParams({ gNa: val[0] })}
                      className="flex-1 cursor-pointer"
                    />
                    <span className="text-teal-400 font-bold w-12 text-right tabular-nums">{params.gNa}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono bg-neutral-950/50 p-2 rounded border border-neutral-800/50 gap-3">
                    <span className="text-neutral-400 w-24 shrink-0">Max <InlineMath math="g_K" /></span>
                    <Slider
                      min={0} max={100} step={1}
                      value={[params.gK]}
                      onValueChange={(val) => setParams({ gK: val[0] })}
                      className="flex-1 cursor-pointer"
                    />
                    <span className="text-teal-400 font-bold w-12 text-right tabular-nums">{params.gK}</span>
                  </div>
                </div>
              </div>

            </div>
          </aside>

          {/* Visualizations */}
          <section className="flex-1 flex flex-col gap-6 min-w-0">

            {/* Voltage vs Time */}
            <div className="flex-[1.5] bg-neutral-900/30 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col relative shadow-inner p-4">
              <span className="absolute top-4 left-4 z-10 text-sm font-black text-neutral-500 font-mono uppercase tracking-tighter">Membrane Voltage (mV)</span>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 20, right: 10, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                  <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} hide />
                  <YAxis domain={[-100, 60]} hide />
                  <Line type="monotone" dataKey="V" stroke="#f4f4f5" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Conductances vs Time */}
            <div className="flex-[1] bg-neutral-900/30 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col relative shadow-inner p-4">
              <div className="absolute top-4 left-4 z-10 flex flex-col">
                <span className="text-sm font-black text-neutral-500 font-mono uppercase tracking-tighter">Instantaneous Conductances</span>
                <div className="flex items-center gap-4 mt-2 text-[10px] font-mono font-bold">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-teal-500 rounded-full"></div><span className="text-teal-500">g_Na</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-teal-500 rounded-full"></div><span className="text-teal-500">g_K</span></div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 30, right: 10, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                  <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} hide />
                  <YAxis domain={[0, 40]} hide />
                  <Line type="monotone" dataKey="gNa_inst" stroke="#5eead4" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="gK_inst" stroke="#14b8a6" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Gating Variables vs Time */}
            <div className="flex-[1] bg-neutral-900/30 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col relative shadow-inner p-4">
              <div className="absolute top-4 left-4 z-10 flex flex-col">
                <span className="text-sm font-black text-neutral-500 font-mono uppercase tracking-tighter">Gating Variables</span>
                <div className="flex items-center gap-4 mt-2 text-[10px] font-mono font-bold">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div><span className="text-red-500">m (Na open)</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-500 rounded-full"></div><span className="text-orange-500">h (Na close)</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-teal-500 rounded-full"></div><span className="text-teal-500">n (K open)</span></div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 30, right: 10, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                  <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} hide />
                  <YAxis domain={[0, 1]} hide />
                  <Line type="monotone" dataKey="m" stroke="#737373" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="h" stroke="#f97316" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="n" stroke="#14b8a6" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </section>
        </main>
      </div>
    </div>
  );
}

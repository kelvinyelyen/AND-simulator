'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePhaseSpaceStore } from '@/store/phaseSpaceSimulation';
import { ConceptDialog } from '@/components/guide/ConceptDialog';
import { phaseSpaceContent } from './content';
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
import { cn } from '@/lib/utils';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function PhaseSpaceLab() {
  const {
    params,
    setParams,
    history,
    isRunning,
    setIsRunning,
    resetSimulation,
    step,
    hoveredTerm,
    setHoveredTerm,
    v,
    w
  } = usePhaseSpaceStore();

  const requestRef = useRef<number>();

  const animate = useCallback(() => {
    if (isRunning) {
      // Step multiple times per frame for speed
      for (let i = 0; i < 5; i++) {
        step();
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [isRunning, step]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  // Generate Nullclines for plotting
  const vNullcline = [];
  const wNullcline = [];
  for (let x = -2.5; x <= 2.5; x += 0.1) {
    // dV/dt = 0 => w = v - v^3/3 + I
    vNullcline.push({ v: x, w: x - Math.pow(x, 3) / 3 + params.I });
    // dW/dt = 0 => w = (v + a) / b
    wNullcline.push({ v: x, w: (x + params.a) / params.b });
  }

  // Format history for scatter plot (phase portrait)
  const phaseData = history.map(p => ({ v: p.v, w: p.w }));

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
            Please access this simulation on a Desktop or Tablet.
          </p>
        </div>
      </div>

      {/* DESKTOP CONTENT */}
      <div className="hidden md:flex flex-col h-full">
        {/* Header */}
        <header className="h-14 border-b border-zinc-900 flex items-center justify-between px-6 bg-zinc-950 shrink-0">
          <div className="flex items-center gap-4">
            <Activity className="w-5 h-5 text-emerald-500" />
            <h1 className="text-base font-semibold tracking-tight text-white">
              <Link href="/" className="hover:opacity-80 transition-opacity">AND</Link>
              <span className="mx-3 text-zinc-700">/</span>
              <span className="text-zinc-400 font-medium">Phase Space Biophysics</span>
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
            <ConceptDialog {...phaseSpaceContent} />
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden p-6 gap-6">
          {/* Left Panel: Sidebar */}
          <aside className="w-[400px] flex flex-col shrink-0 overflow-hidden bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-sm">
            <div className="h-full flex flex-col p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden">

              {/* Equations */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FunctionSquare className="w-3.5 h-3.5 text-zinc-600" />
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 font-mono">FitzHugh-Nagumo Model</span>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 flex flex-col items-center justify-center border border-zinc-800/30 text-zinc-200 gap-2">
                    <div
                      className={cn("p-2 rounded transition-colors w-full flex justify-center", hoveredTerm === 'dv' ? 'bg-emerald-950/30 text-emerald-400' : '')}
                      onMouseEnter={() => setHoveredTerm('dv')} onMouseLeave={() => setHoveredTerm(null)}
                    >
                      <BlockMath math="\frac{dv}{dt} = v - \frac{v^3}{3} - w + I_{ext}" />
                    </div>
                    <div
                      className={cn("p-2 rounded transition-colors w-full flex justify-center", hoveredTerm === 'dw' ? 'bg-blue-950/30 text-blue-400' : '')}
                      onMouseEnter={() => setHoveredTerm('dw')} onMouseLeave={() => setHoveredTerm(null)}
                    >
                      <BlockMath math="\frac{dw}{dt} = \frac{1}{\tau} (v + a - b \cdot w)" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4 pt-6 mt-6 border-t border-zinc-800/50">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white font-mono">Parameters</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono bg-zinc-950/50 p-2 rounded border border-amber-500/20 gap-3">
                    <span className="text-zinc-400 w-24 shrink-0">Current (I)</span>
                    <Slider
                      min={0} max={2} step={0.01}
                      value={[params.I]}
                      onValueChange={(val) => setParams({ I: val[0] })}
                      className="flex-1 cursor-pointer [&_[role=slider]]:bg-amber-500"
                    />
                    <span className="text-amber-500 font-bold w-12 text-right tabular-nums">{params.I.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono bg-zinc-950/50 p-2 rounded border border-zinc-800/50 gap-3">
                    <span className="text-zinc-400 w-24 shrink-0">Param (a)</span>
                    <Slider
                      min={0} max={1} step={0.01}
                      value={[params.a]}
                      onValueChange={(val) => setParams({ a: val[0] })}
                      className="flex-1 cursor-pointer"
                    />
                    <span className="text-zinc-300 font-bold w-12 text-right tabular-nums">{params.a.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono bg-zinc-950/50 p-2 rounded border border-zinc-800/50 gap-3">
                    <span className="text-zinc-400 w-24 shrink-0">Param (b)</span>
                    <Slider
                      min={0} max={1} step={0.01}
                      value={[params.b]}
                      onValueChange={(val) => setParams({ b: val[0] })}
                      className="flex-1 cursor-pointer"
                    />
                    <span className="text-zinc-300 font-bold w-12 text-right tabular-nums">{params.b.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono bg-zinc-950/50 p-2 rounded border border-zinc-800/50 gap-3">
                    <span className="text-zinc-400 w-24 shrink-0">Time (τ)</span>
                    <Slider
                      min={1} max={20} step={0.5}
                      value={[params.tau]}
                      onValueChange={(val) => setParams({ tau: val[0] })}
                      className="flex-1 cursor-pointer"
                    />
                    <span className="text-zinc-300 font-bold w-12 text-right tabular-nums">{params.tau.toFixed(1)}</span>
                  </div>
                </div>
              </div>

            </div>
          </aside>

          {/* Right Panel: Visualizations */}
          <section className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Phase Portrait */}
            <div className="flex-[2] bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col relative shadow-inner p-4">
              <div className="absolute top-4 left-4 z-10 pointer-events-none select-none flex flex-col">
                <span className="text-sm font-black text-zinc-500 font-mono tracking-tighter uppercase">
                  Phase Portrait (V vs W)
                </span>
                <div className="flex items-center gap-4 mt-2 text-[10px] font-mono font-bold">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div><span className="text-emerald-500">V-Nullcline</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div><span className="text-blue-500">W-Nullcline</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 bg-white rounded-full"></div><span className="text-white">Trajectory</span></div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" />
                  <XAxis type="number" dataKey="v" domain={[-2.5, 2.5]} name="Voltage" tick={{ fill: '#52525b', fontSize: 10 }} />
                  <YAxis type="number" dataKey="w" domain={[-1, 2]} name="Recovery" tick={{ fill: '#52525b', fontSize: 10 }} />
                  <ZAxis range={[10, 10]} />

                  {/* Nullclines plotted as lines */}
                  <Scatter data={vNullcline} fill="#10b981" line={{ stroke: '#10b981', strokeWidth: 2 }} shape={() => <></>} />
                  <Scatter data={wNullcline} fill="#3b82f6" line={{ stroke: '#3b82f6', strokeWidth: 2 }} shape={() => <></>} />

                  {/* Trajectory */}
                  <Scatter data={phaseData} fill="#ffffff" line={{ stroke: '#ffffff', strokeWidth: 2 }} shape={() => <></>} />

                  {/* Current State Point */}
                  <Scatter data={[{ v, w }]} fill="#ef4444" shape="circle" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Time Series */}
            <div className="flex-[1] bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col relative shadow-inner p-4">
              <div className="absolute top-4 left-4 z-10 pointer-events-none select-none flex flex-col">
                <span className="text-sm font-black text-zinc-500 font-mono tracking-tighter uppercase">
                  Time Series
                </span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                  <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} hide />
                  <YAxis domain={[-2.5, 2.5]} hide />
                  <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="w" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

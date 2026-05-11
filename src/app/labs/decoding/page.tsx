'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useDecodingStore } from '@/store/decodingSimulation';
import { ConceptDialog } from '@/components/guide/ConceptDialog';
import { decodingContent } from './content';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Activity, FunctionSquare, Zap } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function DecodingLab() {
  const {
    params,
    setParams,
    neurons,
    spikes,
    decodedAngle,
    error,
    triggerStimulus
  } = useDecodingStore();

  // Re-trigger automatically when angle changes to give fluid feedback
  useEffect(() => {
    triggerStimulus();
  }, [params.trueAngle, triggerStimulus]);

  // Format data for the bar chart
  const barData = neurons.map((n, i) => ({
    id: n.id,
    angle: n.preferredAngle,
    spikes: spikes[i].count
  }));

  // Create tuning curve visualization data
  const tuningData = [];
  for (let a = 0; a < 360; a += 5) {
    // Just show a few representative tuning curves
    const repNeurons = [neurons[0], neurons[Math.floor(neurons.length/3)], neurons[Math.floor(2*neurons.length/3)]];
    const pt: Record<string, number> = { angle: a };
    repNeurons.forEach((n, i) => {
        let diff = Math.abs(a - n.preferredAngle) % 360;
        if (diff > 180) diff = 360 - diff;
        pt[`n${i}`] = n.fMax * Math.exp(-(diff * diff) / (2 * n.sigma * n.sigma));
    });
    tuningData.push(pt);
  }

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
            <span className="text-zinc-400 font-medium">Neural Decoding</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ConceptDialog {...decodingContent} />
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        <aside className="w-[400px] flex flex-col shrink-0 overflow-hidden bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-sm">
          <div className="h-full flex flex-col p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FunctionSquare className="w-3.5 h-3.5 text-zinc-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-600 font-mono">Poisson Spiking</span>
                </div>
                <div className="bg-black/30 rounded-xl p-4 flex flex-col items-center justify-center border border-zinc-800/30 text-zinc-200 text-sm">
                  <BlockMath math="\lambda_i(\theta) = f_{max} e^{-\frac{(\theta - \phi_i)^2}{2\sigma^2}}" />
                  <BlockMath math="P(k \text{ spikes}) = \frac{\lambda^k e^{-\lambda}}{k!}" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 mt-6 border-t border-zinc-800/50">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white font-mono">Stimulus</span>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col bg-zinc-950/50 p-4 rounded-xl border border-amber-500/30 gap-4">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-amber-400 font-bold tracking-widest uppercase">True Angle <InlineMath math="\theta"/></span>
                    <span className="text-white font-black text-lg">{params.trueAngle}°</span>
                  </div>
                  <Slider min={0} max={359} step={1} value={[params.trueAngle]} onValueChange={(val) => setParams({ trueAngle: val[0] })} className="[&_[role=slider]]:bg-amber-400" />
                </div>
                <Button onClick={triggerStimulus} className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold h-10 border border-zinc-700">
                  Resample Noise (New Trial)
                </Button>
              </div>
            </div>

            <div className="space-y-4 pt-6 mt-6 border-t border-zinc-800/50">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white font-mono">Population Parameters</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-mono bg-zinc-950/50 p-2 rounded border border-zinc-800/50 gap-3">
                  <span className="text-zinc-400 w-24 shrink-0">Spread <InlineMath math="\sigma"/></span>
                  <Slider min={5} max={90} step={5} value={[params.sigma]} onValueChange={(val) => setParams({ sigma: val[0] })} className="flex-1" />
                  <span className="text-zinc-300 font-bold w-12 text-right tabular-nums">{params.sigma}°</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono bg-zinc-950/50 p-2 rounded border border-zinc-800/50 gap-3">
                  <span className="text-zinc-400 w-24 shrink-0">Time Win</span>
                  <Slider min={50} max={1000} step={50} value={[params.timeWindow]} onValueChange={(val) => setParams({ timeWindow: val[0] })} className="flex-1" />
                  <span className="text-zinc-300 font-bold w-12 text-right tabular-nums">{params.timeWindow}ms</span>
                </div>
              </div>
            </div>
            
            {/* Decoding Results */}
            <div className="mt-8 space-y-3">
                <div className="flex justify-between items-center bg-emerald-950/30 p-3 rounded-lg border border-emerald-900/50">
                    <span className="text-xs text-emerald-500 font-bold uppercase tracking-widest">Decoded <InlineMath math="\hat{\theta}"/></span>
                    <span className="text-emerald-400 font-black text-xl">{decodedAngle.toFixed(1)}°</span>
                </div>
                <div className="flex justify-between items-center bg-rose-950/30 p-3 rounded-lg border border-rose-900/50">
                    <span className="text-xs text-rose-500 font-bold uppercase tracking-widest">Error</span>
                    <span className="text-rose-400 font-black text-lg">{error.toFixed(1)}°</span>
                </div>
            </div>

          </div>
        </aside>

        <section className="flex-1 flex flex-col gap-6 min-w-0">
          
          <div className="flex-[1] bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col relative shadow-inner p-4">
            <span className="absolute top-4 left-4 z-10 text-sm font-black text-zinc-500 font-mono uppercase tracking-tighter">Population Response (Spike Count vs Preferred Angle)</span>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 40, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                <XAxis dataKey="angle" type="number" domain={[0, 360]} tickCount={9} stroke="#52525b" />
                <YAxis domain={[0, 'dataMax + 5']} stroke="#52525b" />
                <ReferenceLine x={params.trueAngle} stroke="#fbbf24" strokeWidth={2} strokeDasharray="3 3" label={{ position: 'top', value: 'TRUE', fill: '#fbbf24', fontSize: 10 }} />
                <ReferenceLine x={decodedAngle} stroke="#10b981" strokeWidth={2} label={{ position: 'top', value: 'DECODED', fill: '#10b981', fontSize: 10 }} />
                <Bar dataKey="spikes" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#3b82f6" opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

        </section>
      </main>
      </div>
    </div>
  );
}

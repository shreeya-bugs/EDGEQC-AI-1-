import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, TrendingUp, MessageCircle, BarChart2, Layers } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PredictiveAlertCard } from '../../components/predictive/PredictiveAlertCard';
import { WhatsAppReportModal } from '../../components/whatsapp/WhatsAppReportModal';
import { DefectFlashcardModal } from '../../components/flashcards/DefectFlashcardModal';
import { useLanguage } from '../../context/LanguageContext';


const weeklyData = [
  { day: 'Mon', passRate: 98.2, defectCount: 18 },
  { day: 'Tue', passRate: 97.8, defectCount: 22 },
  { day: 'Wed', passRate: 96.5, defectCount: 35 },
  { day: 'Thu', passRate: 98.9, defectCount: 11 },
  { day: 'Fri', passRate: 95.4, defectCount: 46 },
  { day: 'Sat', passRate: 97.1, defectCount: 29 },
  { day: 'Sun', passRate: 98.6, defectCount: 14 }
];

const machines = [
  { id: 'm1', name: 'Machine 1 (Line 1)', status: 'running', temp: '42°C', vibration: '0.8 mm/s', ppm: 1450, defectRate: '1.2%', health: 98 },
  { id: 'm2', name: 'Machine 2 (Line 3)', status: 'warning', temp: '54°C', vibration: '2.4 mm/s', ppm: 1320, defectRate: '3.8%', health: 84 },
  { id: 'm3', name: 'Machine 3 (Line 2)', status: 'running', temp: '48°C', vibration: '1.2 mm/s', ppm: 1400, defectRate: '2.1%', health: 92 }
];

const defectHeatmap = [
  { machine: 'Machine 1', SurfaceScratch: 3, Misalignment: 5, Smudge: 2, MissingPrint: 1 },
  { machine: 'Machine 2', SurfaceScratch: 14, Misalignment: 22, Smudge: 8, MissingPrint: 4 },
  { machine: 'Machine 3', SurfaceScratch: 18, Misalignment: 9, Smudge: 6, MissingPrint: 2 }
];

export const FactoryHealthDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [activeFlashcardId, setActiveFlashcardId] = useState<string | null>(null);

  const overallHealthScore = 94;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            {t.factoryHealth}
          </h1>
          <p className="text-xs text-slate-400">Real-Time Telemetry, Predictive AI Risk & Machine Diagnostics</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveFlashcardId('surface_scratch')}
            className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
          >
            <Layers className="w-4 h-4 text-amber-400" /> Defect Flashcards
          </button>

          <button
            onClick={() => setShowWhatsAppModal(true)}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
          >
            <MessageCircle className="w-4 h-4" /> {t.sendWhatsAppReport}
          </button>
        </div>
      </div>

      {/* Feature 9: Predictive AI Alert Banner */}
      <PredictiveAlertCard />

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Factory Health Score Ring Card (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              OEE Metric
            </span>
          </div>

          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">{t.healthScore}</h3>

          {/* Circular SVG Progress Ring */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="8" fill="none" />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#cyan-gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 * (1 - overallHealthScore / 100) }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white font-mono">{overallHealthScore}</span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Optimal</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center mt-4">
            Factory operating at <strong className="text-cyan-300">94.0% efficiency</strong> across 3 active production lines.
          </p>
        </div>

        {/* Machine Health Status Grid (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" /> Machine Health Telemetry
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {machines.map(m => (
              <div
                key={m.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-white">{m.name}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                    m.status === 'running' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {m.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 mt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Temp:</span>
                    <span className="font-mono text-cyan-300 font-medium">{m.temp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vibration:</span>
                    <span className="font-mono text-cyan-300 font-medium">{m.vibration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Speed PPM:</span>
                    <span className="font-mono text-emerald-400 font-semibold">{m.ppm} PPM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Defect Rate:</span>
                    <span className="font-mono text-rose-400 font-bold">{m.defectRate}</span>
                  </div>
                </div>

                {/* Mini Health Bar */}
                <div className="mt-3 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Health Index</span>
                    <span className="font-mono font-bold text-white">{m.health}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${m.health > 90 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                      style={{ width: `${m.health}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Quality Trend Chart & Defect Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recharts Area Chart (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Weekly Quality Pass Rate % Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="passGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[90, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="passRate" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#passGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Defect Heatmap Matrix (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-amber-400" /> Machine Defect Matrix Heatmap
          </h3>

          <div className="space-y-3">
            {defectHeatmap.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <p className="text-xs font-bold text-white mb-2">{item.machine}</p>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-center">
                  <div className="p-1.5 rounded bg-rose-500/10 border border-rose-500/20">
                    <span className="block text-slate-400">Scratch</span>
                    <span className="font-mono font-bold text-rose-400">{item.SurfaceScratch}</span>
                  </div>
                  <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/20">
                    <span className="block text-slate-400">Skew</span>
                    <span className="font-mono font-bold text-amber-400">{item.Misalignment}</span>
                  </div>
                  <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/20">
                    <span className="block text-slate-400">Smudge</span>
                    <span className="font-mono font-bold text-blue-400">{item.Smudge}</span>
                  </div>
                  <div className="p-1.5 rounded bg-purple-500/10 border border-purple-500/20">
                    <span className="block text-slate-400">Missing</span>
                    <span className="font-mono font-bold text-purple-400">{item.MissingPrint}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WhatsApp Modal Launch */}
      {showWhatsAppModal && <WhatsAppReportModal onClose={() => setShowWhatsAppModal(false)} />}

      {/* Defect Flashcard Modal Launch */}
      {activeFlashcardId && <DefectFlashcardModal initialDefectId={activeFlashcardId} onClose={() => setActiveFlashcardId(null)} />}
    </div>
  );
};

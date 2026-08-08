import React from 'react';
import {
  BarChart3,
  DollarSign,
  Award,
  Factory,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import {
  MOCK_MACHINE_PERFORMANCE,
  MOCK_SHIFT_PERFORMANCE,
} from '../../data/mockData';
import type { PeriodFilter } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const OwnerAnalytics: React.FC = () => {
  const { periodFilter, setPeriodFilter, getPeriodMetrics } = useInspection();
  const metrics = getPeriodMetrics(periodFilter);
  const machineData = MOCK_MACHINE_PERFORMANCE[periodFilter];
  const shiftData = MOCK_SHIFT_PERFORMANCE[periodFilter];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              EXECUTIVE ANALYTICS
            </span>
            <span className="text-slate-400 text-xs font-mono">• Financial & Yield Telemetry</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
            <BarChart3 className="text-emerald-400" size={24} />
            Plant Financial Yield & Defect Telemetry
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Correlate press line speeds, substrate waste costs, First-Pass Yield (FPY), and operator shift telemetry.
          </p>
        </div>

        {/* Period Filter Switcher */}
        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold px-2 font-mono uppercase">Period:</span>
          {(['today', 'week', 'month'] as PeriodFilter[]).map((period) => (
            <button
              key={period}
              onClick={() => setPeriodFilter(period)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${
                periodFilter === period
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Financial & Yield ROI Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-5 rounded-xl border border-emerald-800/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider font-mono">Substrate Waste Prevention</span>
            <DollarSign className="text-emerald-400" size={20} />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400">
            ₹{metrics.estimatedScrapSavings.toLocaleString()}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Saved in packaging film foil substrate costs by catching early recurring misalignments.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-mono">First-Pass Yield (FPY)</span>
            <Award className="text-amber-500" size={20} />
          </div>
          <div className="text-3xl font-black font-mono text-slate-900">
            {metrics.passRate.toFixed(1)}%
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Overall plant batch acceptance without secondary rework or manual sorting.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-mono">Customer Claim Risk</span>
            <Sparkles className="text-blue-500" size={20} />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-700">
            0.02%
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Zero critical barcode readability rejections reported by pharmaceutical clients.
          </p>
        </div>
      </div>

      {/* Machine Performance Breakdown */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Factory size={18} className="text-blue-600" />
              Machine-wise Quality & Volume Performance
            </h2>
            <p className="text-[11px] text-slate-500">Comparison across Flexo Press, Digital Inkjet, and Rotary Die Cutter</p>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
            3 Active Press Lines
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={machineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="machineName" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip formatter={(val: any, name: any) => [(val ?? 0).toLocaleString(), name === 'inspected' ? 'Units Inspected' : 'Defect Count']} />
              <Legend />
              <Bar dataKey="inspected" fill="#3b82f6" name="Inspected Units" radius={[4, 4, 0, 0]} />
              <Bar dataKey="defectCount" fill="#ef4444" name="Defect Units" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {machineData.map((mch) => (
            <div key={mch.code} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{mch.machineName}</span>
                <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                  {mch.code}
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between font-mono">
                <span className="text-xs text-slate-500">Pass Rate:</span>
                <span className="font-bold text-emerald-700 text-sm">
                  {mch.inspected > 0 ? `${mch.passRate.toFixed(1)}%` : 'N/A'}
                </span>
              </div>
              <div className="flex items-baseline justify-between font-mono text-xs mt-1">
                <span className="text-slate-500">Defects:</span>
                <span className="font-bold text-amber-700">{mch.defectCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shift Breakdown */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Layers size={18} className="text-purple-600" />
            Shift-wise Quality Benchmarking
          </h2>
          <p className="text-[11px] text-slate-500 font-mono">Comparative analysis across Shift A (Morning), Shift B (Evening), and Shift C (Night)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shiftData.map((s) => (
            <div key={s.shift} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-xs text-slate-800 block">{s.shift}</span>
              <div className="flex items-baseline justify-between font-mono text-xs">
                <span className="text-slate-500">Inspected Volume:</span>
                <span className="font-bold text-slate-900">{s.inspected > 0 ? s.inspected.toLocaleString() : '0'}</span>
              </div>
              <div className="flex items-baseline justify-between font-mono text-xs">
                <span className="text-slate-500">Pass Rate:</span>
                <span className="font-bold text-emerald-700">{s.inspected > 0 ? `${s.passRate.toFixed(1)}%` : '100%'}</span>
              </div>
              <div className="flex items-baseline justify-between font-mono text-xs">
                <span className="text-slate-500">Total Defects:</span>
                <span className="font-bold text-amber-700">{s.defectCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

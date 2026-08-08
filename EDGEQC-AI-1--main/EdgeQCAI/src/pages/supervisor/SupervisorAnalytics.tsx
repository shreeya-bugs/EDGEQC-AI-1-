import React from 'react';
import {
  BarChart3,
  CheckSquare,
  AlertOctagon,
  TrendingUp,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const SupervisorAnalytics: React.FC = () => {
  const { sessionStats, recurringAlerts } = useInspection();

  const hourlyData = [
    { hour: '06:00', pass: 640, fail: 12 },
    { hour: '07:00', pass: 710, fail: 22 },
    { hour: '08:00', pass: 680, fail: 35 },
    { hour: '09:00', pass: 750, fail: 19 },
    { hour: '10:00', pass: 810, fail: 8 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-purple-900 text-white p-6 rounded-xl border border-purple-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-800 text-purple-200 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              SUPERVISOR ANALYTICS
            </span>
            <span className="text-purple-300 text-xs font-mono">• Shift Defect Telemetry</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
            <BarChart3 className="text-purple-300" size={24} />
            Defect Trend & Checklist Compliance
          </h1>
          <p className="text-xs text-purple-200 mt-1 max-w-2xl">
            Shift-level defect hourly telemetry, recurring pattern alerts, and operator corrective action compliance.
          </p>
        </div>

        <div className="bg-purple-950 px-3.5 py-2 rounded-lg border border-purple-700 text-xs font-mono text-slate-200">
          Shift A Telemetry • 100% Checklist Compliance
        </div>
      </div>

      {/* Hourly Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp size={18} className="text-purple-700" />
              Hourly Shift Telemetry Breakdown
            </h2>
            <p className="text-[11px] text-slate-500 font-mono">Shift A hourly pass vs defective volume</p>
          </div>
          <span className="text-xs font-mono bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded border border-emerald-200">
            Pass Rate: {sessionStats.passRate}%
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip />
              <Bar dataKey="pass" fill="#16a34a" name="Pass Units" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fail" fill="#dc2626" name="Defective Units" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Operator Checklist Compliance & Alert Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Checklist Compliance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CheckSquare size={18} className="text-emerald-600" />
            <h2 className="font-bold text-sm text-slate-900">Operator Corrective Action Compliance</h2>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
              <span className="font-semibold text-emerald-900">Feed Tension & Roller Adjustment</span>
              <span className="text-[10px] font-mono font-bold uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">Completed</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
              <span className="font-semibold text-emerald-900">Doctor Blade Wiper Unit Cleaning</span>
              <span className="text-[10px] font-mono font-bold uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">Completed</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
              <span className="font-semibold text-emerald-900">Printhead Purge & Manifold Check</span>
              <span className="text-[10px] font-mono font-bold uppercase bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">Completed</span>
            </div>
          </div>
        </div>

        {/* Shift Alerts Log */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertOctagon size={18} className="text-amber-600" />
            <h2 className="font-bold text-sm text-slate-900">Shift Recurring Alerts Log</h2>
          </div>
          <div className="space-y-2 text-xs">
            {recurringAlerts.map((alt) => (
              <div key={alt.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900">{alt.title}</span>
                  <span className="text-[10px] font-mono text-amber-700">{alt.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-700">{alt.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

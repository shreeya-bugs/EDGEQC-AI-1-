import React from 'react';
import {
  Factory,
  Play,
  Gauge,
  UserCheck,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { MOCK_MACHINES, MOCK_SKUS } from '../../data/mockData';

export const SupervisorLinePerformance: React.FC = () => {
  const { activeJob } = useInspection();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-purple-900 text-white p-6 rounded-xl border border-purple-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-800 text-purple-200 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              SUPERVISOR CONTROL
            </span>
            <span className="text-purple-300 text-xs font-mono">• Line Supervision</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
            <Factory className="text-purple-300" size={24} />
            Press Line Performance Monitor
          </h1>
          <p className="text-xs text-purple-200 mt-1 max-w-2xl">
            Real-time speed telemetry, web tension state, active job allocation, and operator shift assignments across press lines.
          </p>
        </div>

        <div className="bg-purple-950 px-3.5 py-2 rounded-lg border border-purple-700 text-xs font-mono text-emerald-400 font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          3 / 3 Lines Active
        </div>
      </div>

      {/* Press Lines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {MOCK_MACHINES.map((mch, idx) => {
          const isCurrentActive = mch.id === activeJob.machine.id;
          const assignedSku = isCurrentActive ? activeJob.sku : MOCK_SKUS[(idx + 1) % MOCK_SKUS.length];

          return (
            <div
              key={mch.id}
              className={`bg-white rounded-xl border p-5 space-y-4 shadow-xs transition-all ${
                isCurrentActive ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">{mch.code}</span>
                  <h3 className="font-bold text-slate-900 text-base">{mch.name}</h3>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  {mch.status}
                </span>
              </div>

              {/* Specs & Speed */}
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Press Type:</span>
                  <span className="font-bold text-slate-900">{mch.type}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Active SKU:</span>
                  <span className="font-bold text-emerald-700 truncate max-w-[140px]">{assignedSku.code}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Target Speed:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Gauge size={13} className="text-blue-600" />
                    {assignedSku.targetSpeedPpm} PPM
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-[11px] font-mono text-slate-600">
                  <span>Batch Completion:</span>
                  <span className="font-bold text-slate-900">
                    {isCurrentActive ? Math.round((activeJob.inspectedQuantity / activeJob.targetQuantity) * 100) : 45}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${isCurrentActive ? Math.round((activeJob.inspectedQuantity / activeJob.targetQuantity) * 100) : 45}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <UserCheck size={13} className="text-purple-600" /> Rajesh K.
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Play size={12} /> Line Normal
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

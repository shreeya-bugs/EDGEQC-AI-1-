import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Filter,
  Eye,
  AlertTriangle,
  Layers,
  Wrench,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';

export const SupervisorQualityIntelligence: React.FC = () => {
  const navigate = useNavigate();
  const { supervisorAlerts } = useInspection();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredAlerts = supervisorAlerts.filter(
    (alert) => filterType === 'all' || alert.alertType === filterType
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-purple-900 text-white p-6 rounded-xl border border-purple-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500 text-slate-950 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              QUALITY INTELLIGENCE
            </span>
            <span className="text-purple-300 text-xs font-mono">• Abnormal Defect Patterns</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
            <Zap className="text-amber-400" size={24} />
            Abnormal Quality & Pattern Alerts
          </h1>
          <p className="text-xs text-purple-200 mt-1 max-w-2xl">
            AI-flagged recurring defect trends, shift frequency surges, and substrate-specific anomalies with prescribed investigation targets.
          </p>
        </div>

        <div className="bg-purple-950 px-3.5 py-2 rounded-lg border border-purple-700 text-xs font-mono text-amber-300 font-bold">
          {supervisorAlerts.length} Active Intelligence Signals
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-purple-700" />
          <span className="text-xs font-bold text-slate-800 font-mono">Pattern Type Filter:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Patterns' },
            { id: 'recurring', label: 'Recurring Defects' },
            { id: 'shift_pattern', label: 'Shift Surges' },
            { id: 'sku_pattern', label: 'SKU Anomalies' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === item.id
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Intelligence Cards Grid */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all p-6 space-y-4"
          >
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded border ${
                    alert.severity === 'critical'
                      ? 'bg-red-100 text-red-800 border-red-300'
                      : alert.severity === 'high'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-blue-100 text-blue-800 border-blue-300'
                  }`}
                >
                  Severity: {alert.severity.toUpperCase()}
                </span>

                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300">
                  +{alert.percentageChange}% Frequency Increase
                </span>

                <h3 className="font-bold text-lg text-slate-900">{alert.title}</h3>
              </div>

              <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                <AlertTriangle size={14} className="text-amber-600" />
                {alert.occurrencesToday} occurrences today
              </span>
            </div>

            {/* Context Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">SKU Code & Name</span>
                <span className="font-bold text-slate-900 block mt-0.5">{alert.skuCode}</span>
                <span className="text-slate-600 text-[11px] truncate block font-sans">{alert.skuName}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Assigned Machine Line</span>
                <span className="font-bold text-slate-900 block mt-0.5">{alert.machineName}</span>
                <span className="text-slate-600 text-[11px]">Active Production Run</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Shift Telemetry</span>
                <span className="font-bold text-slate-900 block mt-0.5">{alert.shift}</span>
                <span className="text-slate-600 text-[11px]">Pattern Shift Segment</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Defect Classification</span>
                <span className="font-bold text-amber-700 text-sm block mt-0.5">{alert.defectType}</span>
                <span className="text-slate-600 text-[11px]">AI Vision Flag</span>
              </div>
            </div>

            {/* Recommended Investigation & Possible Process Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-purple-50/80 border border-purple-200 rounded-lg space-y-1.5">
                <span className="font-bold text-purple-900 flex items-center gap-1.5 font-mono text-xs">
                  <Wrench size={14} className="text-purple-700" />
                  Recommended Investigation
                </span>
                <p className="text-slate-700 text-xs leading-relaxed font-sans">
                  {alert.recommendedInvestigation}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 font-mono text-xs">
                  <Layers size={14} className="text-slate-600" />
                  Possible Process Areas
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {alert.possibleProcessAreas.map((area, idx) => (
                    <span key={idx} className="bg-white px-2.5 py-1 rounded border border-slate-300 text-[11px] font-mono font-semibold text-slate-700">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Prescribed Operator Checks */}
            {alert.recommendedChecks && alert.recommendedChecks.length > 0 && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs space-y-1">
                <span className="font-bold text-amber-900 font-mono text-[11px]">Recommended Checklist Verification:</span>
                <ul className="list-disc list-inside text-slate-700 text-[11px] space-y-0.5 font-sans">
                  {alert.recommendedChecks.map((chk, idx) => (
                    <li key={idx}>{chk}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-mono text-xs">
              <span className="text-slate-400">Timestamp: {alert.timestamp}</span>
              <button
                onClick={() =>
                  navigate(`/supervisor/inspections?sku=${alert.skuCode}&machine=${alert.machineId}&defect=${alert.defectType}`)
                }
                className="flex items-center gap-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors font-sans shadow-xs"
              >
                <Eye size={15} /> VIEW INSPECTIONS &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Play,
  Layers,
  Activity,
  History,
  ArrowRight,
  Gauge,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { InspectionDetailModal } from '../../components/common/InspectionDetailModal';

export const OperatorOverview: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeJob,
    sessionStats,
    inspectionHistory,
    recurringAlerts,
    selectedHistoryRecord,
    setSelectedHistoryRecord,
    acknowledgeRecord,
  } = useInspection();

  const recentInspections = inspectionHistory.slice(0, 7);
  const activeAlert = recurringAlerts.find((a) => !a.acknowledged);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Main Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Operator Inspection Dashboard</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Shift A • Line: <span className="font-semibold text-slate-700">{activeJob.machine.name}</span> • Operator: <span className="font-semibold text-slate-700">Rajesh Kumar</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/operator/setup')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            <Sliders size={14} />
            <span>Job Setup</span>
          </button>
          <button
            onClick={() => navigate('/operator/live')}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Play size={15} className="fill-white" />
            <span>Start Live Inspection</span>
          </button>
        </div>
      </div>

      {/* Amber Recurring Alert Notification Banner if present */}
      {activeAlert && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-xs flex items-start justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-amber-900 uppercase tracking-wide">
                  Recurring Issue Warning
                </span>
                <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                  {activeAlert.occurrences} Occurrences
                </span>
              </div>
              <p className="text-xs font-semibold text-amber-950 mt-1">{activeAlert.message}</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                SKU: <span className="font-mono">{activeAlert.skuCode}</span> • Timeframe: {activeAlert.timeframe}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/operator/live')}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors shrink-0"
          >
            View Live Intelligence
          </button>
        </div>
      )}

      {/* Today's Inspection Counters KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inspected */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Today Inspected</span>
            <Activity size={16} className="text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {sessionStats.totalInspected.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">Units</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 border-t border-slate-100 pt-2 font-mono">
            Target Batch: {activeJob.targetQuantity.toLocaleString()}
          </div>
        </div>

        {/* Pass Count */}
        <div className="bg-white p-4 rounded-lg border border-emerald-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold uppercase tracking-wider">
            <span>Pass Units</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700 font-mono">
              {sessionStats.passCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-700 font-bold">PASS</span>
          </div>
          <div className="mt-2 text-[10px] text-emerald-700 border-t border-emerald-100 pt-2 font-mono">
            Clean quality prints
          </div>
        </div>

        {/* Fail Count */}
        <div className="bg-white p-4 rounded-lg border border-red-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-red-800 text-xs font-semibold uppercase tracking-wider">
            <span>Defect / Fail</span>
            <XCircle size={16} className="text-red-600" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-red-700 font-mono">
              {sessionStats.failCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-red-700 font-bold">FAIL</span>
          </div>
          <div className="mt-2 text-[10px] text-red-700 border-t border-red-100 pt-2 font-mono">
            Quality issues logged
          </div>
        </div>

        {/* Pass Rate % */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Quality Pass Rate</span>
            <Gauge size={16} className="text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span
              className={`text-2xl font-black font-mono ${
                sessionStats.passRate >= 95 ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {sessionStats.passRate}%
            </span>
            <span className="text-[11px] text-slate-500">Benchmark: 95.0%</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 border-t border-slate-100 pt-2 font-mono">
            Avg AI Confidence: {(sessionStats.avgConfidence * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Active Job Information & Quick Setup Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-emerald-600" />
            <h2 className="font-bold text-sm text-slate-900">Current Production Job</h2>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-mono font-bold px-2 py-0.5 rounded border border-emerald-300">
            JOB ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Job / Batch ID</span>
            <span className="font-bold text-slate-900 text-sm font-mono">{activeJob.jobId}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">SKU Description</span>
            <span className="font-bold text-slate-900">{activeJob.sku.name}</span>
            <span className="text-slate-500 block text-[10px] font-mono mt-0.5">{activeJob.sku.code}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Machine Line</span>
            <span className="font-bold text-slate-900">{activeJob.machine.name}</span>
            <span className="text-slate-500 block text-[10px]">{activeJob.machine.type}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Shift & Speed</span>
            <span className="font-bold text-slate-900">{activeJob.shift}</span>
            <span className="text-slate-500 block text-[10px] font-mono mt-0.5">
              Target: {activeJob.sku.targetSpeedPpm} PPM
            </span>
          </div>
        </div>
      </div>

      {/* Recent Inspections Log Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={16} className="text-slate-600" />
            <h2 className="font-bold text-sm text-slate-900">Recent Inspection Logs</h2>
          </div>
          <button
            onClick={() => navigate('/operator/history')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
          >
            <span>View Full History</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Inspection ID</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Result</th>
                <th className="py-2.5 px-4">Defect Type</th>
                <th className="py-2.5 px-4">AI Confidence</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {recentInspections.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-800">{record.id}</td>
                  <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">
                    {record.timestamp.split(' ')[1] || record.timestamp}
                  </td>
                  <td className="py-2.5 px-4">
                    <StatusBadge status={record.result === 'PASS' ? 'PASS' : record.defectType} size="sm" />
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-800">
                    {record.result === 'PASS' ? '—' : record.defectType}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-700">
                    {(record.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedHistoryRecord(record)}
                      className="text-slate-600 hover:text-slate-900 font-medium text-xs underline decoration-slate-300"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for viewing detailed inspection snapshot */}
      <InspectionDetailModal
        record={selectedHistoryRecord}
        onClose={() => setSelectedHistoryRecord(null)}
        onAcknowledge={acknowledgeRecord}
      />
    </div>
  );
};

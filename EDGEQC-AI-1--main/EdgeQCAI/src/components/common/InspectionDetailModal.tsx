import React from 'react';
import { X, Wrench } from 'lucide-react';
import type { InspectionRecord } from '../../types';
import { StatusBadge } from './StatusBadge';

interface InspectionDetailModalProps {
  record: InspectionRecord | null;
  onClose: () => void;
  onAcknowledge?: (recordId: string) => void;
}

export const InspectionDetailModal: React.FC<InspectionDetailModalProps> = ({
  record,
  onClose,
  onAcknowledge,
}) => {
  if (!record) return null;

  const isPass = record.result === 'PASS';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusBadge status={record.result === 'PASS' ? 'PASS' : record.defectType} size="md" />
            <div>
              <h3 className="font-bold text-sm text-slate-100">{record.id}</h3>
              <p className="text-[11px] text-slate-400 font-mono">{record.timestamp}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Main Inspection Canvas Snapshot */}
          <div className="relative bg-slate-950 rounded-lg p-4 border border-slate-800 flex items-center justify-center min-h-[220px]">
            <div className="w-full max-w-md aspect-video bg-amber-50/90 border-2 border-slate-300 rounded relative p-3 flex flex-col justify-between shadow-inner">
              <div className="flex justify-between items-start border-b border-amber-200 pb-1">
                <div>
                  <span className="font-bold text-xs text-amber-900 block">{record.skuName}</span>
                  <span className="text-[10px] text-amber-700 font-mono">{record.skuCode} • BATCH: {record.jobId}</span>
                </div>
                <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-mono">250 ml / Rx</span>
              </div>

              <div className="my-2 space-y-1">
                <div className="h-2 bg-slate-800/20 rounded w-3/4"></div>
                <div className="h-2 bg-slate-800/20 rounded w-1/2"></div>
                <div className="h-2 bg-slate-800/20 rounded w-5/6"></div>
              </div>

              <div className="flex justify-between items-end border-t border-amber-200 pt-1">
                <div className="font-mono text-[9px] text-slate-600">||||| | |||| ||| ||||</div>
                <span className="text-[9px] font-bold text-slate-700">EXP: 12/2028</span>
              </div>

              {!isPass && record.boundingBox && (
                <div
                  className="absolute border-2 border-red-500 bg-red-500/20 rounded flex items-start p-1 transition-all"
                  style={{
                    left: `${record.boundingBox.x}%`,
                    top: `${record.boundingBox.y}%`,
                    width: `${record.boundingBox.width}%`,
                    height: `${record.boundingBox.height}%`,
                  }}
                >
                  <span className="bg-red-600 text-white font-mono font-bold text-[9px] px-1 py-0.5 rounded shadow">
                    {record.boundingBox.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-2.5 rounded-md border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Inspection Result</span>
              <span className={`text-sm font-extrabold ${isPass ? 'text-emerald-700' : 'text-red-700'}`}>
                {isPass ? 'PASS' : record.defectType}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-md border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">AI Confidence</span>
              <span className="text-sm font-bold text-slate-800 font-mono">
                {(record.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-md border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Machine</span>
              <span className="text-xs font-semibold text-slate-800">{record.machineName}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-md border border-slate-200">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Shift</span>
              <span className="text-xs font-semibold text-slate-800">{record.shift.split(' ')[0]}</span>
            </div>
          </div>

          {!isPass && record.recommendedChecks && record.recommendedChecks.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <Wrench size={14} className="text-amber-700" />
                <span>RECOMMENDED OPERATOR CHECKS</span>
              </div>
              <ul className="space-y-1.5 pl-1">
                {record.recommendedChecks.map((check, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-amber-950 font-medium">
                    <span className="bg-amber-200 text-amber-900 font-mono text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-500">Job: {record.jobId}</span>
          <div className="flex items-center gap-2">
            {!isPass && !record.acknowledged && onAcknowledge && (
              <button
                onClick={() => onAcknowledge(record.id)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
              >
                Acknowledge Issue
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-1.5 rounded text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

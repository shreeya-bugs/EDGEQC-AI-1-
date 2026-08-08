import React, { useState } from 'react';
import { History, Search, Filter, Eye } from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { InspectionDetailModal } from '../../components/common/InspectionDetailModal';

export const InspectionHistory: React.FC = () => {
  const { inspectionHistory, selectedHistoryRecord, setSelectedHistoryRecord, acknowledgeRecord } =
    useInspection();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [resultFilter, setResultFilter] = useState<'ALL' | 'PASS' | 'FAIL'>('ALL');
  const [defectFilter, setDefectFilter] = useState<string>('ALL');

  const filteredHistory = inspectionHistory.filter((record) => {
    const matchesSearch =
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.skuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.skuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.jobId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesResult =
      resultFilter === 'ALL' || record.result === resultFilter;

    const matchesDefect =
      defectFilter === 'ALL' || record.defectType === defectFilter;

    return matchesSearch && matchesResult && matchesDefect;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History size={20} className="text-emerald-600" />
            <span>Inspection Log History</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of all inspected packaging labels, AI confidence scores, and operator acknowledgements.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
          <span className="text-slate-500">Total Logged:</span>
          <strong className="text-slate-900">{inspectionHistory.length}</strong>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, SKU code, or Job..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-600">Result:</span>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value as any)}
              className="border border-slate-300 rounded px-2 py-1 bg-white font-medium"
            >
              <option value="ALL">All Results</option>
              <option value="PASS">PASS Only</option>
              <option value="FAIL">FAIL Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Defect Type:</span>
            <select
              value={defectFilter}
              onChange={(e) => setDefectFilter(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 bg-white font-medium"
            >
              <option value="ALL">All Defects</option>
              <option value="Misalignment">Misalignment</option>
              <option value="Smudge">Smudge</option>
              <option value="Missing Print">Missing Print</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-300 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Inspection ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">SKU / Job</th>
                <th className="py-3 px-4">Machine & Shift</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Defect Classification</th>
                <th className="py-3 px-4">AI Confidence</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    No inspection logs match your search filters.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((record) => (
                  <tr
                    key={record.id}
                    onClick={() => setSelectedHistoryRecord(record)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{record.id}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {record.timestamp}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{record.skuCode}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{record.jobId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{record.machineName}</div>
                      <div className="text-[10px] text-slate-500">{record.shift.split(' ')[0]}</div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={record.result === 'PASS' ? 'PASS' : record.defectType} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {record.result === 'PASS' ? (
                        <span className="text-slate-400 font-normal">—</span>
                      ) : (
                        <span className="text-red-700">{record.defectType}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {(record.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHistoryRecord(record);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InspectionDetailModal
        record={selectedHistoryRecord}
        onClose={() => setSelectedHistoryRecord(null)}
        onAcknowledge={acknowledgeRecord}
      />
    </div>
  );
};

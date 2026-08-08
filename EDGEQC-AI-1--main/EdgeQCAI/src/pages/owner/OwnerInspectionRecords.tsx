import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  FileText,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { MOCK_SKUS, MOCK_MACHINES } from '../../data/mockData';
import type { InspectionRecord } from '../../types';

export const OwnerInspectionRecords: React.FC = () => {
  const { inspectionHistory } = useInspection();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [resultFilter, setResultFilter] = useState<'all' | 'PASS' | 'FAIL'>('all');
  const [skuFilter, setSkuFilter] = useState<string>('all');
  const [machineFilter, setMachineFilter] = useState<string>('all');
  const [defectFilter, setDefectFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<InspectionRecord | null>(null);

  const filteredRecords = inspectionHistory.filter((record) => {
    const matchesSearch =
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.skuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.jobId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResult = resultFilter === 'all' || record.result === resultFilter;
    const matchesSku = skuFilter === 'all' || record.skuCode === skuFilter;
    const matchesMachine = machineFilter === 'all' || record.machineId === machineFilter;
    const matchesDefect = defectFilter === 'all' || record.defectType === defectFilter;

    return matchesSearch && matchesResult && matchesSku && matchesMachine && matchesDefect;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              EXECUTIVE AUDIT LOG
            </span>
            <span className="text-slate-400 text-xs font-mono">• Permanent Quality Archive</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
            <Search className="text-emerald-400" size={24} />
            Inspection Records Archive
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Executive inspection log viewer with detailed bounding-box defect proofs and timestamped batch metadata.
          </p>
        </div>

        <div className="bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-700 text-xs font-mono text-slate-300 font-semibold">
          {inspectionHistory.length} Total Archival Logs
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter size={15} className="text-emerald-600" />
          <span>Record Search & Filter Controls</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-medium">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search Record ID or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Result Filter */}
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value as 'all' | 'PASS' | 'FAIL')}
            className="p-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-hidden font-semibold"
          >
            <option value="all">All Results (PASS & FAIL)</option>
            <option value="PASS">PASS Only</option>
            <option value="FAIL">FAIL Only</option>
          </select>

          {/* SKU Filter */}
          <select
            value={skuFilter}
            onChange={(e) => setSkuFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-hidden font-semibold"
          >
            <option value="all">All SKUs</option>
            {MOCK_SKUS.map((s) => (
              <option key={s.id} value={s.code}>
                {s.code}
              </option>
            ))}
          </select>

          {/* Machine Filter */}
          <select
            value={machineFilter}
            onChange={(e) => setMachineFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-hidden font-semibold"
          >
            <option value="all">All Machines</option>
            {MOCK_MACHINES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Defect Type Filter */}
          <select
            value={defectFilter}
            onChange={(e) => setDefectFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-hidden font-semibold"
          >
            <option value="all">All Defect Types</option>
            <option value="Misalignment">Misalignment</option>
            <option value="Smudge">Smudge</option>
            <option value="Missing Print">Missing Print</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-mono text-[10px] uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Inspection ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Defect Classification</th>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Machine</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No inspection records found matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{rec.id}</td>
                    <td className="py-3 px-4 text-slate-500">{rec.timestamp}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          rec.result === 'PASS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {rec.result === 'PASS' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {rec.result}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          rec.defectType === 'PASS'
                            ? 'text-slate-600'
                            : 'text-amber-700 font-bold'
                        }`}
                      >
                        {rec.defectType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-bold">{rec.skuCode}</td>
                    <td className="py-3 px-4 text-slate-600">{rec.machineName}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedRecord(rec)}
                        className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-bold font-sans hover:underline"
                      >
                        <Eye size={13} /> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Record Audit Detail</span>
                <h3 className="text-lg font-bold text-slate-900 font-mono">{selectedRecord.id}</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Snapshot Visual Representation */}
            <div className="bg-slate-900 rounded-lg p-6 text-center text-white relative h-48 flex items-center justify-center border border-slate-800">
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">AI Camera Frame Proof</span>
                <div className="text-base font-bold text-slate-200 font-mono">{selectedRecord.skuName}</div>
                {selectedRecord.result === 'FAIL' && selectedRecord.boundingBox && (
                  <div className="inline-block mt-2 px-3 py-1.5 bg-red-950 text-red-400 border border-red-800 text-xs font-mono rounded font-bold">
                    {selectedRecord.boundingBox.label}
                  </div>
                )}
              </div>
            </div>

            {/* Record Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] uppercase block font-semibold">Inspection Result</span>
                <span
                  className={`font-bold text-sm ${
                    selectedRecord.result === 'PASS' ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {selectedRecord.result} ({selectedRecord.defectType})
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase block font-semibold">SKU Code</span>
                <span className="font-bold text-slate-900">{selectedRecord.skuCode}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase block font-semibold">Machine / Line</span>
                <span className="font-bold text-slate-900">{selectedRecord.machineName}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase block font-semibold">Shift</span>
                <span className="text-slate-800">{selectedRecord.shift}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase block font-semibold">Job ID</span>
                <span className="text-slate-800">{selectedRecord.jobId}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] uppercase block font-semibold">Timestamp</span>
                <span className="text-slate-800">{selectedRecord.timestamp}</span>
              </div>
            </div>

            {/* Recommended Checks */}
            {selectedRecord.recommendedChecks && selectedRecord.recommendedChecks.length > 0 && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-1 text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1.5 text-[11px]">
                  <FileText size={14} className="text-amber-700" />
                  Prescribed Corrective Actions
                </span>
                <ul className="list-disc list-inside text-slate-700 text-[11px] space-y-0.5">
                  {selectedRecord.recommendedChecks.map((chk, idx) => (
                    <li key={idx}>{chk}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import type { QualityIssue } from '../../types';

export const OwnerQualityIssues: React.FC = () => {
  const { qualityIssues, setQualityIssues } = useInspection();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'under_review' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredIssues = qualityIssues.filter((issue) => {
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.skuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.defectType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (issueId: string, newStatus: QualityIssue['status']) => {
    setQualityIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, status: newStatus, lastUpdated: 'Just now' } : i))
    );
  };

  const getSeverityBadge = (severity: QualityIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300 font-bold';
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-300 font-medium';
    }
  };

  const getStatusBadge = (status: QualityIssue['status']) => {
    switch (status) {
      case 'active':
        return 'bg-red-950 text-red-300 border-red-800';
      case 'under_review':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'resolved':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-red-500 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              QUALITY ISSUES LOG
            </span>
            <span className="text-slate-400 text-xs font-mono">• Significant Recurring Problems</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
            <AlertTriangle className="text-amber-400" size={24} />
            Significant Recurring Quality Issues
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            High-level aggregation of repeated defect trends (e.g. 38 occurrences this week) with root cause hypotheses and financial impact.
          </p>
        </div>

        <div className="bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-700 text-xs font-mono text-amber-300 font-bold">
          {qualityIssues.filter((i) => i.status === 'active').length} Active Critical Issues
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search SKU, press line, or defect..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs focus:outline-hidden focus:border-emerald-600 font-medium"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter size={15} className="text-slate-400" />
          <span className="text-xs text-slate-500 font-semibold font-mono">Status:</span>
          {(['all', 'active', 'under_review', 'resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Quality Issues List */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500 space-y-2">
            <CheckCircle className="mx-auto text-emerald-500" size={32} />
            <span className="font-bold text-slate-800 text-sm block">No issues matching your filters</span>
            <p className="text-xs text-slate-500">All recurring defect alerts have been resolved or filtered out.</p>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-5 space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded uppercase font-mono border ${getSeverityBadge(
                      issue.severity
                    )}`}
                  >
                    {issue.severity}
                  </span>
                  <h3 className="font-bold text-base text-slate-900">{issue.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold uppercase border ${getStatusBadge(
                      issue.status
                    )}`}
                  >
                    {issue.status.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {issue.lastUpdated}
                  </span>
                </div>
              </div>

              {/* Card Main Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200/80 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block font-semibold">SKU Impacted</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{issue.skuCode}</span>
                  <span className="text-slate-600 text-[11px] truncate block">{issue.skuName}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] uppercase block font-semibold">Machine / Line</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{issue.machineName}</span>
                  <span className="text-slate-600 text-[11px]">Shift Telemetry</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] uppercase block font-semibold">Recurrence Count</span>
                  <span className="font-bold text-amber-700 text-sm block mt-0.5">
                    {issue.occurrences} occurrences
                  </span>
                  <span className="text-slate-500 text-[11px]">{issue.timeframe}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] uppercase block font-semibold">Est. Scrap Financial Loss</span>
                  <span className="font-bold text-red-600 text-sm block mt-0.5 flex items-center gap-0.5">
                    <DollarSign size={14} /> ₹{issue.estimatedFinancialLoss.toLocaleString()}
                  </span>
                  <span className="text-slate-500 text-[11px]">Packaging Substrate Waste</span>
                </div>
              </div>

              {/* Root Cause & Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg space-y-1">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5 text-[11px]">
                    <FileText size={14} className="text-amber-700" />
                    AI & Engineering Root Cause Hypothesis
                  </span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{issue.rootCauseHypothesis}</p>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-lg space-y-1">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 size={14} className="text-emerald-700" />
                    Supervisor Action Taken
                  </span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{issue.actionTaken}</p>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                {issue.status !== 'active' && (
                  <button
                    onClick={() => handleUpdateStatus(issue.id, 'active')}
                    className="px-3 py-1 rounded text-xs font-semibold bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-800 transition-colors"
                  >
                    Mark Active
                  </button>
                )}
                {issue.status !== 'under_review' && (
                  <button
                    onClick={() => handleUpdateStatus(issue.id, 'under_review')}
                    className="px-3 py-1 rounded text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
                  >
                    Mark Under Review
                  </button>
                )}
                {issue.status !== 'resolved' && (
                  <button
                    onClick={() => handleUpdateStatus(issue.id, 'resolved')}
                    className="px-3 py-1 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

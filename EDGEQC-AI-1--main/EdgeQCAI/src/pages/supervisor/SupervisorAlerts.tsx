import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle,
  Eye,
  Filter,
  Wrench,
  Clock,
  Search,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';

export const SupervisorAlerts: React.FC = () => {
  const navigate = useNavigate();
  const { supervisorAlerts, setSupervisorAlerts } = useInspection();

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredAlerts = supervisorAlerts.filter((alert) => {
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.skuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.defectType.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (id: string, newStatus: 'active' | 'acknowledged' | 'resolved') => {
    setSupervisorAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-purple-900 text-white p-6 rounded-xl border border-purple-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500 text-slate-950 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              ALERTS MANAGEMENT
            </span>
            <span className="text-purple-300 text-xs font-mono">• Active Defect Alarms</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
            <Bell className="text-amber-400" size={24} />
            Supervisor Quality Alerts Log
          </h1>
          <p className="text-xs text-purple-200 mt-1 max-w-2xl">
            Audit log of active recurring alerts, operator compliance checks, and quality alarm resolution tracking.
          </p>
        </div>

        <div className="bg-purple-950 px-3.5 py-2 rounded-lg border border-purple-700 text-xs font-mono text-amber-300 font-bold">
          {supervisorAlerts.filter((a) => a.status === 'active').length} Active Unresolved Alarms
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search Alert, SKU, or Line..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs focus:outline-hidden font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end font-mono">
          <Filter size={15} className="text-purple-700" />
          <span className="text-xs text-slate-500 font-semibold">Status:</span>
          {(['all', 'active', 'acknowledged', 'resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500 space-y-2">
            <CheckCircle className="mx-auto text-emerald-500" size={32} />
            <span className="font-bold text-slate-800 text-sm block">No alerts matching filter criteria</span>
            <p className="text-xs text-slate-500">All recurring quality alarms have been acknowledged or resolved.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all p-5 space-y-4"
            >
              {/* Alert Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${
                      alert.severity === 'critical'
                        ? 'bg-red-100 text-red-800 border-red-300'
                        : alert.severity === 'high'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-blue-100 text-blue-800 border-blue-300'
                    }`}
                  >
                    {alert.severity}
                  </span>

                  <h3 className="font-bold text-base text-slate-900">{alert.title}</h3>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded font-bold uppercase border ${
                      alert.status === 'active'
                        ? 'bg-red-950 text-red-300 border-red-800'
                        : alert.status === 'acknowledged'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}
                  >
                    {alert.status}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {alert.timestamp}
                  </span>
                </div>
              </div>

              {/* Alert Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Impacted SKU</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{alert.skuCode}</span>
                  <span className="text-slate-600 text-[11px] truncate block font-sans">{alert.skuName}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Machine / Line</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{alert.machineName}</span>
                  <span className="text-slate-600 text-[11px]">Shift Telemetry</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Occurrences Today</span>
                  <span className="font-bold text-amber-700 text-sm block mt-0.5">
                    {alert.occurrencesToday} times
                  </span>
                  <span className="text-slate-500 text-[11px]">Shift {alert.shift.split(' ')[0]}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] uppercase block font-semibold">Frequency Surge</span>
                  <span className="font-bold text-emerald-700 text-sm block mt-0.5">
                    +{alert.percentageChange}% vs baseline
                  </span>
                  <span className="text-slate-500 text-[11px]">AI Pattern Signal</span>
                </div>
              </div>

              {/* Recommended Investigation */}
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs space-y-1">
                <span className="font-bold text-purple-900 flex items-center gap-1.5 font-mono text-[11px]">
                  <Wrench size={14} className="text-purple-700" />
                  Recommended Investigation Guidelines:
                </span>
                <p className="text-slate-700 text-xs leading-relaxed font-sans">
                  {alert.recommendedInvestigation}
                </p>
              </div>

              {/* Buttons Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() =>
                    navigate(`/supervisor/inspections?sku=${alert.skuCode}&machine=${alert.machineId}&defect=${alert.defectType}`)
                  }
                  className="flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 font-mono hover:underline"
                >
                  <Eye size={14} /> VIEW RELATED INSPECTIONS &rarr;
                </button>

                <div className="flex items-center gap-2 font-sans">
                  {alert.status !== 'acknowledged' && (
                    <button
                      onClick={() => handleUpdateStatus(alert.id, 'acknowledged')}
                      className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold rounded text-xs transition-colors"
                    >
                      Acknowledge Alert
                    </button>
                  )}
                  {alert.status !== 'resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(alert.id, 'resolved')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs transition-colors"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

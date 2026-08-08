import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Package,
  Layers,
  ArrowUpRight,
  Filter,
  Eye,
  Zap,
  HelpCircle,
  Wrench,
  Search,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import {
  MOCK_SKUS,
  MOCK_MACHINES,
  MOCK_SHIFTS,
  MOCK_TREND_DATA,
  MOCK_DEFECT_DISTRIBUTION,
  MOCK_SKU_PERFORMANCE,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const SupervisorOverview: React.FC = () => {
  const navigate = useNavigate();
  const {
    periodFilter,
    setPeriodFilter,
    getPeriodMetrics,
    getTopLosses,
    supervisorAlerts,
  } = useInspection();

  const [selectedSKU, setSelectedSKU] = useState<string>('all');
  const [selectedMachine, setSelectedMachine] = useState<string>('all');
  const [selectedShift, setSelectedShift] = useState<string>('all');
  const [selectedDefect, setSelectedDefect] = useState<string>('all');

  const metrics = getPeriodMetrics(periodFilter);
  const topLosses = getTopLosses(periodFilter);
  const trendData = MOCK_TREND_DATA[periodFilter];
  const defectDist = MOCK_DEFECT_DISTRIBUTION[periodFilter];
  const rawSkuPerf = MOCK_SKU_PERFORMANCE[periodFilter];

  const filteredSkuPerf = rawSkuPerf.filter((s) => selectedSKU === 'all' || s.skuCode === selectedSKU);

  const handleDrilldownInspections = (alert: (typeof supervisorAlerts)[0]) => {
    navigate(
      `/supervisor/inspections?sku=${alert.skuCode}&machine=${alert.machineId}&defect=${alert.defectType}`
    );
  };

  const activeAlertsCount = supervisorAlerts.filter((a) => a.status === 'active').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Main Header Banner */}
      <div className="bg-purple-900 text-white p-6 rounded-xl border border-purple-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-800 text-purple-200 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              SUPERVISOR CONTROL SUITE
            </span>
            <span className="text-purple-300 text-xs font-mono">• Plant Quality Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
            <HelpCircle className="text-purple-300" size={24} />
            Where is quality repeatedly going wrong?
          </h1>
          <p className="text-xs text-purple-200 mt-1 max-w-2xl">
            Real-time pattern detection across press lines, recurring defect clusters, shift telemetry surges, and operator recommended investigations.
          </p>
        </div>

        {/* Period Filter Toggle */}
        <div className="flex items-center gap-2 bg-purple-950/80 p-1.5 rounded-lg border border-purple-700/60">
          <span className="text-[11px] text-purple-300 font-semibold px-2 font-mono uppercase">Period:</span>
          {(['today', 'week', 'month'] as PeriodFilter[]).map((period) => (
            <button
              key={period}
              onClick={() => setPeriodFilter(period)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${
                periodFilter === period
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-300 hover:bg-purple-800 hover:text-white'
              }`}
            >
              {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inspected Today */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-mono">Total Inspected Today</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Package size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
              {metrics.totalInspected.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-bold font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800">
              Units
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Target shift volume: 8,000 units
          </p>
        </div>

        {/* Pass Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-mono">Shift Pass Rate</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-emerald-700 font-mono tracking-tight">
              {metrics.passRate.toFixed(1)}%
            </span>
            <span className="inline-flex items-center text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              <ArrowUpRight size={14} /> +1.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            First-Pass Yield benchmark: &gt; 96.0%
          </p>
        </div>

        {/* Total Defects */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-mono">Total Defects</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <XCircle size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-700 font-mono tracking-tight">
              {metrics.failCount}
            </span>
            <span className="inline-flex items-center text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              {metrics.defectRate.toFixed(2)}% rate
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Across Flexo, Digital & Rotary Die lines
          </p>
        </div>

        {/* Active Alerts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-mono">Active Quality Alerts</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-red-600 font-mono tracking-tight">
              {activeAlertsCount}
            </span>
            <span className="text-xs text-red-700 bg-red-50 font-bold px-2 py-0.5 rounded border border-red-200 font-mono">
              Action Required
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Recurring pattern surges flagged by AI
          </p>
        </div>
      </div>

      {/* Multi-Axis Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Filter size={15} className="text-purple-700" />
          <span>Supervisor Telemetry Multi-Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-medium">
          {/* SKU Filter */}
          <div className="space-y-1">
            <label className="text-slate-500 font-semibold font-mono text-[10px] uppercase block">Filter SKU</label>
            <select
              value={selectedSKU}
              onChange={(e) => setSelectedSKU(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-hidden font-semibold"
            >
              <option value="all">All SKUs</option>
              {MOCK_SKUS.map((sku) => (
                <option key={sku.id} value={sku.code}>
                  {sku.code} - {sku.name}
                </option>
              ))}
            </select>
          </div>

          {/* Machine Filter */}
          <div className="space-y-1">
            <label className="text-slate-500 font-semibold font-mono text-[10px] uppercase block">Filter Machine</label>
            <select
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-hidden font-semibold"
            >
              <option value="all">All Press Lines</option>
              {MOCK_MACHINES.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.code})
                </option>
              ))}
            </select>
          </div>

          {/* Shift Filter */}
          <div className="space-y-1">
            <label className="text-slate-500 font-semibold font-mono text-[10px] uppercase block">Filter Shift</label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-hidden font-semibold"
            >
              <option value="all">All Shifts</option>
              {MOCK_SHIFTS.map((sh) => (
                <option key={sh} value={sh}>
                  {sh}
                </option>
              ))}
            </select>
          </div>

          {/* Defect Filter */}
          <div className="space-y-1">
            <label className="text-slate-500 font-semibold font-mono text-[10px] uppercase block">Filter Defect Type</label>
            <select
              value={selectedDefect}
              onChange={(e) => setSelectedDefect(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-hidden font-semibold"
            >
              <option value="all">All Defect Types</option>
              <option value="Misalignment">Misalignment</option>
              <option value="Smudge">Smudge</option>
              <option value="Missing Print">Missing Print</option>
            </select>
          </div>
        </div>
      </div>

      {/* ACTIVE QUALITY INTELLIGENCE SPOTLIGHT SECTION */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 text-white rounded-xl p-6 border border-purple-800/80 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-purple-800/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-amber-500/20 text-amber-400 p-2 rounded-lg border border-amber-500/30">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Active Quality Intelligence</h2>
              <p className="text-xs text-purple-200">Abnormal recurring patterns & process investigation targets</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/supervisor/intelligence')}
            className="text-xs font-mono font-bold bg-purple-800 hover:bg-purple-700 text-purple-200 hover:text-white px-3 py-1.5 rounded-lg border border-purple-700 transition-colors"
          >
            Full Intelligence View &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supervisorAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-slate-900/90 rounded-xl p-5 border border-purple-700/60 hover:border-purple-500 transition-all space-y-3.5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40">
                      Severity: {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      +{alert.percentageChange}% Change
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white mt-1.5">{alert.title}</h3>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2.5 py-1 rounded border border-amber-800 shrink-0">
                  {alert.occurrencesToday} occurrences today
                </span>
              </div>

              {/* Context Tags */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-semibold">SKU</span>
                  <span className="font-bold text-slate-200 truncate block">{alert.skuCode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-semibold">Machine</span>
                  <span className="font-bold text-slate-200 truncate block">{alert.machineName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-semibold">Shift</span>
                  <span className="font-bold text-slate-200 truncate block">{alert.shift.split(' ')[0]}</span>
                </div>
              </div>

              {/* Recommended Investigation */}
              <div className="p-3 bg-purple-950/60 border border-purple-800/80 rounded-lg space-y-1">
                <span className="text-[11px] font-bold text-purple-200 flex items-center gap-1.5 font-mono">
                  <Wrench size={13} className="text-purple-400" />
                  Recommended Investigation:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {alert.recommendedInvestigation}
                </p>
              </div>

              {/* Possible Process Areas */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                <span className="text-slate-400 font-semibold uppercase">Possible Process Areas:</span>
                {alert.possibleProcessAreas.map((area, i) => (
                  <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    {area}
                  </span>
                ))}
              </div>

              {/* Action Button: VIEW INSPECTIONS */}
              <div className="pt-2 border-t border-purple-800/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">Timestamp: {alert.timestamp}</span>
                <button
                  onClick={() => handleDrilldownInspections(alert)}
                  className="flex items-center gap-1.5 text-xs font-bold font-mono bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-md transition-colors shadow-xs"
                >
                  <Eye size={14} /> VIEW INSPECTIONS &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOP MOST AFFECTED CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Most Affected SKU */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
            Most Affected SKU Today
          </span>
          <div className="text-base font-bold text-emerald-700 font-mono truncate">
            {topLosses.mostAffectedSKU.skuCode}
          </div>
          <p className="text-xs text-slate-600 truncate">{topLosses.mostAffectedSKU.name}</p>
          <div className="text-[11px] text-slate-500 font-mono pt-1">
            Defect rate: <strong className="text-amber-700">{topLosses.mostAffectedSKU.defectRate}%</strong> ({topLosses.mostAffectedSKU.totalInspected.toLocaleString()} inspected)
          </div>
        </div>

        {/* Most Affected Machine */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
            Most Affected Machine Line
          </span>
          <div className="text-base font-bold text-purple-800 font-mono">
            {topLosses.mostAffectedMachine.name}
          </div>
          <p className="text-xs text-slate-600">Primary defect share across active lines</p>
          <div className="text-[11px] text-slate-500 font-mono pt-1">
            Share: <strong className="text-amber-700">{topLosses.mostAffectedMachine.percentage}%</strong> ({topLosses.mostAffectedMachine.defectCount} defect units)
          </div>
        </div>

        {/* Most Affected Shift */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">
            Most Affected Shift
          </span>
          <div className="text-base font-bold text-blue-700 font-mono truncate">
            {topLosses.mostAffectedShift.name}
          </div>
          <p className="text-xs text-slate-600">Highest defect recurrence rate</p>
          <div className="text-[11px] text-slate-500 font-mono pt-1">
            Defects: <strong className="text-amber-700">{topLosses.mostAffectedShift.totalDefects} units</strong> ({topLosses.mostAffectedShift.defectRate}% defect rate)
          </div>
        </div>
      </div>

      {/* Charts Grid: Defect Trend & Defect Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Defect Trend Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp size={16} className="text-purple-700" />
                Shift Defect Hourly Telemetry Trend
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">Pass vs defective unit distribution over operational hours</p>
            </div>
            <span className="text-xs font-mono bg-purple-50 text-purple-800 font-bold px-2.5 py-1 rounded">
              Shift A Telemetry
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Bar dataKey="defects" fill="#ef4444" name="Defects Flagged" radius={[4, 4, 0, 0]} />
                <Bar dataKey="inspected" fill="#3b82f6" name="Total Inspected" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Defect Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers size={16} className="text-amber-600" />
              Top Defect Distribution
            </h2>
            <p className="text-[11px] text-slate-500 font-mono">Categorized AI defect findings</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={defectDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {defectDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any, name: any) => [`${val ?? 0} units`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-1 border-t border-slate-100 font-mono text-xs">
            {defectDist.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-700 font-medium">{item.name}</span>
                </div>
                <span className="text-slate-900 font-bold">{item.value} units</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quality by SKU Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Quality Performance by SKU</h2>
            <p className="text-[11px] text-slate-500">Inspection pass rate, defect counts, and volume share across active SKUs</p>
          </div>
          <button
            onClick={() => navigate('/supervisor/inspections')}
            className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 font-mono"
          >
            <Search size={14} /> Inspection Records &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-mono text-[10px] uppercase border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">SKU Code</th>
                <th className="py-2.5 px-3">SKU Name</th>
                <th className="py-2.5 px-3 text-right">Inspected Volume</th>
                <th className="py-2.5 px-3 text-right">Defect Units</th>
                <th className="py-2.5 px-3 text-right">Pass Rate</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSkuPerf.map((sku) => (
                <tr key={sku.skuCode} className="hover:bg-slate-50 transition-colors font-mono">
                  <td className="py-3 px-3 font-bold text-slate-900">{sku.skuCode}</td>
                  <td className="py-3 px-3 text-slate-700 max-w-[200px] truncate font-sans">{sku.name}</td>
                  <td className="py-3 px-3 text-right text-slate-800">{sku.inspected > 0 ? sku.inspected.toLocaleString() : '0'}</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-700">{sku.defectCount}</td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        sku.passRate >= 98
                          ? 'bg-emerald-100 text-emerald-800'
                          : sku.passRate >= 96
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {sku.inspected > 0 ? `${sku.passRate.toFixed(1)}%` : '100%'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-sans">
                    <button
                      onClick={() => navigate(`/supervisor/inspections?sku=${sku.skuCode}`)}
                      className="text-xs text-purple-700 hover:underline font-bold"
                    >
                      View Logs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Package,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import {
  MOCK_TREND_DATA,
  MOCK_DEFECT_DISTRIBUTION,
  MOCK_SKU_PERFORMANCE,
} from '../../data/mockData';
import type { PeriodFilter } from '../../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const OwnerOverview: React.FC = () => {
  const navigate = useNavigate();
  const {
    periodFilter,
    setPeriodFilter,
    getPeriodMetrics,
    getTopLosses,
    qualityIssues,
  } = useInspection();

  const metrics = getPeriodMetrics(periodFilter);
  const topLosses = getTopLosses(periodFilter);
  const trendData = MOCK_TREND_DATA[periodFilter];
  const defectDist = MOCK_DEFECT_DISTRIBUTION[periodFilter];
  const skuPerf = MOCK_SKU_PERFORMANCE[periodFilter];

  const passRateDiff = parseFloat((metrics.passRate - metrics.prevPassRate).toFixed(2));
  const defectRateDiff = parseFloat((metrics.defectRate - metrics.prevDefectRate).toFixed(2));
  const totalInspectedDiff = metrics.totalInspected - metrics.prevTotalInspected;

  const activeIssuesList = qualityIssues.filter((i) => i.status !== 'resolved');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500 text-slate-950 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              EXECUTIVE QA SUITE
            </span>
            <span className="text-slate-400 text-xs font-mono">• Plant Director View</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
            <ShieldCheck className="text-emerald-400" size={24} />
            How is factory quality performing overall?
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Executive oversight of plant yield, first-pass pass rate, top loss root causes, recurring defect warnings, and substrate waste prevention.
          </p>
        </div>

        {/* Period Filter Switcher */}
        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold px-2 font-mono uppercase">Period:</span>
          {(['today', 'week', 'month'] as PeriodFilter[]).map((period) => (
            <button
              key={period}
              onClick={() => setPeriodFilter(period)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${
                periodFilter === period
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pass Rate KPI */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Overall Pass Rate</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
              {metrics.passRate.toFixed(1)}%
            </span>
            <span
              className={`inline-flex items-center text-xs font-bold font-mono px-2 py-0.5 rounded ${
                passRateDiff >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {passRateDiff >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {passRateDiff >= 0 ? `+${passRateDiff}%` : `${passRateDiff}%`}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            vs prev {periodFilter === 'today' ? 'day' : periodFilter === 'week' ? 'week' : 'month'} ({metrics.prevPassRate}%)
          </p>
        </div>

        {/* Total Inspected KPI */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total Inspected</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Package size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
              {metrics.totalInspected.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              <ArrowUpRight size={14} />
              +{totalInspectedDiff > 0 ? totalInspectedDiff.toLocaleString() : 0}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {metrics.passCount.toLocaleString()} passed • {metrics.failCount.toLocaleString()} failed
          </p>
        </div>

        {/* Defect Rate KPI */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Plant Defect Rate</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <XCircle size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-amber-700 font-mono tracking-tight">
              {metrics.defectRate.toFixed(2)}%
            </span>
            <span
              className={`inline-flex items-center text-xs font-bold font-mono px-2 py-0.5 rounded ${
                defectRateDiff <= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {defectRateDiff <= 0 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
              {defectRateDiff > 0 ? `+${defectRateDiff}%` : `${defectRateDiff}%`}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Target threshold: &lt; 3.0%
          </p>
        </div>

        {/* Active Quality Issues KPI */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Active Quality Issues</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-black text-red-600 font-mono tracking-tight">
              {activeIssuesList.length}
            </span>
            <span className="text-xs text-red-700 bg-red-50 font-medium px-2 py-0.5 rounded border border-red-200">
              Action Needed
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Significant recurring patterns requiring review
          </p>
        </div>
      </div>

      {/* TOP QUALITY LOSSES SECTION */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500/20 text-amber-400 p-1.5 rounded-lg border border-amber-500/30">
              <Zap size={18} />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Top Quality Losses Spotlight</h2>
              <p className="text-xs text-slate-400">Primary loss drivers for {periodFilter === 'today' ? 'Today' : periodFilter === 'week' ? 'This Week' : 'This Month'}</p>
            </div>
          </div>
          <span className="text-[11px] bg-slate-800 text-slate-300 font-mono px-3 py-1 rounded-md border border-slate-700">
            Est. Scrap Cost Saved: ₹{metrics.estimatedScrapSavings.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Most Common Defect */}
          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">
              Most Common Defect
            </span>
            <div className="text-base font-bold text-amber-400 mt-1">
              {topLosses.mostCommonDefect.name}
            </div>
            <div className="text-xs text-slate-300 mt-1 font-mono">
              {topLosses.mostCommonDefect.count} occurrences ({topLosses.mostCommonDefect.percentage}% of all defects)
            </div>
          </div>

          {/* Most Affected SKU */}
          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">
              Most Affected SKU
            </span>
            <div className="text-base font-bold text-emerald-400 mt-1 truncate">
              {topLosses.mostAffectedSKU.skuCode}
            </div>
            <div className="text-xs text-slate-300 mt-1 truncate">
              {topLosses.mostAffectedSKU.name} ({topLosses.mostAffectedSKU.defectRate}% defect rate)
            </div>
          </div>

          {/* Most Affected Machine */}
          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">
              Most Affected Machine
            </span>
            <div className="text-base font-bold text-blue-400 mt-1">
              {topLosses.mostAffectedMachine.name}
            </div>
            <div className="text-xs text-slate-300 mt-1 font-mono">
              {topLosses.mostAffectedMachine.defectCount} defects ({topLosses.mostAffectedMachine.percentage}% plant share)
            </div>
          </div>

          {/* Most Affected Shift */}
          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700/70">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-mono">
              Most Affected Shift
            </span>
            <div className="text-base font-bold text-purple-400 mt-1 truncate">
              {topLosses.mostAffectedShift.name.split(' ')[0]} {topLosses.mostAffectedShift.name.split(' ')[1]}
            </div>
            <div className="text-xs text-slate-300 mt-1 font-mono">
              {topLosses.mostAffectedShift.totalDefects} defects ({topLosses.mostAffectedShift.defectRate}% defect rate)
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid: Quality Trend & Defect Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quality Trend Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-600" />
                Overall Quality & Pass Rate Trend
              </h2>
              <p className="text-[11px] text-slate-500">First-Pass Yield (%) trajectory across current period</p>
            </div>
            <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded text-slate-700 font-semibold">
              Pass Rate Avg: {metrics.passRate.toFixed(1)}%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="passRateGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                <YAxis domain={[90, 100]} stroke="#64748b" fontSize={11} unit="%" />
                <Tooltip
                  formatter={(val: any) => [`${val ?? 0}%`, 'Pass Rate']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="passRate" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#passRateGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Defect Distribution Pie Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers size={16} className="text-amber-600" />
              Defect Distribution
            </h2>
            <p className="text-[11px] text-slate-500">Breakdown of defect types flagged by AI</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
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
                <Tooltip
                  formatter={(val: any, name: any) => [`${val ?? 0} units`, name]}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-1 border-t border-slate-100">
            {defectDist.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-700">{item.name}</span>
                </div>
                <span className="text-slate-900 font-mono font-bold">{item.value} units</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SKU Quality Performance Table & Active Issues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SKU Quality Performance */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm">SKU Quality Performance Matrix</h2>
              <p className="text-[11px] text-slate-500">Inspection pass rate & volume breakdown by packaging SKU</p>
            </div>
            <button
              onClick={() => navigate('/owner/reports')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
            >
              Full SKU Report <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-mono text-[10px] uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">SKU Code</th>
                  <th className="py-2.5 px-3">SKU Name</th>
                  <th className="py-2.5 px-3 text-right">Inspected</th>
                  <th className="py-2.5 px-3 text-right">Defects</th>
                  <th className="py-2.5 px-3 text-right">Pass Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {skuPerf.map((sku) => (
                  <tr key={sku.skuCode} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{sku.skuCode}</td>
                    <td className="py-3 px-3 text-slate-700 max-w-[200px] truncate">{sku.name}</td>
                    <td className="py-3 px-3 text-right font-mono text-slate-800">
                      {sku.inspected > 0 ? sku.inspected.toLocaleString() : '0'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-amber-700 font-bold">
                      {sku.defectCount}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          sku.passRate >= 98
                            ? 'bg-emerald-100 text-emerald-800'
                            : sku.passRate >= 96
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {sku.inspected > 0 ? `${sku.passRate.toFixed(1)}%` : 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ACTIVE QUALITY ISSUES SPOTLIGHT CARD */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={18} />
              <h2 className="font-bold text-slate-900 text-sm">Active Quality Issues</h2>
            </div>
            <span className="text-[10px] font-mono font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
              {activeIssuesList.length} Flagged
            </span>
          </div>

          <div className="space-y-3">
            {activeIssuesList.map((issue) => (
              <div
                key={issue.id}
                onClick={() => navigate('/owner/issues')}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/90 rounded-lg border border-slate-200 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {issue.title}
                  </span>
                  <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 shrink-0">
                    {issue.severity}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 font-mono">
                  {issue.skuCode} / {issue.machineName} — <strong className="text-slate-900">{issue.occurrences} occurrences</strong> {issue.timeframe.toLowerCase()}
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] text-slate-500 font-mono">
                  <span>Est. Loss: ₹{issue.estimatedFinancialLoss.toLocaleString()}</span>
                  <span className="text-emerald-700 font-bold group-hover:underline">View Details &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

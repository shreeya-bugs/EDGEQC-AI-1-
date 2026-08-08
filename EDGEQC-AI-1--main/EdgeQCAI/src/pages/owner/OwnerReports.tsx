import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Filter,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import {
  MOCK_SKUS,
  MOCK_MACHINES,
  MOCK_SHIFTS,
  MOCK_DEFECT_DISTRIBUTION,
  MOCK_SKU_PERFORMANCE,
  MOCK_MACHINE_PERFORMANCE,
  MOCK_SHIFT_PERFORMANCE,
} from '../../data/mockData';
import type { PeriodFilter } from '../../types';

export const OwnerReports: React.FC = () => {
  const { getPeriodMetrics, qualityIssues } = useInspection();

  const [period, setPeriod] = useState<PeriodFilter>('week');
  const [selectedSKU, setSelectedSKU] = useState<string>('all');
  const [selectedMachine, setSelectedMachine] = useState<string>('all');
  const [selectedShift, setSelectedShift] = useState<string>('all');

  const baseMetrics = getPeriodMetrics(period);
  const rawDefectDist = MOCK_DEFECT_DISTRIBUTION[period];
  const rawSkuPerf = MOCK_SKU_PERFORMANCE[period];
  const rawMachinePerf = MOCK_MACHINE_PERFORMANCE[period];
  const rawShiftPerf = MOCK_SHIFT_PERFORMANCE[period];

  // Filter calculations dynamically based on selections
  const filteredSkuPerf = rawSkuPerf.filter((s) => selectedSKU === 'all' || s.skuCode === selectedSKU);
  const filteredMachinePerf = rawMachinePerf.filter((m) => selectedMachine === 'all' || m.machineName === selectedMachine);
  const filteredShiftPerf = rawShiftPerf.filter((sh) => selectedShift === 'all' || sh.shift === selectedShift);

  const totalInspections = filteredSkuPerf.reduce((acc, curr) => acc + curr.inspected, 0) || baseMetrics.totalInspected;
  const totalFail = filteredSkuPerf.reduce((acc, curr) => acc + curr.defectCount, 0) || baseMetrics.failCount;
  const totalPass = totalInspections - totalFail;
  const passRate = totalInspections > 0 ? parseFloat(((totalPass / totalInspections) * 100).toFixed(1)) : 100;
  const defectRate = parseFloat((100 - passRate).toFixed(1));

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = ['Report Period', 'SKU Code', 'Machine', 'Shift', 'Inspected Volume', 'Pass Count', 'Defect Count', 'Pass Rate (%)'];
    const rows = filteredSkuPerf.map((sku) => [
      period.toUpperCase(),
      sku.skuCode,
      selectedMachine === 'all' ? 'All Press Lines' : selectedMachine,
      selectedShift === 'all' ? 'All Shifts' : selectedShift,
      sku.inspected,
      sku.inspected - sku.defectCount,
      sku.defectCount,
      sku.passRate,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EdgeQC_Quality_Report_${period}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Export / Print Handler
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 print:p-0 print:m-0 print:max-w-none">
      {/* Header Banner (Hidden on Print) */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-500 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              EXECUTIVE REPORTS
            </span>
            <span className="text-slate-400 text-xs font-mono">• Plant Audit & ISO Compliance</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
            <FileSpreadsheet className="text-emerald-400" size={24} />
            Plant Quality Reports Engine
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Generate, filter, and export comprehensive quality inspection summaries across Date Range, SKU, Machine line, and Shift.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
          >
            <Download size={15} />
            Export CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold text-xs border border-slate-700 transition-colors"
          >
            <Printer size={15} />
            Export PDF / Print
          </button>
        </div>
      </div>

      {/* Print-Only Header */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">EdgeQC Plant Executive Quality Report</h1>
        <p className="text-xs text-slate-600 font-mono mt-1">
          Generated on {new Date().toLocaleDateString()} | Filter: Period={period.toUpperCase()}, SKU={selectedSKU}, Machine={selectedMachine}, Shift={selectedShift}
        </p>
      </div>

      {/* Multi-Axis Filters Toolbar (Hidden on Print) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
          <Filter size={15} className="text-emerald-600" />
          <span>Report Multi-Axis Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
          {/* Date Range / Period */}
          <div className="space-y-1">
            <label className="text-slate-500 font-semibold font-mono text-[10px] uppercase block">Date Range / Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as PeriodFilter)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-hidden font-semibold"
            >
              <option value="today">Today (Shift A)</option>
              <option value="week">This Week (Last 7 Days)</option>
              <option value="month">This Month (Last 30 Days)</option>
            </select>
          </div>

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
        </div>
      </div>

      {/* REPORT EXECUTIVE SUMMARY MATRIX */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">Executive Report Summary Matrix</h2>
          <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            Pass Rate: {passRate.toFixed(1)}%
          </span>
        </div>

        {/* KPI Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-center">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Inspections</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{totalInspections.toLocaleString()}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Pass / Fail Units</span>
            <span className="text-lg font-bold text-slate-800 mt-1 block">
              <span className="text-emerald-700">{totalPass.toLocaleString()}</span> / <span className="text-red-600">{totalFail.toLocaleString()}</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Pass Rate</span>
            <span className="text-2xl font-black text-emerald-700 mt-1 block">{passRate.toFixed(1)}%</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Defect Rate</span>
            <span className="text-2xl font-black text-amber-700 mt-1 block">{defectRate.toFixed(1)}%</span>
          </div>
        </div>

        {/* Defect Distribution Summary */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-xs font-mono uppercase tracking-wider">1. Defect Distribution Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {rawDefectDist.map((d) => (
              <div key={d.name} className="p-3 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{d.name}</span>
                <span className="font-mono font-bold text-slate-900">{d.value} occurrences</span>
              </div>
            ))}
          </div>
        </div>

        {/* SKU-wise Quality Breakdown */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-xs font-mono uppercase tracking-wider">2. SKU-Wise Quality Performance</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-mono text-[10px] uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">SKU Code</th>
                  <th className="py-2.5 px-3">SKU Name</th>
                  <th className="py-2.5 px-3 text-right">Inspected</th>
                  <th className="py-2.5 px-3 text-right">Defects</th>
                  <th className="py-2.5 px-3 text-right">Pass Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSkuPerf.map((sku) => (
                  <tr key={sku.skuCode}>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{sku.skuCode}</td>
                    <td className="py-2.5 px-3 text-slate-700">{sku.name}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-800">{sku.inspected.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-amber-700 font-bold">{sku.defectCount}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">{sku.passRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Machine-wise Quality Breakdown */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-xs font-mono uppercase tracking-wider">3. Machine-Wise Quality Breakdown</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-mono text-[10px] uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Machine Name</th>
                  <th className="py-2.5 px-3">Line Code</th>
                  <th className="py-2.5 px-3 text-right">Inspected Volume</th>
                  <th className="py-2.5 px-3 text-right">Defects</th>
                  <th className="py-2.5 px-3 text-right">Pass Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMachinePerf.map((m) => (
                  <tr key={m.code}>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{m.machineName}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{m.code}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-800">{m.inspected.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-amber-700 font-bold">{m.defectCount}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">{m.passRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shift-wise Quality Breakdown */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-xs font-mono uppercase tracking-wider">4. Shift-Wise Quality Breakdown</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-mono text-[10px] uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Shift</th>
                  <th className="py-2.5 px-3 text-right">Inspected Volume</th>
                  <th className="py-2.5 px-3 text-right">Defects</th>
                  <th className="py-2.5 px-3 text-right">Pass Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShiftPerf.map((sh) => (
                  <tr key={sh.shift}>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{sh.shift}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-800">{sh.inspected.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-amber-700 font-bold">{sh.defectCount}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">{sh.passRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recurring Issues Summary */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-xs font-mono uppercase tracking-wider">5. Recurring Issues Audit Log</h3>
          <div className="space-y-2">
            {qualityIssues.map((iss) => (
              <div key={iss.id} className="p-3 bg-slate-50 rounded-md border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{iss.title}</span>
                  <span className="text-slate-500 font-mono text-[11px] block">
                    {iss.skuCode} / {iss.machineName} — {iss.occurrences} occurrences
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                  {iss.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sliders,
  Camera,
  Cpu,
  Play,
  Layers,
  Factory,
  Check,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { MOCK_SKUS, MOCK_MACHINES, MOCK_SHIFTS } from '../../data/mockData';

export const InspectionSetup: React.FC = () => {
  const navigate = useNavigate();
  const { activeJob, setActiveJob } = useInspection();

  const [selectedSkuId, setSelectedSkuId] = useState<string>(activeJob.sku.id);
  const [selectedMachineId, setSelectedMachineId] = useState<string>(activeJob.machine.id);
  const [selectedShift, setSelectedShift] = useState<string>(activeJob.shift);
  const [jobId, setJobId] = useState<string>(activeJob.jobId);
  const [targetQuantity, setTargetQuantity] = useState<number>(activeJob.targetQuantity);

  const handleStartInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const sku = MOCK_SKUS.find((s) => s.id === selectedSkuId) || MOCK_SKUS[0];
    const machine = MOCK_MACHINES.find((m) => m.id === selectedMachineId) || MOCK_MACHINES[0];

    setActiveJob({
      id: `job-${Date.now().toString().slice(-4)}`,
      jobId,
      sku,
      machine,
      shift: selectedShift,
      targetQuantity: Number(targetQuantity),
      inspectedQuantity: 0,
      passCount: 0,
      failCount: 0,
      startTime: new Date().toISOString().substring(0, 19),
      status: 'active',
    });

    navigate('/operator/live');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders size={20} className="text-emerald-600" />
            <span>Inspection Job Setup</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure line parameters, SKU job details, and verify hardware diagnostics before starting live inspection.
          </p>
        </div>
      </div>

      <form onSubmit={handleStartInspection} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers size={16} className="text-slate-600" />
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-800">1. Job & Substrate Details</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job / Batch ID
              </label>
              <input
                type="text"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono font-bold"
                placeholder="JOB-2026-XXXX"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Printed Label / Packaging SKU
              </label>
              <select
                value={selectedSkuId}
                onChange={(e) => setSelectedSkuId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
              >
                {MOCK_SKUS.map((sku) => (
                  <option key={sku.id} value={sku.id}>
                    {sku.code} — {sku.name} ({sku.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Batch Production Quantity
              </label>
              <input
                type="number"
                value={targetQuantity}
                onChange={(e) => setTargetQuantity(Number(e.target.value))}
                min="100"
                step="500"
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Factory size={16} className="text-slate-600" />
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-800">2. Press Line & Shift Selection</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Production Machine / Line
              </label>
              <select
                value={selectedMachineId}
                onChange={(e) => setSelectedMachineId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
              >
                {MOCK_MACHINES.map((machine) => (
                  <option key={machine.id} value={machine.id}>
                    {machine.name} ({machine.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Operating Shift
              </label>
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
              >
                {MOCK_SHIFTS.map((shift) => (
                  <option key={shift} value={shift}>
                    {shift}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-lg border border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
              3. Automated Diagnostic Checks
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">ALL SYSTEMS READY</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/90 p-3.5 rounded-md border border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Camera className="text-emerald-400 shrink-0" size={20} />
                <div>
                  <div className="font-bold text-xs text-slate-100">Optical Camera Stream</div>
                  <div className="text-[10px] text-slate-400 font-mono">Industrial 1080p @ 60 FPS • USB3 Vision</div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-700/60">
                <Check size={12} />
                CONNECTED
              </div>
            </div>

            <div className="bg-slate-800/90 p-3.5 rounded-md border border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cpu className="text-emerald-400 shrink-0" size={20} />
                <div>
                  <div className="font-bold text-xs text-slate-100">AI Inspection Inference</div>
                  <div className="text-[10px] text-slate-400 font-mono">Model v2.4 (Packaging Label Vision)</div>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded border border-emerald-700/60">
                <Check size={12} />
                AI READY
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/operator')}
            className="px-4 py-2 border border-slate-300 rounded text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold shadow-sm transition-colors"
          >
            <Play size={16} className="fill-white" />
            <span>Confirm & Start Live Inspection</span>
          </button>
        </div>
      </form>
    </div>
  );
};

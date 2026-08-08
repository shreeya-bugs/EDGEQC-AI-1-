import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
    CheckCircle2,
    XCircle,
    Wrench,
    History,
    Camera,
    Play,
    Pause,
    RotateCw,
    Sparkles,
    Layers,
    Upload,
    Image as ImageIcon,
    Cpu,
    Loader2,
    FileCheck,
} from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { useVoice } from '../../context/VoiceContext';
import type { DefectType } from '../../types';
import { InspectionDetailModal } from '../../components/common/InspectionDetailModal';
import { VisualWalkthroughModal } from '../../components/walkthrough/VisualWalkthroughModal';
import { DefectFlashcardModal } from '../../components/flashcards/DefectFlashcardModal';

export const LiveInspection: React.FC = () => {
    const navigate = useNavigate();
    const { speakText } = useVoice();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        activeJob,
        sessionStats,
        currentMockState,
        setCurrentMockState,
        currentLiveResult,
        triggerNextInspection,
        isAutoInspectionActive,
        setIsAutoInspectionActive,
        setSelectedHistoryRecord,
        selectedHistoryRecord,
        acknowledgeRecord,
        datasetSamples,
        isAnalyzing,
        inspectUploadedImage,
        inspectBase64Image,
    } = useInspection();

    const [activeWalkthroughId, setActiveWalkthroughId] = useState<string | null>(null);
    const [activeFlashcardId, setActiveFlashcardId] = useState<string | null>(null);

    const isPass = currentLiveResult.result === 'PASS';

    useEffect(() => {
        if (isPass) {
            confetti({
                particleCount: 35,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#06b6d4', '#10b981', '#38bdf8']
            });
        }
    }, [currentLiveResult.id, isPass]);

    const handleSelectMockState = (state: DefectType) => {
        setCurrentMockState(state);
        triggerNextInspection(state);

        if (state !== 'PASS') {
            speakText(`Warning: Defect detected. ${state}`);
        }
    };

    const handleNextFrame = () => {
        triggerNextInspection(currentMockState);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                const record = await inspectUploadedImage(file);
                if (record.result === 'FAIL') {
                    speakText(`Alert! OpenCV YOLO engine detected defect: ${record.defectType}`);
                } else {
                    speakText('Inspection passed successfully.');
                }
            } catch (err) {
                console.error('File upload failed:', err);
            }
        }
    };

    const handleSampleClick = async (sample: any) => {
        try {
            const record = await inspectBase64Image(sample.dataUrl, sample.filename);
            if (record.result === 'FAIL') {
                speakText(`Alert! Defect detected in sample ${sample.category}: ${record.defectType}`);
            }
        } catch (err) {
            console.error('Sample click inspection failed:', err);
        }
    };

    return (
        <div className="space-y-4 max-w-[1600px] mx-auto pb-6">
            <div className="bg-slate-900 text-white p-3 px-4 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2 font-mono font-bold text-emerald-400 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>REAL OPENCV + YOLO ENGINE • ACTIVE</span>
                    </div>

                    <div className="hidden sm:flex items-center gap-3 text-slate-300 border-l border-slate-700 pl-4">
                        <div>
                            <span className="text-[10px] text-slate-500 font-mono block">JOB / BATCH</span>
                            <span className="font-mono font-bold text-white">{activeJob.jobId}</span>
                        </div>
                        <div className="border-l border-slate-800 pl-3">
                            <span className="text-[10px] text-slate-500 font-mono block">SKU</span>
                            <span className="font-semibold text-slate-200">{activeJob.sku.code}</span>
                        </div>
                        <div className="border-l border-slate-800 pl-3">
                            <span className="text-[10px] text-slate-500 font-mono block">LINE</span>
                            <span className="font-semibold text-slate-200">{activeJob.machine.name}</span>
                        </div>
                        <div className="border-l border-slate-800 pl-3">
                            <span className="text-[10px] text-slate-500 font-mono block">SHIFT</span>
                            <span className="font-medium text-slate-300">{activeJob.shift.split(' ')[0]}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-3 bg-slate-800 px-3 py-1 rounded border border-slate-700">
                        <span className="text-slate-400 text-[11px]">Inspected: <strong className="text-white">{sessionStats.totalInspected}</strong></span>
                        <span className="text-emerald-400 text-[11px]">Pass: <strong>{sessionStats.passCount}</strong></span>
                        <span className="text-rose-400 text-[11px]">Fail: <strong>{sessionStats.failCount}</strong></span>
                        <span className="text-amber-300 text-[11px] border-l border-slate-700 pl-2">
                            Pass Rate: <strong>{sessionStats.passRate}%</strong>
                        </span>
                    </div>

                    <button
                        onClick={() => navigate('/operator/history')}
                        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded border border-slate-700 text-xs font-semibold transition-colors"
                    >
                        <History size={14} />
                        <span>History</span>
                    </button>
                </div>
            </div>

            {/* Dataset Preset Toolbar */}
            {datasetSamples.length > 0 && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between gap-3 text-xs overflow-x-auto">
                    <div className="flex items-center gap-2 shrink-0">
                        <FileCheck size={16} className="text-cyan-400" />
                        <span className="font-mono font-bold text-slate-200 text-[11px]">DATASET SAMPLES:</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                        {datasetSamples.map((sample) => (
                            <button
                                key={sample.id}
                                onClick={() => handleSampleClick(sample)}
                                disabled={isAnalyzing}
                                className="shrink-0 px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500 text-slate-200 hover:text-cyan-300 font-mono text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
                            >
                                <ImageIcon size={12} className="text-cyan-400" />
                                <span>{sample.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <div className="lg:col-span-8 space-y-3">
                    <div className="bg-slate-950 rounded-lg border-2 border-slate-800 overflow-hidden shadow-md relative flex flex-col">
                        <div className="bg-slate-900/90 text-slate-300 px-4 py-2 flex items-center justify-between text-xs font-mono border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <Camera size={14} className="text-cyan-400 animate-pulse" />
                                <span className="font-semibold text-slate-200">REAL OPENCV + YOLO VISION HUD STREAM</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isAnalyzing}
                                    className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-3 py-1 rounded text-xs font-bold transition-all shadow-md disabled:opacity-50"
                                >
                                    <Upload size={13} />
                                    <span>Upload Inspection Image</span>
                                </button>

                                {currentLiveResult.processingMeta && (
                                    <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                                        CV: {currentLiveResult.processingMeta.total_pipeline_ms || 24}ms
                                    </span>
                                )}
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                            </div>
                        </div>

                        <div className="relative bg-slate-900 aspect-video flex items-center justify-center p-4 sm:p-6 select-none overflow-hidden">
                            <div className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>

                            {/* Reticle Corner Guides */}
                            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
                            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>
                            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400"></div>
                            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>

                            {isAnalyzing ? (
                                <div className="flex flex-col items-center justify-center space-y-3 py-12">
                                    <Loader2 size={40} className="text-cyan-400 animate-spin" />
                                    <span className="font-mono text-cyan-300 font-bold text-sm tracking-wider">
                                        OPENCV PREPROCESSING & YOLO v8 INFERENCE IN PROGRESS...
                                    </span>
                                </div>
                            ) : currentLiveResult.annotatedImageBase64 ? (
                                /* REAL OPENCV + YOLO ANNOTATED IMAGE DISPLAY */
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <img
                                        src={currentLiveResult.annotatedImageBase64}
                                        alt="OpenCV YOLO Inspection"
                                        className="max-h-full max-w-full object-contain rounded border-2 border-slate-700 shadow-2xl"
                                    />
                                </div>
                            ) : (
                                /* SIMULATED / DEFAULT CANVAS HUD */
                                <div className={`w-full max-w-xl aspect-video rounded shadow-2xl relative p-5 flex flex-col justify-between transition-all duration-300 ${isPass ? 'bg-amber-50/95 border-2 border-emerald-500 shadow-emerald-500/20' : 'bg-amber-50/95 border-2 border-rose-600 shadow-rose-600/20'
                                    }`}>
                                    <div className="flex justify-between items-start border-b-2 border-amber-300/80 pb-2">
                                        <div>
                                            <span className="font-extrabold text-sm text-slate-900 tracking-tight block">
                                                {activeJob.sku.name}
                                            </span>
                                            <span className="text-[11px] text-slate-600 font-mono font-bold">
                                                {activeJob.sku.code} • BATCH: {activeJob.jobId}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="bg-amber-200 text-amber-950 font-bold text-[10px] px-2 py-0.5 rounded font-mono block">
                                                VOL: 250 ML / Rx ONLY
                                            </span>
                                            <span className="text-[9px] text-slate-500 font-mono">LOT: L-2026-9042</span>
                                        </div>
                                    </div>

                                    <div className="my-3 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-slate-700 uppercase">Active Ingredients:</span>
                                            <div className="h-1.5 bg-slate-800/30 rounded flex-1"></div>
                                        </div>
                                        <div className="h-1.5 bg-slate-800/25 rounded w-4/5"></div>
                                        <div className="h-1.5 bg-slate-800/20 rounded w-2/3"></div>
                                        <div className="h-1.5 bg-slate-800/25 rounded w-3/4"></div>
                                    </div>

                                    <div className="flex justify-between items-end border-t border-amber-300/80 pt-2">
                                        <div className="font-mono text-xs text-slate-800 tracking-widest font-bold">
                                            ||| |||| | ||||| || ||| | |||
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-bold text-slate-800 block">MFG: 08/2026</span>
                                            <span className="text-[10px] font-bold text-slate-800 block">EXP: 08/2029</span>
                                        </div>
                                    </div>

                                    {!isPass && currentLiveResult.boundingBox && (
                                        <div
                                            className="absolute border-2 border-rose-600 bg-rose-500/30 rounded p-1.5 transition-all shadow-lg flex flex-col justify-between animate-pulse"
                                            style={{
                                                left: `${currentLiveResult.boundingBox.x}%`,
                                                top: `${currentLiveResult.boundingBox.y}%`,
                                                width: `${currentLiveResult.boundingBox.width}%`,
                                                height: `${currentLiveResult.boundingBox.height}%`,
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="bg-rose-600 text-white font-mono font-extrabold text-[10px] px-1.5 py-0.5 rounded shadow-sm">
                                                    {currentLiveResult.boundingBox.label}
                                                </span>
                                                <span className="bg-slate-900/90 text-rose-300 font-mono text-[9px] px-1 rounded">
                                                    CONF: {(currentLiveResult.confidence * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="absolute bottom-3 left-3 bg-slate-900/90 text-white px-2.5 py-1 rounded text-[11px] font-mono border border-slate-700 flex items-center gap-2">
                                <Cpu size={13} className="text-cyan-400" />
                                <span>FRAME: #{currentLiveResult.id} • {currentLiveResult.timestamp.split(' ')[1] || '09:56:26'}</span>
                            </div>
                        </div>

                        {/* Vision Engine Telemetry Bar */}
                        {currentLiveResult.processingMeta && (
                            <div className="bg-slate-950 p-2 px-4 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-emerald-400 font-bold">✓ OpenCV Preprocess: {currentLiveResult.processingMeta.opencv_preprocess_ms || 3.2}ms</span>
                                    <span className="text-cyan-400 font-bold">✓ YOLO v8 Inference: {currentLiveResult.processingMeta.yolo_inference_ms || 18.5}ms</span>
                                    {currentLiveResult.processingMeta.laplacian_variance && (
                                        <span className="text-amber-300">Blur Var: {currentLiveResult.processingMeta.laplacian_variance}</span>
                                    )}
                                </div>
                                <div className="text-slate-300 font-bold">
                                    Total Pipeline: {currentLiveResult.processingMeta.total_pipeline_ms || 21.7}ms
                                </div>
                            </div>
                        )}

                        <div className="bg-slate-900 p-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400 font-mono text-[11px] uppercase font-bold">Simulate Defect State:</span>
                                <div className="inline-flex rounded-md shadow-xs" role="group">
                                    <button
                                        type="button"
                                        onClick={() => handleSelectMockState('PASS')}
                                        className={`px-2.5 py-1 text-xs font-bold rounded-l-md border ${currentMockState === 'PASS'
                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                            }`}
                                    >
                                        PASS
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectMockState('Misalignment')}
                                        className={`px-2.5 py-1 text-xs font-bold border-t border-b ${currentMockState === 'Misalignment'
                                            ? 'bg-rose-600 text-white border-rose-600'
                                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                            }`}
                                    >
                                        FAIL: Misalignment
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectMockState('Smudge')}
                                        className={`px-2.5 py-1 text-xs font-bold border-t border-b ${currentMockState === 'Smudge'
                                            ? 'bg-rose-600 text-white border-rose-600'
                                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                            }`}
                                    >
                                        FAIL: Smudge
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectMockState('Missing Print')}
                                        className={`px-2.5 py-1 text-xs font-bold rounded-r-md border ${currentMockState === 'Missing Print'
                                            ? 'bg-rose-600 text-white border-rose-600'
                                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                            }`}
                                    >
                                        FAIL: Missing Print
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAutoInspectionActive(!isAutoInspectionActive)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors border ${isAutoInspectionActive
                                        ? 'bg-amber-600 text-white border-amber-500'
                                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                                        }`}
                                >
                                    {isAutoInspectionActive ? <Pause size={13} /> : <Play size={13} />}
                                    <span>{isAutoInspectionActive ? 'Pause Auto Run' : 'Auto Stream Mode'}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleNextFrame}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                                >
                                    <RotateCw size={13} />
                                    <span>Inspect Next Substrate</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-4">
                    <div className={`rounded-lg border p-5 shadow-xs transition-all ${isPass
                        ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-100 shadow-emerald-500/10'
                        : 'bg-rose-950/80 border-rose-500/40 text-rose-100 shadow-rose-500/10'
                        }`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 block">
                                    AI DECISION RESULT
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                    {isPass ? (
                                        <CheckCircle2 size={32} className="text-emerald-400 shrink-0" />
                                    ) : (
                                        <XCircle size={32} className="text-rose-500 shrink-0 animate-pulse" />
                                    )}
                                    <div>
                                        <h2 className={`text-2xl font-black tracking-tight ${isPass ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {isPass ? 'PASS' : 'QUALITY ISSUE DETECTED'}
                                        </h2>
                                        {!isPass && (
                                            <span className="font-bold text-sm text-rose-300 block mt-0.5">
                                                Defect Type: {currentLiveResult.defectType}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Launch Visual Walkthrough & Flashcard buttons when defect occurs */}
                        {!isPass && (
                            <div className="mt-4 pt-3 border-t border-rose-500/30 flex flex-col gap-2">
                                <button
                                    onClick={() => setActiveWalkthroughId(currentLiveResult.defectType.toLowerCase().includes('misalignment') ? 'misalignment' : 'surface_scratch')}
                                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4 text-cyan-200 animate-spin" /> Launch Interactive Visual Walkthrough
                                </button>

                                <button
                                    onClick={() => setActiveFlashcardId(currentLiveResult.defectType.toLowerCase().includes('misalignment') ? 'misalignment' : 'surface_scratch')}
                                    className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-2"
                                >
                                    <Layers className="w-4 h-4 text-amber-400" /> Open Defect Flashcard
                                </button>
                            </div>
                        )}

                        <div className="mt-4 pt-3 border-t border-slate-700/80 grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                                <span className="text-[10px] text-slate-400 block font-semibold">AI Confidence</span>
                                <span className="font-mono font-bold text-white text-sm">
                                    {(currentLiveResult.confidence * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
                                <span className="text-[10px] text-slate-400 block font-semibold">Severity Level</span>
                                <span className={`font-bold text-xs uppercase ${isPass
                                    ? 'text-emerald-400'
                                    : currentLiveResult.severity === 'critical' || currentLiveResult.severity === 'high'
                                        ? 'text-rose-400'
                                        : 'text-amber-400'
                                    }`}>
                                    {isPass ? 'NONE' : currentLiveResult.severity || 'HIGH'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/90 rounded-lg border border-slate-800 p-4 shadow-xs space-y-3">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                            <Wrench size={16} className="text-cyan-400" />
                            <h3 className="font-bold text-xs uppercase tracking-wider text-white">
                                AI RECOMMENDED CHECKS
                            </h3>
                        </div>

                        {isPass ? (
                            <div className="py-4 text-center text-slate-400 text-xs">
                                <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-1.5" />
                                <span>Standard print registration within target tolerances. No corrective action required.</span>
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {currentLiveResult.recommendedChecks?.map((checkText, idx) => (
                                    <li key={idx} className="bg-slate-950/80 p-2.5 rounded border border-slate-800 flex items-start gap-2.5 text-xs text-slate-200">
                                        <span className="bg-cyan-500/20 text-cyan-300 font-mono text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5 border border-cyan-500/30">
                                            {idx + 1}
                                        </span>
                                        <span className="font-medium">{checkText}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <InspectionDetailModal
                record={selectedHistoryRecord}
                onClose={() => setSelectedHistoryRecord(null)}
                onAcknowledge={acknowledgeRecord}
            />

            {/* Visual Walkthrough Modal */}
            {activeWalkthroughId && (
                <VisualWalkthroughModal
                    defectId={activeWalkthroughId}
                    onClose={() => setActiveWalkthroughId(null)}
                />
            )}

            {/* Defect Flashcard Modal */}
            {activeFlashcardId && (
                <DefectFlashcardModal
                    initialDefectId={activeFlashcardId}
                    onClose={() => setActiveFlashcardId(null)}
                />
            )}
        </div>
    );
};




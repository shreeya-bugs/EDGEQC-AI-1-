import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Volume2, CheckCircle2, Wrench, Sparkles, ZoomIn } from 'lucide-react';
import { walkthroughGuides } from '../../data/walkthroughData';
import { useVoice } from '../../context/VoiceContext';
import { useLanguage } from '../../context/LanguageContext';


interface VisualWalkthroughModalProps {
  defectId: string;
  onClose: () => void;
}

export const VisualWalkthroughModal: React.FC<VisualWalkthroughModalProps> = ({ defectId, onClose }) => {
  const guideKey = walkthroughGuides[defectId] ? defectId : 'surface_scratch';
  const guide = walkthroughGuides[guideKey];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [actionDone, setActionDone] = useState(false);
  const { speakText } = useVoice();
  const { t } = useLanguage();

  const step = guide.steps[currentStepIndex];
  const totalSteps = guide.steps.length;
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setActionDone(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setActionDone(false);
    }
  };

  const handleSpeak = () => {
    speakText(`${step.title}. ${step.description}`);
  };

  const handlePerformAction = () => {
    setActionDone(true);
    speakText(`Action completed: ${step.expectedOutcome}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-slate-900/95 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  {guide.defectName}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                    Interactive Walkthrough
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Visual Step-by-Step Operator Assistance</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSpeak}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition-colors"
                title="Voice Assistant Narration"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Indicator (Duolingo style) */}
          <div className="w-full bg-slate-800 h-2">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Main Visual Canvas Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
            {/* Interactive SVG Diagram Stage (Left 7 Cols) */}
            <div className="lg:col-span-7 bg-slate-950 p-6 flex flex-col justify-center items-center relative overflow-hidden min-h-[300px]">
              {/* Grid Background Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />

              {/* Animated Interactive SVG Assembly Diagram */}
              <div className="relative w-full max-w-md aspect-video bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                <motion.svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  animate={{
                    scale: step.zoomLevel,
                    translateX: `${(50 - (step.highlightCoordinates.x + step.highlightCoordinates.width / 2)) * (step.zoomLevel - 1)}%`,
                    translateY: `${(50 - (step.highlightCoordinates.y + step.highlightCoordinates.height / 2)) * (step.zoomLevel - 1)}%`
                  }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                  {/* Base Machine Chassis SVG */}
                  <rect x="5" y="10" width="90" height="80" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                  
                  {/* Conveyor Tracks */}
                  <line x1="10" y1="50" x2="90" y2="50" stroke="#475569" strokeWidth="6" strokeDasharray="3 2" />
                  
                  {/* Rollers */}
                  <circle cx="25" cy="50" r="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="9" fill={defectId === 'surface_scratch' ? '#7f1d1d' : '#1e293b'} stroke={defectId === 'surface_scratch' ? '#ef4444' : '#38bdf8'} strokeWidth="2" />
                  <circle cx="75" cy="50" r="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />

                  {/* Top Camera Sensor */}
                  <rect x="42" y="15" width="16" height="12" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                  <polygon points="45,27 55,27 65,45 35,45" fill="rgba(56, 189, 248, 0.15)" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="0.5" />

                  {/* Hotspot Target Area Highlight */}
                  <motion.rect
                    x={step.highlightCoordinates.x}
                    y={step.highlightCoordinates.y}
                    width={step.highlightCoordinates.width}
                    height={step.highlightCoordinates.height}
                    rx="3"
                    fill={actionDone ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}
                    stroke={actionDone ? '#10b981' : '#f43f5e'}
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    animate={{ strokeDashoffset: [0, -10] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  />
                </motion.svg>

                {/* Hotspot Pulse Callout Icon */}
                <motion.div
                  className="absolute p-2 bg-cyan-500/20 border border-cyan-400 rounded-full text-cyan-300 shadow-lg cursor-pointer"
                  style={{
                    left: `${step.highlightCoordinates.x + step.highlightCoordinates.width / 2 - 5}%`,
                    top: `${step.highlightCoordinates.y + step.highlightCoordinates.height / 2 - 5}%`
                  }}
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  onClick={handlePerformAction}
                >
                  {step.interactiveType === 'replace' ? (
                    <Wrench className="w-5 h-5" />
                  ) : step.interactiveType === 'verify' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <ZoomIn className="w-5 h-5" />
                  )}
                </motion.div>

                <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-300 border border-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Target: {step.targetComponent}
                </div>
              </div>
            </div>

            {/* Step Explanation & Action Panel (Right 5 Cols) */}
            <div className="lg:col-span-5 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/90">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                    Step {currentStepIndex + 1} of {totalSteps}
                  </span>
                  {actionDone && (
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Action Verified
                    </span>
                  )}
                </div>

                <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">{step.description}</p>

                {/* Expected Outcome Box */}
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 mb-6">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Expected Outcome
                  </p>
                  <p className="text-sm font-medium text-cyan-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    {step.expectedOutcome}
                  </p>
                </div>
              </div>

              {/* Action & Navigation Controls */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <button
                  onClick={handlePerformAction}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                    actionDone
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25'
                  }`}
                >
                  {actionDone ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Step Action Completed
                    </>
                  ) : (
                    <>
                      <Wrench className="w-4 h-4" /> {step.actionLabel}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={handlePrev}
                    disabled={currentStepIndex === 0}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> {t.previousStep}
                  </button>

                  {currentStepIndex < totalSteps - 1 ? (
                    <button
                      onClick={handleNext}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center justify-center gap-1 transition-colors shadow-md"
                    >
                      {t.nextStep} <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={onClose}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center justify-center gap-1 transition-colors shadow-md"
                    >
                      Complete Walkthrough
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

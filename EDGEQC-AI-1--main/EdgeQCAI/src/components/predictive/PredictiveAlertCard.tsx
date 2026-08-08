import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, Sparkles } from 'lucide-react';
import type { PredictiveAlert } from '../../types';
import { VisualWalkthroughModal } from '../walkthrough/VisualWalkthroughModal';


interface PredictiveAlertCardProps {
  alert?: PredictiveAlert;
}

export const PredictiveAlertCard: React.FC<PredictiveAlertCardProps> = ({ alert }) => {
  const [showWalkthrough, setShowWalkthrough] = useState(false);

  const defaultAlert: PredictiveAlert = {
    id: 'pred-1',
    machineId: 'm2',
    machineName: 'Machine 2 (Line 3)',
    predictedDefectsCount: 50,
    timeframeMinutes: 60,
    confidencePercentage: 92.4,
    riskLevel: 'high',
    rootCauseExplanation: 'Thermal expansion on ceramic roller bearing #3 is producing a 0.4mm lateral guide offset. Mechanical vibration telemetry spiked by +18.2%.',
    suggestedAction: 'Execute bearing lubrication & re-align lateral guide rail prior to next batch run.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const data = alert || defaultAlert;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 shadow-xl shadow-amber-500/10 overflow-hidden"
      >
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  PREDICTIVE AI ALERT
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {data.confidencePercentage}% AI Confidence
                </span>
              </div>

              <h4 className="text-lg font-bold text-white leading-snug">
                {data.machineName} will likely produce{' '}
                <span className="text-amber-400 font-mono font-black">{data.predictedDefectsCount} additional defects</span>{' '}
                within the next {data.timeframeMinutes} minutes.
              </h4>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                <strong className="text-amber-300 font-semibold">Root Cause Explanation:</strong> {data.rootCauseExplanation}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => setShowWalkthrough(true)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Trigger Preventative Fix Walkthrough
            </button>
          </div>
        </div>
      </motion.div>

      {showWalkthrough && (
        <VisualWalkthroughModal
          defectId="surface_scratch"
          onClose={() => setShowWalkthrough(false)}
        />
      )}
    </>
  );
};

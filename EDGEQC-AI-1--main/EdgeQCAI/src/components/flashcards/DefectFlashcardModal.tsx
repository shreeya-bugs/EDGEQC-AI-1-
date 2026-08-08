import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, RotateCw, Wrench, Clock, IndianRupee, ShieldCheck, AlertCircle, Sparkles, Volume2 } from 'lucide-react';
import { defectFlashcards } from '../../data/flashcardData';
import { useVoice } from '../../context/VoiceContext';
import { VisualWalkthroughModal } from '../walkthrough/VisualWalkthroughModal';

interface DefectFlashcardModalProps {
  initialDefectId?: string;
  onClose: () => void;
}

export const DefectFlashcardModal: React.FC<DefectFlashcardModalProps> = ({ initialDefectId = 'surface_scratch', onClose }) => {
  const flashcardKeys = Object.keys(defectFlashcards);
  const initialIndex = flashcardKeys.indexOf(initialDefectId) >= 0 ? flashcardKeys.indexOf(initialDefectId) : 0;
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const { speakText } = useVoice();

  const currentCard = defectFlashcards[flashcardKeys[currentIndex]];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % flashcardKeys.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + flashcardKeys.length) % flashcardKeys.length);
  };

  const handleSpeak = () => {
    speakText(`${currentCard.title}. Severity ${currentCard.severity}. Recommended fix: ${currentCard.recommendedFix}`);
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-xl flex flex-col items-center"
          >
            {/* Top Navigation Bar */}
            <div className="w-full flex items-center justify-between mb-4 px-2">
              <div className="flex items-center space-x-2 text-white font-bold text-lg">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <span>Interactive Defect Flashcard</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  {currentIndex + 1} / {flashcardKeys.length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSpeak}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                  title="Speak Flashcard Summary"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 3D Flippable Card Container */}
            <div className="w-full perspective-1000 h-[520px]">
              <motion.div
                className="w-full h-full relative preserve-3d cursor-pointer"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                {/* FRONT OF CARD */}
                <div className="absolute inset-0 backface-hidden bg-slate-900/95 border border-amber-500/30 rounded-2xl shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full border ${
                        currentCard.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : currentCard.severity === 'high'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      }`}>
                        {currentCard.severity} Severity
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                        className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20"
                      >
                        <RotateCw className="w-3.5 h-3.5" /> Flip Card
                      </button>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4">{currentCard.title}</h3>

                    {/* Common Causes */}
                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-400" /> Common Root Causes
                      </p>
                      <ul className="space-y-1.5">
                        {currentCard.commonCauses.map((cause, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            {cause}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommended Fix */}
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                      <p className="text-xs uppercase tracking-wider font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                        <Wrench className="w-4 h-4" /> Recommended Action
                      </p>
                      <p className="text-xs text-slate-200 leading-relaxed">{currentCard.recommendedFix}</p>
                    </div>
                  </div>

                  {/* Card Footer Info Badges */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <div>
                        <p className="text-[10px] text-slate-400">Est. Repair Time</p>
                        <p className="text-xs font-bold text-white">{currentCard.estimatedRepairTime}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
                      <IndianRupee className="w-4 h-4 text-rose-400" />
                      <div>
                        <p className="text-[10px] text-slate-400">Est. Production Loss</p>
                        <p className="text-xs font-bold text-white">₹{currentCard.estimatedFinancialLoss.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BACK OF CARD */}
                <div className="absolute inset-0 backface-hidden rotateY-180 bg-slate-900/95 border border-cyan-500/30 rounded-2xl shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                        Preventative Maintenance
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20"
                      >
                        <RotateCw className="w-3.5 h-3.5" /> Flip Back
                      </button>
                    </div>

                    <h4 className="text-xl font-bold text-white mb-4">Prevention Tips & Protocols</h4>

                    <div className="space-y-3 mb-6">
                      {currentCard.preventionTips.map((tip, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-200">{tip}</p>
                        </div>
                      ))}
                    </div>

                    {/* Example Image Preview */}
                    {currentCard.exampleImages.length > 0 && (
                      <div className="rounded-xl overflow-hidden border border-slate-800 h-28 relative">
                        <img
                          src={currentCard.exampleImages[0]}
                          alt={currentCard.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-2">
                          <span className="text-[10px] text-white font-mono bg-black/60 px-2 py-0.5 rounded">
                            Defect Pattern Snapshot
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowWalkthrough(true);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Open Visual Walkthrough
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Bottom Swipe Controls */}
            <div className="w-full flex items-center justify-between mt-4 px-2">
              <button
                onClick={handlePrev}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous Card
              </button>

              <button
                onClick={() => setShowWalkthrough(true)}
                className="py-2 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" /> Walkthrough
              </button>

              <button
                onClick={handleNext}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                Next Card <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Visual Walkthrough Modal Launch */}
      {showWalkthrough && (
        <VisualWalkthroughModal
          defectId={currentCard.id}
          onClose={() => setShowWalkthrough(false)}
        />
      )}
    </>
  );
};

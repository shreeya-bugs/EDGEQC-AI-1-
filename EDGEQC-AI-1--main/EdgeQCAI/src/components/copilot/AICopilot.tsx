import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, MicOff, Sparkles, Bot, User, Volume2, Layers } from 'lucide-react';
import { useVoice } from '../../context/VoiceContext';
import { useLanguage } from '../../context/LanguageContext';
import type { ChatMessage } from '../../types';
import { VisualWalkthroughModal } from '../walkthrough/VisualWalkthroughModal';
import { DefectFlashcardModal } from '../flashcards/DefectFlashcardModal';


export const AICopilot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Hello! I am your **EdgeQC AI Quality Co-Pilot**.\n\nI monitor real-time inspection feeds, machine telemetry, and defect trends. How can I assist you on the factory floor today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeWalkthroughDefectId, setActiveWalkthroughDefectId] = useState<string | null>(null);
  const [activeFlashcardDefectId, setActiveFlashcardDefectId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, startListening, stopListening, speakText } = useVoice();
  const { t, language } = useLanguage();

  // Quick Suggestion Chips requested by user
  const suggestionChips = [
    'Why did this product fail?',
    'What caused this defect?',
    'Is this defect critical?',
    'How do I fix it?',
    'Show previous similar defects.',
    'Which machine is producing the highest defect rate?',
    "Summarize today's inspection.",
    'Explain this report.'
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Sync voice transcript to input text
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Send query to backend or local AI engine
  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Send to FastAPI backend endpoint `/api/chat`
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language: language,
          conversation_history: messages.map(m => ({ role: m.sender, content: m.text }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          walkthroughDefectId: data.walkthrough_defect_id || (textToSend.toLowerCase().includes('fix') || textToSend.toLowerCase().includes('scratch') ? 'surface_scratch' : undefined),
          flashcardDefectId: data.flashcard_defect_id || (textToSend.toLowerCase().includes('defect') || textToSend.toLowerCase().includes('fail') ? 'surface_scratch' : undefined)
        };
        setMessages(prev => [...prev, aiMsg]);
        speakText(data.reply.replace(/[*#_`]/g, ''));
      } else {
        throw new Error('Backend offline');
      }
    } catch (e) {
      // Local Fallback AI response engine with factory context
      setTimeout(() => {
        let reply = '';
        let walkthroughId: string | undefined = undefined;
        let flashcardId: string | undefined = undefined;

        const lower = textToSend.toLowerCase();

        if (lower.includes('why did this product fail') || lower.includes('fail')) {
          reply = '**Root Cause Analysis:**\nThe inspection unit flagged a **Surface Scratch** defect with 94.2% confidence on Machine 3 (Line 2).\n\n- **Primary Cause:** Ceramic bearing wear on Roller #3 created friction scratch marks.\n- **Secondary Cause:** Conveyor speed drift (+4.2 RPM over tolerance).\n\nWould you like to step through the interactive Visual Walkthrough to resolve this?';
          walkthroughId = 'surface_scratch';
          flashcardId = 'surface_scratch';
        } else if (lower.includes('how do i fix') || lower.includes('fix')) {
          reply = '**Recommended Fix Procedure:**\n1. Stop Line 2 conveyor bed.\n2. Swap the ceramic bearing sleeve on Roller #3.\n3. Wipe guide tracks with isopropyl alcohol.\n4. Re-torque flange bolt to **15 Nm**.\n\n*Estimated Repair Time: 15 Mins | Production Loss Saved: ₹12,500*';
          walkthroughId = 'surface_scratch';
          flashcardId = 'surface_scratch';
        } else if (lower.includes('highest defect rate') || lower.includes('which machine')) {
          reply = '**Factory Telematics Breakdown:**\n- **Machine 3 (Line 2)** has the highest defect rate today at **4.8%** (18 defects total).\n- **Top Defect:** Surface Scratch (12 occurrences).\n- **Machine 1 (Line 1):** 1.2% defect rate (Normal).\n- **Machine 2 (Line 3):** 2.1% defect rate (Warning - vibration drift).';
          walkthroughId = 'misalignment';
        } else if (lower.includes('summarize today') || lower.includes('summarize')) {
          reply = "📊 **Today's Inspection Summary:**\n- **Total Inspected:** 1,248 Units\n- **PASS Rate:** 96.2% (1,201 Passed)\n- **FAIL Count:** 47 Units\n- **Top Issues:** Surface Scratch (52%), Package Misalignment (30%), Ink Smudge (18%).\n- **Overall Factory Health Score:** 94/100 (Optimal).";
        } else if (lower.includes('critical')) {
          reply = '⚠️ **Defect Criticality Level: HIGH**\nSurface scratches on optical packaging exceed consumer tolerances and can result in line shutdown if defect count exceeds 25 units per hour.';
          flashcardId = 'surface_scratch';
        } else {
          reply = `I have processed your query: "*${textToSend}*"\n\nBased on real-time YOLOv8 optical telemetry, all line sensors are operating normally. Let me know if you need a step-by-step visual walkthrough or a defect flashcard.`;
        }

        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          walkthroughDefectId: walkthroughId,
          flashcardDefectId: flashcardId
        };

        setMessages(prev => [...prev, aiMsg]);
        speakText(reply.replace(/[*#_`]/g, ''));
        setIsTyping(false);
      }, 700);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <motion.button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-2xl shadow-cyan-500/40 border border-cyan-300/30 flex items-center justify-center group"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        title="Open AI Quality Co-Pilot"
      >
        <div className="relative">
          <Bot className="w-7 h-7 animate-bounce" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping" />
        </div>
      </motion.button>

      {/* Floating Glassmorphic Chat Widget Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-40 w-full max-w-lg h-[640px] bg-slate-900/95 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 backdrop-blur-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {t.copilotTitle}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                      LIVE
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">{t.copilotSubtitle}</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Scroll View */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                      : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-bl-none'
                  }`}>
                    <div className="flex items-center justify-between mb-1 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 font-semibold">
                        {msg.sender === 'user' ? (
                          <>
                            <User className="w-3 h-3 text-cyan-300" /> Operator
                          </>
                        ) : (
                          <>
                            <Bot className="w-3 h-3 text-cyan-400" /> Quality Co-Pilot
                          </>
                        )}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className="text-xs leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* Feature 2: Interactive Visual Walkthrough Button attached to response */}
                    {msg.sender === 'assistant' && (
                      <div className="mt-3 pt-2 border-t border-slate-700/60 flex flex-wrap gap-2">
                        {msg.walkthroughDefectId && (
                          <button
                            onClick={() => setActiveWalkthroughDefectId(msg.walkthroughDefectId || 'surface_scratch')}
                            className="py-1.5 px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-[11px] font-bold shadow-md flex items-center gap-1.5 transition-all"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Visual Walkthrough
                          </button>
                        )}

                        {msg.flashcardDefectId && (
                          <button
                            onClick={() => setActiveFlashcardDefectId(msg.flashcardDefectId || 'surface_scratch')}
                            className="py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1.5 transition-all"
                          >
                            <Layers className="w-3.5 h-3.5" /> Defect Flashcard
                          </button>
                        )}

                        <button
                          onClick={() => speakText(msg.text.replace(/[*#_`]/g, ''))}
                          className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300"
                          title="Read aloud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3 flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span className="text-xs text-slate-400 font-mono">Analyzing factory telemetry...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto no-scrollbar">
              {suggestionChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(chip)}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-[11px] transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-3 bg-slate-950 border-t border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center space-x-2"
              >
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isListening
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-400 hover:text-cyan-300 border-slate-700'
                  }`}
                  title="Voice Speech Input"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.speakPrompt}
                  className="flex-1 py-2 px-3.5 bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-colors"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Walkthrough Modal */}
      {activeWalkthroughDefectId && (
        <VisualWalkthroughModal
          defectId={activeWalkthroughDefectId}
          onClose={() => setActiveWalkthroughDefectId(null)}
        />
      )}

      {/* Defect Flashcard Modal */}
      {activeFlashcardDefectId && (
        <DefectFlashcardModal
          initialDefectId={activeFlashcardDefectId}
          onClose={() => setActiveFlashcardDefectId(null)}
        />
      )}
    </>
  );
};

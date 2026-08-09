import React, { useState } from 'react';
import { apiUrl } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, CheckCircle2, Sparkles, PhoneCall } from 'lucide-react';
import type { WhatsAppReportPayload } from '../../types';

interface WhatsAppReportModalProps {
  onClose: () => void;
  defaultPayload?: Partial<WhatsAppReportPayload>;
}

export const WhatsAppReportModal: React.FC<WhatsAppReportModalProps> = ({ onClose, defaultPayload }) => {
  const [phoneNumber, setPhoneNumber] = useState(defaultPayload?.recipientPhone || '+91 98765 43210');
  const [alertType, setAlertType] = useState<'critical' | 'hourly' | 'daily'>(defaultPayload?.alertType || 'critical');
  const [machineName] = useState(defaultPayload?.machineName || 'Machine 3 (Line 2)');
  const [defectCount] = useState(defaultPayload?.defectCount || 15);
  const [topIssue] = useState(defaultPayload?.topIssue || 'Surface Scratch');
  const [recommendedAction] = useState(defaultPayload?.recommendedAction || 'Inspect Roller Assembly & Ceramic Bearing #3');
  const [estimatedLoss] = useState(defaultPayload?.estimatedLoss || 12500);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const messageBody = `EdgeQC AI Factory Alert (${alertType.toUpperCase()})\n\nMachine: ${machineName}\nDefect Count: ${defectCount} Units\nTop Issue: ${topIssue}\nRecommended Action: ${recommendedAction}\nEst. Production Loss: Rs. ${estimatedLoss.toLocaleString('en-IN')}\n\nGenerated automatically by EdgeQC AI Quality Co-Pilot`;

  const handleSendReport = async () => {
    setIsSending(true);
    try {
      await fetch(apiUrl('/api/whatsapp/send'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_phone: phoneNumber,
          machine_name: machineName,
          defect_count: defectCount,
          top_issue: topIssue,
          recommended_action: recommendedAction,
          estimated_loss: estimatedLoss,
          alert_type: alertType,
        }),
      });
    } catch (e) {
      console.log('WhatsApp report logged locally only');
    }

    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900/95 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">WhatsApp AI Executive Summary</h3>
                <p className="text-xs text-slate-400">Automated Dispatch to Owner WhatsApp</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">Select Report Schedule / Trigger</label>
              <div className="grid grid-cols-3 gap-2">
                {(['critical', 'hourly', 'daily'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAlertType(type)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs capitalize transition-all border ${
                      alertType === type
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {type} Report
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> Owner WhatsApp Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl text-xs text-white outline-none"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> AI Generated WhatsApp Message Preview
              </label>
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 font-mono text-xs text-emerald-200 whitespace-pre-line leading-relaxed shadow-inner">
                {messageBody}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
              {sentSuccess ? (
                <div className="w-full py-3 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Report Logged Successfully!
                </div>
              ) : (
                <button
                  onClick={handleSendReport}
                  disabled={isSending}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Summary to WhatsApp
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

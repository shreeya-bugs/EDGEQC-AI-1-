import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLanguage } from './LanguageContext';
import { useNavigate } from 'react-router-dom';

interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  isSpeaking: boolean;
  startListening: () => void;
  stopListening: () => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  lastCommand: string | null;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  // Map supported language to Web Speech API locale string
  const getLocale = useCallback(() => {
    switch (language) {
      case 'hi': return 'hi-IN';
      case 'kn': return 'kn-IN';
      case 'mr': return 'mr-IN';
      default: return 'en-US';
    }
  }, [language]);

  // Voice Command Navigation Execution
  const processVoiceCommand = useCallback((text: string) => {
    const lower = text.toLowerCase();
    setLastCommand(text);

    if (lower.includes('dashboard') || lower.includes('overview') || lower.includes('डैशबोर्ड')) {
      navigate('/operator');
    } else if (lower.includes('live') || lower.includes('inspection') || lower.includes('कैमरा') || lower.includes('ತಪಾಸಣೆ')) {
      navigate('/operator/live');
    } else if (lower.includes('analytics') || lower.includes('विश्लेषण')) {
      navigate('/supervisor/analytics');
    } else if (lower.includes('alerts') || lower.includes('अलर्ट')) {
      navigate('/supervisor/alerts');
    } else if (lower.includes('factory health') || lower.includes('health')) {
      navigate('/factory-health');
    } else if (lower.includes('owner') || lower.includes('executive')) {
      navigate('/owner');
    } else if (lower.includes('reports') || lower.includes('रिपोर्ट')) {
      navigate('/owner/reports');
    }
  }, [navigate]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = getLocale();

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onerror = (event: any) => {
        console.warn('Voice recognition error:', event.error);
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        if (event.results[0].isFinal) {
          processVoiceCommand(currentTranscript);
        }
      };

      setRecognition(rec);
    }
  }, [getLocale, processVoiceCommand]);

  const startListening = () => {
    if (recognition) {
      try {
        recognition.lang = getLocale();
        setTranscript('');
        recognition.start();
      } catch (e) {
        console.warn('Recognition already active');
      }
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Clear queued speech
    const cleanText = text.replace(/[*#_`]/g, ''); // strip markdown formatting
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = getLocale();

    // Select suitable voice if available
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = getLocale().split('-')[0];
    const matchedVoice = voices.find(v => v.lang.startsWith(langPrefix));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        transcript,
        isSpeaking,
        startListening,
        stopListening,
        speakText,
        stopSpeaking,
        lastCommand
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) throw new Error('useVoice must be used within VoiceProvider');
  return context;
};

import type { SupportedLanguage } from '../types';


export interface TranslationDict {
  appName: string;
  tagline: string;
  operatorDashboard: string;
  supervisorDashboard: string;
  ownerDashboard: string;
  liveInspection: string;
  factoryHealth: string;
  analytics: string;
  alerts: string;
  qualityIssues: string;
  reports: string;
  history: string;
  setup: string;
  copilotTitle: string;
  copilotSubtitle: string;
  visualWalkthrough: string;
  defectFlashcard: string;
  voiceAssistant: string;
  listening: string;
  speakPrompt: string;
  sendWhatsAppReport: string;
  predictiveAlertTitle: string;
  healthScore: string;
  pass: string;
  fail: string;
  confidence: string;
  repairTime: string;
  financialLoss: string;
  commonCauses: string;
  recommendedFix: string;
  preventionTips: string;
  nextStep: string;
  previousStep: string;
  close: string;
}

export const translations: Record<SupportedLanguage, TranslationDict> = {
  en: {
    appName: 'EdgeQC AI',
    tagline: 'AI Quality Co-Pilot',
    operatorDashboard: 'Operator Dashboard',
    supervisorDashboard: 'Supervisor Intelligence',
    ownerDashboard: 'Owner Executive Overview',
    liveInspection: 'Live AI Inspection',
    factoryHealth: 'Factory Health Dashboard',
    analytics: 'Quality Analytics',
    alerts: 'Smart Alerts',
    qualityIssues: 'Root Cause Issues',
    reports: 'WhatsApp & PDF Reports',
    history: 'Inspection History',
    setup: 'Job Setup',
    copilotTitle: 'Quality Co-Pilot',
    copilotSubtitle: 'Powered by Gemini & OpenAI Edge Engine',
    visualWalkthrough: 'Visual Walkthrough',
    defectFlashcard: 'Defect Flashcard',
    voiceAssistant: 'Hands-Free Voice',
    listening: 'Listening...',
    speakPrompt: 'Speak your query or command...',
    sendWhatsAppReport: 'Send WhatsApp AI Summary',
    predictiveAlertTitle: 'Predictive Quality Risk Alert',
    healthScore: 'Factory Health Score',
    pass: 'PASS',
    fail: 'FAIL',
    confidence: 'Confidence',
    repairTime: 'Est. Repair Time',
    financialLoss: 'Est. Production Loss',
    commonCauses: 'Common Root Causes',
    recommendedFix: 'Recommended Action & Fix',
    preventionTips: 'Preventative Maintenance',
    nextStep: 'Next Step',
    previousStep: 'Previous Step',
    close: 'Close'
  },
  hi: {
    appName: 'EdgeQC AI',
    tagline: 'एआई गुणवत्ता सह-पायलट',
    operatorDashboard: 'ऑपरेटर डैशबोर्ड',
    supervisorDashboard: 'सुपरवाइजर इंटेलिजेंस',
    ownerDashboard: 'मालिक कार्यकारी अवलोकन',
    liveInspection: 'लाइव एआई निरीक्षण',
    factoryHealth: 'फैक्ट्री स्वास्थ्य डैशबोर्ड',
    analytics: 'गुणवत्ता विश्लेषण',
    alerts: 'स्मार्ट अलर्ट',
    qualityIssues: 'मूल कारण के मुद्दे',
    reports: 'व्हाट्सएप और पीडीएफ रिपोर्ट',
    history: 'निरीक्षण इतिहास',
    setup: 'जॉब सेटअप',
    copilotTitle: 'क्वालिटी सह-पायलट',
    copilotSubtitle: 'जेमिनी और ओपनएआई द्वारा संचालित',
    visualWalkthrough: 'विजुअल वॉकथ्रू',
    defectFlashcard: 'दोष फ्लैशकार्ड',
    voiceAssistant: 'वॉइस असिस्टेंट (हैंड्स-फ्री)',
    listening: 'सुन रहा है...',
    speakPrompt: 'अपना प्रश्न या आदेश बोलें...',
    sendWhatsAppReport: 'व्हाट्सएप एआई सारांश भेजें',
    predictiveAlertTitle: 'पूर्वानुमानित गुणवत्ता जोखिम चेतावनी',
    healthScore: 'फैक्ट्री स्वास्थ्य स्कोर',
    pass: 'पास (PASS)',
    fail: 'विफल (FAIL)',
    confidence: 'विश्वास दर',
    repairTime: 'अनुमानित मरम्मत समय',
    financialLoss: 'अनुमानित उत्पादन हानि',
    commonCauses: 'सामान्य मूल कारण',
    recommendedFix: 'अनुशंसित सुधार',
    preventionTips: 'निवारक रखरखाव सुझाव',
    nextStep: 'अगला कदम',
    previousStep: 'पिछला कदम',
    close: 'बंद करें'
  },
  kn: {
    appName: 'EdgeQC AI',
    tagline: 'ಎಐ ಗುಣಮಟ್ಟದ ಸಹ-ಪೈಲಟ್',
    operatorDashboard: 'ಆಪರೇಟರ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    supervisorDashboard: 'ಮೇಲ್ವಿಚಾರಕ ಬುದ್ಧಿವಂತಿಕೆ',
    ownerDashboard: 'ಮಾಲೀಕರ ಕಾರ್ಯನಿರ್ವಾಹಕ ನೋಟ',
    liveInspection: 'ಲೈವ್ ಎಐ ತಪಾಸಣೆ',
    factoryHealth: 'ಫ್ಯಾಕ್ಟರಿ ಆರೋಗ್ಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    analytics: 'ಗುಣಮಟ್ಟದ ವಿಶ್ಲೇಷಣೆ',
    alerts: 'ಸ್ಮಾರ್ಟ್ ಎಚ್ಚರಿಕೆಗಳು',
    qualityIssues: 'ಮೂಲ ಕಾರಣದ ಸಮಸ್ಯೆಗಳು',
    reports: 'ವಾಟ್ಸಾಪ್ ಮತ್ತು ಪಿಡಿಎಫ್ ವರದಿಗಳು',
    history: 'ತಪಾಸಣೆ ಇತಿಹಾಸ',
    setup: 'ಉದ್ಯೋಗ ಸಂರಚನೆ',
    copilotTitle: 'ಗುಣಮಟ್ಟದ ಸಹ-ಪೈಲಟ್',
    copilotSubtitle: 'ಜೆಮಿನಿ ಮತ್ತು ಓಪನ್ ಎಐ ಚಾಲಿತ',
    visualWalkthrough: 'ದೃಶ್ಯ ಹಂತಗಳ ಮಾರ್ಗದರ್ಶಿ (Walkthrough)',
    defectFlashcard: 'ದೋಷ ಫ್ಲ್ಯಾಶ್‌ಕಾರ್ಡ್',
    voiceAssistant: 'ಧ್ವನಿ ಸಹಾಯಕ (ಹ್ಯಾಂಡ್ಸ್-ಫ್ರೀ)',
    listening: 'ಆಲಿಸಲಾಗುತ್ತಿದೆ...',
    speakPrompt: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಅಥವಾ ಆಜ್ಞೆಯನ್ನು ಹೇಳಿ...',
    sendWhatsAppReport: 'ವಾಟ್ಸಾಪ್ ಎಐ ಸಾರಾಂಶ ಕಳುಹಿಸಿ',
    predictiveAlertTitle: 'ಮುನ್ಸೂಚನೆಯ ಗುಣಮಟ್ಟದ ಅಪಾಯದ ಎಚ್ಚರಿಕೆ',
    healthScore: 'ಫ್ಯಾಕ್ಟರಿ ಆರೋಗ್ಯ ಸ್ಕೋರ್',
    pass: 'ಉತ್ತೀರ್ಣ (PASS)',
    fail: 'ವಿಫಲ (FAIL)',
    confidence: 'ಆತ್ಮವಿಶ್ವಾಸ',
    repairTime: 'ಅಂದಾಜು ದುರಸ್ತಿ ಸಮಯ',
    financialLoss: 'ಅಂದಾಜು ಉತ್ಪಾದನಾ ನಷ್ಟ',
    commonCauses: 'ಸಾಮಾನ್ಯ ಮೂಲ ಕಾರಣಗಳು',
    recommendedFix: 'ಶಿಫಾರಸು ಮಾಡಿದ ದುರಸ್ತಿ',
    preventionTips: 'ತಡೆಗಟ್ಟುವ ನಿರ್ವಹಣೆ ಸಲಹೆಗಳು',
    nextStep: 'ಮುಂದಿನ ಹಂತ',
    previousStep: 'ಹಿಂದಿನ ಹಂತ',
    close: 'ಮುಚ್ಚಿ'
  },
  mr: {
    appName: 'EdgeQC AI',
    tagline: 'एआय गुणवत्ता सह-पायलट',
    operatorDashboard: 'ऑपरेटर डॅशबोर्ड',
    supervisorDashboard: 'सुपरवायझर बुद्धिमत्ता',
    ownerDashboard: 'मालक कार्यकारी विहंगावलोकन',
    liveInspection: 'थेट एआय तपासणी',
    factoryHealth: 'कारखाना आरोग्य डॅशबोर्ड',
    analytics: 'गुणवत्ता विश्लेषण',
    alerts: 'स्मार्ट सूचना',
    qualityIssues: 'मूळ कारणांच्या समस्या',
    reports: 'व्हॉट्सॲप आणि पीडीएफ अहवाल',
    history: 'तपासणी इतिहास',
    setup: 'जॉब सेटअप',
    copilotTitle: 'क्वालिटी सह-पायलट',
    copilotSubtitle: 'जेमिनी आणि ओपनएआय द्वारे समर्थित',
    visualWalkthrough: 'व्हिज्युअल वॉकथ्रू',
    defectFlashcard: 'दोष फ्लॅशकार्ड',
    voiceAssistant: 'व्हॉइस असिस्टंट (हँड्स-फ्री)',
    listening: 'ऐकत आहे...',
    speakPrompt: 'तुमचा प्रश्न किंवा कमांड बोला...',
    sendWhatsAppReport: 'व्हॉट्सॲप एआय सारांश पाठवा',
    predictiveAlertTitle: 'पूर्वानुमानित गुणवत्ता धोक्याची सूचना',
    healthScore: 'कारखाना आरोग्य स्कोअर',
    pass: 'पास (PASS)',
    fail: 'नापास (FAIL)',
    confidence: 'विश्वासार्हता',
    repairTime: 'अंदाजे दुरुस्तीची वेळ',
    financialLoss: 'अंदाजे उत्पादन नुकसान',
    commonCauses: 'सामान्य मूळ कारणे',
    recommendedFix: 'शिफारस केलेली कृती व दुरुस्ती',
    preventionTips: 'प्रतिबंधात्मक देखभाल टीप्स',
    nextStep: 'पुढील पायरी',
    previousStep: 'मागील पायरी',
    close: 'बंद करा'
  }
};

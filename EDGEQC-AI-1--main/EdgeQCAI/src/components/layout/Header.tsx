import React, { useState, useEffect } from 'react';
import {
  Camera,
  UserCheck,
  ChevronDown,
  Clock,
  Layers,
  Activity,
  Globe,
  Sun,
  Moon,
  Mic
} from 'lucide-react';

import { useInspection } from '../../context/InspectionContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useVoice } from '../../context/VoiceContext';
import { MOCK_USERS } from '../../data/mockData';
import type { Role, SupportedLanguage } from '../../types';

export const Header: React.FC = () => {
  const { currentUser, setCurrentUser, activeJob } = useInspection();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { isListening } = useVoice();

  const [time, setTime] = useState<string>('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState<boolean>(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState<boolean>(false);

  const langNames: Record<SupportedLanguage, string> = {
    en: 'English 🇬🇧',
    hi: 'हिंदी 🇮🇳',
    kn: 'ಕನ್ನಡ 🇮🇳',
    mr: 'मराठी 🇮🇳'
  };

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectRole = (role: Role) => {
    const targetUser = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
    setCurrentUser(targetUser);
    setIsRoleDropdownOpen(false);
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'operator':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'supervisor':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'owner':
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <header className="edgeqc-header text-[var(--text)] border-b border-[var(--border)] px-4 py-2.5 flex items-center justify-between shadow-sm sticky top-0 z-30 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="edgeqc-brand-badge p-1.5 rounded-lg flex items-center justify-center text-white shadow-inner">
          <Activity size={20} className="stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-white">{t.appName}</span>
            <span className="edgeqc-pill text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-[rgba(241,141,62,0.18)] flex items-center gap-1 font-bold">
              {t.tagline}
            </span>
          </div>
          <p className="text-[11px] edgeqc-text-muted font-medium">Next-Gen HCI Quality Co-Pilot & Factory Telematics</p>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-5 bg-[rgba(44,52,74,0.72)] px-4 py-1.5 rounded-lg border border-[rgba(172,186,196,0.12)]">
        <div className="flex items-center gap-2 text-xs border-r border-[rgba(225,217,188,0.15)] pr-4">
          <Layers size={14} className="text-[var(--accent)]" />
          <div>
            <span className="edgeqc-text-muted block text-[10px] uppercase tracking-wider font-semibold">Active Line</span>
            <span className="font-semibold text-white">{activeJob.machine.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <Camera size={14} className="text-[var(--accent)]" />
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
          <span className="edgeqc-text-muted font-medium">HUD 1080p</span>
        </div>

        {isListening && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--accent)] bg-[rgba(241,141,62,0.12)] px-2 py-0.5 rounded border border-[rgba(241,141,62,0.2)] animate-pulse">
            <Mic size={12} />
            <span className="font-mono text-[10px] font-bold">STT Voice Active</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs font-mono edgeqc-text-muted border-l border-[rgba(225,217,188,0.15)] pl-4">
          <Clock size={13} className="text-[var(--text-muted)]" />
          <span>{time || '09:56:26'}</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Multilingual Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            className="edgeqc-button flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
          >
            <Globe size={14} className="text-[var(--accent)]" />
            <span>{langNames[language]}</span>
            <ChevronDown size={12} className="text-[var(--text-muted)]" />
          </button>

          {isLangDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-[rgba(29,36,54,0.98)] rounded-md shadow-xl border border-[rgba(225,217,188,0.12)] py-1 z-50 text-xs text-[var(--text)]">
              {(['en', 'hi', 'kn', 'mr'] as SupportedLanguage[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-[rgba(241,141,62,0.12)] flex items-center justify-between ${
                    language === lang ? 'bg-[rgba(241,141,62,0.15)] text-white font-bold' : 'text-[var(--text-muted)]'
                  }`}
                >
                  <span>{langNames[lang]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="edgeqc-button p-2 rounded-md"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun size={15} className="text-[var(--accent)]" /> : <Moon size={15} className="text-[var(--text-muted)]" />}
        </button>

        {/* User Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="edgeqc-button flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium"
          >
            <UserCheck size={15} className="text-[var(--accent)]" />
            <div className="text-left hidden sm:block">
              <div className="font-semibold text-[var(--text)] text-xs">{currentUser.name}</div>
              <div className="flex items-center gap-1">
                <span className={`text-[10px] px-1 py-0.2 rounded font-bold uppercase ${getRoleBadgeColor(currentUser.role)}`}>
                  {currentUser.role}
                </span>
              </div>
            </div>
            <ChevronDown size={14} className="text-[var(--text-muted)] ml-1" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[rgba(29,36,54,0.98)] text-[var(--text)] rounded-md shadow-xl border border-[rgba(225,217,188,0.12)] py-1.5 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-[rgba(225,217,188,0.12)] bg-[rgba(38,44,64,0.95)]">
                <span className="font-semibold text-[var(--text)] block">Switch Active User Role</span>
                <span className="text-[10px] text-[var(--text-muted)]">Changes navigation permissions</span>
              </div>
              {MOCK_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectRole(user.role)}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[rgba(241,141,62,0.12)] transition-colors ${
                    currentUser.id === user.id ? 'bg-[rgba(241,141,62,0.15)] text-white font-semibold' : 'text-[var(--text-muted)]'
                  }`}
                >
                  <div>
                    <div className="font-medium text-[var(--text)]">{user.name}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{user.title}</div>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


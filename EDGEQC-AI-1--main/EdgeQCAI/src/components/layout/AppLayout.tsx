import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AICopilot } from '../copilot/AICopilot';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-shell min-h-screen flex flex-col relative font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[rgba(44,52,74,0.88)] p-4 lg:p-6 transition-colors duration-300">
          {children}
        </main>
      </div>
      {/* Floating AI Quality Co-Pilot Widget */}
      <AICopilot />
    </div>
  );
};


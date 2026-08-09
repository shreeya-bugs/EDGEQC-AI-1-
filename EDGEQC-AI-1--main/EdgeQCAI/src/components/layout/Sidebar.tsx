import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Eye,
  History,
  BarChart3,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  Search,
  Bell,
  Zap,
  Activity,
} from 'lucide-react';

import { useInspection } from '../../context/InspectionContext';

export const Sidebar: React.FC = () => {
  const { role, activeJob } = useInspection();
  const location = useLocation();
  const navigate = useNavigate();

  const getNavItems = () => {
    switch (role) {
      case 'operator':
        return [
          {
            section: 'Operator Workflow',
            items: [
              { label: 'Overview', path: '/operator', icon: LayoutDashboard },
              { label: 'Live Inspection', path: '/operator/live', icon: Eye, badge: 'LIVE' },
              { label: 'Factory Health', path: '/factory-health', icon: Activity, badge: 'AI' },
              { label: 'History & Logs', path: '/operator/history', icon: History },
            ],
          },
          {
            section: 'Setup & Line',
            items: [
              { label: 'Inspection Setup', path: '/operator/setup', icon: Sliders },
            ],
          },
        ];
      case 'supervisor':
        return [
          {
            section: 'Supervisor Control',
            items: [
              { label: 'Overview', path: '/supervisor', icon: LayoutDashboard },
              { label: 'Factory Health', path: '/factory-health', icon: Activity, badge: 'AI' },
              { label: 'Quality Intelligence', path: '/supervisor/intelligence', icon: Zap },
              { label: 'Inspections', path: '/supervisor/inspections', icon: Search },
              { label: 'Alerts', path: '/supervisor/alerts', icon: Bell },
              { label: 'Analytics', path: '/supervisor/analytics', icon: BarChart3 },
            ],
          },
          {
            section: 'Operator Links',
            items: [
              { label: 'Live Inspection Screen', path: '/operator/live', icon: Eye },
              { label: 'Inspection History', path: '/operator/history', icon: History },
            ],
          },
        ];
      case 'owner':
        return [
          {
            section: 'Executive QA Suite',
            items: [
              { label: 'Factory Health Score', path: '/factory-health', icon: Activity, badge: 'AI' },
              { label: 'Quality Overview', path: '/owner', icon: ShieldCheck },
              { label: 'Analytics', path: '/owner/analytics', icon: BarChart3 },
              { label: 'Quality Issues', path: '/owner/issues', icon: AlertTriangle },
              { label: 'Reports', path: '/owner/reports', icon: FileSpreadsheet },
              { label: 'Inspection Records', path: '/owner/records', icon: Search },
            ],
          },
          {
            section: 'Operations Access',
            items: [
              { label: 'Supervisor View', path: '/supervisor', icon: LayoutDashboard },
              { label: 'Operator Live View', path: '/operator/live', icon: Eye },
            ],
          },
        ];
    }
  };


  const navSections = getNavItems();

  return (
    <aside className="w-64 edgeqc-sidebar text-[var(--text-muted)] border-r border-[var(--border)] flex flex-col justify-between shrink-0 h-[calc(100vh-53px)] select-none">
      <div className="py-4 px-3 space-y-6 overflow-y-auto">
        {navSections.map((sec, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
              {sec.section}
            </div>
            <nav className="space-y-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[rgba(241,141,62,0.18)] text-white font-semibold shadow-sm'
                        : 'hover:bg-[rgba(241,141,62,0.1)] hover:text-white text-[var(--text-muted)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-white' : 'text-[var(--text-muted)]'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                          isActive ? 'bg-white text-[var(--surface-dark)]' : 'bg-[rgba(241,141,62,0.12)] text-[var(--accent)] border border-[rgba(241,141,62,0.16)]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-[rgba(225,217,188,0.12)] bg-[rgba(29,36,54,0.9)]">
        <div className="bg-[rgba(44,52,74,0.82)] rounded-md p-2.5 border border-[rgba(172,186,196,0.12)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase text-[var(--text-muted)]">Assigned Machine</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-[var(--accent)] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
              ONLINE
            </span>
          </div>
          <div className="text-xs font-semibold text-white">{activeJob.machine.name}</div>
          <div className="text-[11px] text-[var(--text-muted)] truncate">{activeJob.sku.name}</div>
          <div className="pt-1 border-t border-[rgba(225,217,188,0.14)] flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
            <span>Shift: {activeJob.shift.split(' ')[0]}</span>
            <span>Target: {activeJob.targetQuantity.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

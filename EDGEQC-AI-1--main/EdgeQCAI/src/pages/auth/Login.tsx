import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight } from 'lucide-react';
import { useInspection } from '../../context/InspectionContext';
import { MOCK_USERS } from '../../data/mockData';
import type { Role } from '../../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useInspection();
  const [selectedRole, setSelectedRole] = useState<Role>('operator');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS.find((u) => u.role === selectedRole) || MOCK_USERS[0];
    setCurrentUser(user);

    if (selectedRole === 'operator') {
      navigate('/operator');
    } else if (selectedRole === 'supervisor') {
      navigate('/supervisor');
    } else {
      navigate('/owner');
    }
  };

  return (
    <div className="min-h-screen bg-[rgba(34,40,58,0.95)] text-[var(--text)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[rgba(44,52,74,0.94)] rounded-3xl border border-[var(--border)] shadow-2xl shadow-[0_30px_90px_rgba(15,23,42,0.3)] overflow-hidden">
        <div className="p-6 bg-[rgba(34,40,58,0.96)] border-b border-[rgba(225,217,188,0.14)] text-center backdrop-blur-sm">
          <div className="inline-flex bg-[rgba(241,141,62,0.2)] p-3 rounded-2xl text-[var(--accent)] mb-3 shadow-inner">
            <Activity size={28} className="stroke-[2.5]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">EdgeQC</h1>
          <p className="text-xs text-[var(--text-muted)] font-medium mt-1">
            AI Quality Intelligence Copilot for Packaging & Labels
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Select User Operating Role
            </label>
            <div className="space-y-2.5">
              {MOCK_USERS.map((user) => (
                <label
                  key={user.id}
                  onClick={() => setSelectedRole(user.role)}
                  className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedRole === user.role
                      ? 'bg-[rgba(241,141,62,0.14)] border-[rgba(241,141,62,0.2)] text-white shadow-[0_10px_30px_rgba(241,141,62,0.12)]'
                      : 'bg-[rgba(34,40,58,0.82)] border-[rgba(225,217,188,0.12)] text-[var(--text)] hover:bg-[rgba(241,141,62,0.08)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="role"
                      checked={selectedRole === user.role}
                      onChange={() => setSelectedRole(user.role)}
                      className="accent-[var(--accent)]"
                    />
                    <div>
                      <div className="font-bold text-xs text-white">{user.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{user.title}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase border ${
                      user.role === 'operator'
                        ? 'bg-[rgba(241,141,62,0.14)] text-[var(--accent)] border-[rgba(241,141,62,0.22)]'
                        : user.role === 'supervisor'
                        ? 'bg-[rgba(241,141,62,0.12)] text-[var(--accent)] border-[rgba(241,141,62,0.18)]'
                        : 'bg-[rgba(241,141,62,0.12)] text-[var(--accent)] border-[rgba(241,141,62,0.18)]'
                    }`}
                  >
                    {user.role}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-slate-950 font-bold text-xs rounded-2xl shadow-[0_16px_40px_rgba(241,141,62,0.24)] flex items-center justify-center gap-2 transition-colors uppercase tracking-wider"
          >
            <span>Launch EdgeQC Workspace</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="p-3 bg-[rgba(34,40,58,0.96)] border-t border-[rgba(225,217,188,0.14)] text-center text-[10px] text-[var(--text-muted)] font-mono">
          EdgeQC Industrial Vision Copilot • Desktop-First MVP
        </div>
      </div>
    </div>
  );
};

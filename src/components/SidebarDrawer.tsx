import React from 'react';

interface SidebarDrawerProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  operatorAvatar: string;
}

export default function SidebarDrawer({ currentTab, onTabChange, operatorAvatar }: SidebarDrawerProps) {
  const menuItems = [
    { id: 'dashboard', label: 'SYSTEM', icon: 'dashboard' },
    { id: 'academy', label: 'CURRICULUM', icon: 'school' },
    { id: 'lesson', label: 'PRACTICAL LAB', icon: 'terminal' },
    { id: 'quiz', label: 'ASSESSMENTS', icon: 'analytics' },
    { id: 'transcript', label: 'TRANSCRIPTS', icon: 'description' },
    { id: 'certificates', label: 'CERTIFICATES', icon: 'workspace_premium' },
    { id: 'portfolio', label: 'PORTFOLIO', icon: 'folder_special' }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 fixed left-0 top-16 bottom-0 z-40 bg-deep-void/95 border-r border-circuit-line p-6 justify-between no-print font-sans">
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-circuit-line">
          <img src="/ndn_3d_logo.png" alt="NDN Logo" className="w-8 h-8 object-contain rounded" />
          <div>
            <p className="text-xs font-bold text-white">MSc Desmond Nkefua</p>
            <p className="text-[9px] text-neon-cyan font-mono">Academic Director</p>
          </div>
        </div>

        <nav className="space-y-1 font-mono text-xs">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer font-bold ${
                  isActive
                    ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40'
                    : 'text-on-surface-variant hover:text-white hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-circuit-line font-mono text-[9px] text-on-surface-variant space-y-1">
        <p>NDN Analytics Inc. Academy</p>
        <p>© 2026 All Rights Reserved</p>
      </div>
    </aside>
  );
}

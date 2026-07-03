import React from 'react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'System', icon: 'dashboard' },
    { id: 'academy', label: 'Academy', icon: 'school' },
    { id: 'lesson', label: 'Lab Studio', icon: 'terminal' },
    { id: 'transcript', label: 'Grades', icon: 'analytics' },
    { id: 'certificates', label: 'Certs', icon: 'workspace_premium' },
    { id: 'portfolio', label: 'Repos', icon: 'folder_special' }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-deep-void/95 backdrop-blur-md border-t border-circuit-line flex justify-around items-center px-2 py-2 no-print font-sans">
      {navItems.map((item) => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all ${
              isActive
                ? 'text-neon-cyan bg-neon-cyan/10 font-bold'
                : 'text-on-surface-variant opacity-70 hover:opacity-100'
            }`}
          >
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="font-mono text-[8px] uppercase tracking-tighter mt-0.5">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

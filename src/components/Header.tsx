import React from 'react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  operatorAvatar: string;
}

export default function Header({ currentTab, onTabChange, operatorAvatar }: HeaderProps) {
  const tabs = [
    { id: 'dashboard', label: 'SYSTEM' },
    { id: 'academy', label: 'CURRICULUM' },
    { id: 'lesson', label: 'PRACTICAL LAB' },
    { id: 'quiz', label: 'ASSESSMENTS' },
    { id: 'transcript', label: 'TRANSCRIPTS' },
    { id: 'certificates', label: 'CERTIFICATES' },
    { id: 'portfolio', label: 'PORTFOLIO' }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-deep-void/90 backdrop-blur-lg border-b border-circuit-line shadow-[0_0_15px_rgba(6,182,212,0.1)] flex justify-between items-center px-4 md:px-12 h-16 no-print font-sans">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onTabChange('dashboard')}>
        <div className="relative group/logo">
          <img
            src="/ndn_3d_logo.png"
            alt="NDN 3D Logo"
            className="w-10 h-10 object-contain rounded-lg border border-neon-cyan/60 shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover/logo:scale-110 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80';
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-success-glimmer rounded-full status-glimmer"></div>
        </div>
        <div className="flex flex-col">
          <span className="font-display text-lg md:text-xl font-black text-neon-cyan tracking-tight uppercase leading-tight">
            NDN ANALYTICS
          </span>
          <span className="font-mono text-[8px] text-on-surface-variant font-bold tracking-widest uppercase">
            ACADEMY APP
          </span>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-6">
        <nav className="flex gap-4 font-mono text-[11px] font-bold tracking-wider">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`transition-colors duration-300 uppercase py-2 cursor-pointer border-b-2 ${
                currentTab === tab.id
                  ? 'text-neon-cyan border-neon-cyan'
                  : 'text-on-surface-variant border-transparent hover:text-neon-cyan'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Student Profile Info */}
        <div className="flex items-center gap-3 border-l border-circuit-line pl-4">
          <div className="text-right font-mono">
            <p className="text-[10px] font-bold text-neon-cyan tracking-wider">MSc DESMOND NKEFUA</p>
            <p className="text-[8px] text-success-glimmer tracking-tight">[ GPA 3.96 • 300 CPD ]</p>
          </div>
          <div className="h-8 w-8 rounded-full border border-neon-cyan/40 p-0.5 overflow-hidden bg-surface-container shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <img
              className="w-full h-full object-cover rounded-full"
              src={operatorAvatar}
              alt="Student Avatar"
            />
          </div>
        </div>
      </div>

      {/* Mobile Avatar / Indicator */}
      <div className="lg:hidden flex items-center gap-2">
        <div className="text-right font-mono">
          <p className="text-[9px] font-bold text-neon-cyan">MSc D. NKEFUA</p>
          <p className="text-[8px] text-success-glimmer">GPA 3.96</p>
        </div>
        <div className="h-8 w-8 rounded-full border border-neon-cyan/40 overflow-hidden bg-surface-container">
          <img
            className="w-full h-full object-cover rounded-full"
            src={operatorAvatar}
            alt="Student Avatar"
          />
        </div>
      </div>
    </header>
  );
}

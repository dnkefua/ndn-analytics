import React from 'react';
import { recommendedTracks, systemStatusItems } from '../data';

interface AcademyDashboardProps {
  onContinue: () => void;
  onSelectTrack: (trackId: string) => void;
}

export default function AcademyDashboard({ onContinue, onSelectTrack }: AcademyDashboardProps) {
  return (
    <div className="space-y-12 font-sans">
      {/* Welcome Header Section with 3D Emblem */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-neon-cyan pl-6 mb-8 glass-card p-6 rounded-r-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] font-bold text-neon-cyan opacity-80">STATUS: AUTHORIZED STUDENT</span>
            <div className="w-2 h-2 rounded-full bg-success-glimmer status-glimmer"></div>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Welcome, MSc Desmond Nkefua
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            NDN Analytics Inc. Learning Portal. Resuming masterclass tracks for{' '}
            <span className="text-neon-cyan font-bold">AI Engineering, Firebase & GCP Cloud Systems</span>.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-neon-cyan/80 p-1 bg-surface-container-lowest shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center justify-center">
            <img src="/ndn_3d_logo.png" alt="NDN 3D Logo Emblem" className="w-full h-full object-contain rounded-xl hover:rotate-3 transition-transform" />
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Active Module (Hero Card) - Left */}
        <div className="md:col-span-8 glass-card rounded-xl overflow-hidden relative group border border-circuit-line flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-6 z-10">
            <span className="font-mono text-[9px] font-bold bg-neon-cyan text-deep-void px-3 py-1 uppercase tracking-wider">
              IN PROGRESS
            </span>
          </div>
          
          <div className="h-60 md:h-80 w-full relative overflow-hidden">
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-deep-void via-deep-void/40 to-transparent"></div>
          </div>

          <div className="p-8 -mt-20 relative z-10 bg-gradient-to-t from-deep-void via-deep-void/90 to-transparent">
            <h3 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-4">
              Full-Stack App Development with Firebase & GCP
            </h3>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
              <div className="flex-1">
                <div className="flex justify-between font-mono text-[10px] font-bold mb-2">
                  <span className="text-on-surface-variant">COMPLETION</span>
                  <span className="text-neon-cyan">80%</span>
                </div>
                <div className="h-1.5 bg-circuit-line w-full rounded-full overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-neon-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]" 
                    style={{ width: '80%' }}
                  ></div>
                </div>
              </div>
              
              <button 
                onClick={onContinue}
                className="bg-neon-cyan hover:bg-transparent hover:text-neon-cyan hover:border hover:border-neon-cyan text-deep-void px-6 py-3 font-mono text-xs font-bold tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer border border-neon-cyan uppercase"
              >
                CONTINUE LAB <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-circuit-line pt-6 font-mono text-xs">
              <div>
                <p className="text-[9px] font-bold text-on-surface-variant mb-1 tracking-wider uppercase">MODULE</p>
                <p className="text-white font-medium">02. Firestore & Cloud Functions</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-on-surface-variant mb-1 tracking-wider uppercase">CPD EARNED</p>
                <p className="text-neon-cyan font-bold">300 CPD</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-on-surface-variant mb-1 tracking-wider uppercase">STANDING</p>
                <p className="text-white font-medium">L4 Architect</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Status Feed Card - Right */}
        <div className="md:col-span-4 glass-card rounded-xl p-6 flex flex-col h-full border border-circuit-line justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-mono text-xs font-bold tracking-widest text-white uppercase">SYSTEM TELEMETRY</h3>
              <span className="material-symbols-outlined text-on-surface-variant text-base">rss_feed</span>
            </div>

            <div className="space-y-6">
              {systemStatusItems.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'success' ? 'bg-neon-cyan shadow-[0_0_6px_#06b6d4]' : 'bg-on-surface-variant opacity-40'}`}></span>
                    <p className="font-mono text-[9px] font-bold text-on-surface-variant tracking-wider">
                      {item.time} • {item.category}
                    </p>
                  </div>
                  <p className="font-mono text-xs text-on-surface group-hover:text-neon-cyan transition-colors duration-300 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="w-full h-px bg-circuit-line mt-4"></div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full border border-circuit-line py-3 font-mono text-[10px] font-bold tracking-widest uppercase mt-6 hover:bg-neon-cyan/5 hover:border-neon-cyan hover:text-neon-cyan transition-all cursor-pointer">
            VIEW TELEMETRY LOGS
          </button>
        </div>
      </div>

      {/* Recommended Tracks Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Recommended Academic Tracks
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedTracks.map((track) => (
            <div
              key={track.id}
              onClick={() => onSelectTrack(track.id)}
              className="glass-card rounded-xl p-6 group cursor-pointer hover:border-neon-cyan transition-colors border border-circuit-line flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between mb-4">
                  <span className="material-symbols-outlined text-neon-cyan text-2xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {track.icon}
                  </span>
                  <span className="font-mono text-[9px] font-bold text-on-surface-variant tracking-wider">
                    [ {track.modulesCount} MODULES ]
                  </span>
                </div>
                <h4 className="font-display text-lg font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors duration-300">
                  {track.title}
                </h4>
                <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                  {track.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-circuit-line pt-4 mt-2 font-mono">
                <span className="text-[10px] font-bold text-neon-cyan tracking-wider">
                  {track.level}
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-base group-hover:translate-x-1 transition-transform duration-300">
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

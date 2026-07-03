import React, { useState } from 'react';
import { Certificate } from '../types';

interface CertificationsViewProps {
  certificates: Certificate[];
}

export default function CertificationsView({ certificates }: CertificationsViewProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(certificates[0]);
  const [customRecipientName, setCustomRecipientName] = useState<string>('MSc Desmond Nkefua');

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12 font-mono">
      {/* Print Styles for Certificate */}
      <style>{`
        @media print {
          body { background: #ffffff !important; color: #000000 !important; }
          header, nav, footer, button, .no-print { display: none !important; }
          .cert-print-area { border: 8px solid #06b6d4 !important; background: #ffffff !important; color: #000000 !important; width: 100% !important; padding: 40px !important; margin: 0 !important; }
          .cert-print-text { color: #000000 !important; }
        }
      `}</style>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-neon-cyan pl-6 no-print">
        <div>
          <span className="text-[10px] font-bold text-neon-cyan tracking-widest uppercase mb-1 block">
            [ CERTIFICATIONS & CREDENTIALS ]
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Academic Certifications
          </h1>
          <p className="text-xs text-on-surface-variant max-w-xl mt-1">
            Industry-recognized credentials awarded by NDN Analytics Inc. Academy upon mastery of GCP Cloud Architecture, Play Store App Development, Firebase, and AI Engineering.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-success-glimmer status-glimmer"></span>
          <span className="text-xs text-neon-cyan font-bold">[ {certificates.filter(c => c.isUnlocked).length} CERTIFICATES UNLOCKED ]</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 no-print">
        {/* Certificate Cards Selector - Left */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold text-neon-cyan tracking-widest uppercase mb-2">
            EARNED CREDENTIALS
          </h3>

          {certificates.map((cert) => {
            const isSelected = selectedCert?.id === cert.id;
            return (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className={`glass-card p-5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-neon-cyan bg-neon-cyan/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'border-circuit-line bg-surface-container-low hover:border-neon-cyan/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary-container/20 border border-secondary-container flex items-center justify-center text-neon-cyan">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {cert.badgeIcon}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-white leading-tight">{cert.title}</h4>
                    <p className="text-[10px] text-neon-cyan mt-1 font-bold">{cert.cpdCredits} CPD CREDITS</p>
                    <p className="text-[9px] text-on-surface-variant mt-0.5">{cert.issueDate}</p>
                  </div>
                </div>

                <span className="material-symbols-outlined text-neon-cyan">
                  {isSelected ? 'verified' : 'chevron_right'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Recipient Name Customizer */}
        <div className="lg:col-span-8 glass-card p-6 rounded-xl border border-circuit-line bg-surface-container-low flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-circuit-line pb-4">
            <div>
              <label className="block text-[10px] text-on-surface-variant font-bold uppercase mb-1">
                Customize Certificate Recipient Name
              </label>
              <input
                type="text"
                value={customRecipientName}
                onChange={(e) => setCustomRecipientName(e.target.value)}
                className="bg-surface-container-lowest border border-neon-cyan text-neon-cyan p-2.5 text-sm outline-none rounded w-full sm:w-80 font-bold"
                placeholder="Enter Student Full Name..."
              />
            </div>

            <button
              onClick={handlePrintCertificate}
              className="px-6 py-3 bg-neon-cyan text-deep-void font-bold text-xs border border-neon-cyan hover:bg-transparent hover:text-neon-cyan transition-all flex items-center justify-center gap-2 cursor-pointer uppercase rounded-lg"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              PRINT / EXPORT CERTIFICATE
            </button>
          </div>

          {/* Dynamic Interactive Certificate Display */}
          {selectedCert && (
            <div className="cert-print-area border-2 border-neon-cyan p-8 md:p-12 rounded-xl bg-[#020d1c] relative hud-border shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden">
              {/* Decorative Corner Framing */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-neon-cyan"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-neon-cyan"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-neon-cyan"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-neon-cyan"></div>

              {/* Watermark Logo */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <img src="/ndn_3d_logo.png" alt="NDN 3D Watermark" className="w-96 h-96 object-contain" />
              </div>

              {/* Certificate Body */}
              <div className="relative z-10 text-center space-y-6">
                <div className="flex justify-center items-center gap-3">
                  <img src="/ndn_3d_logo.png" alt="NDN 3D Seal" className="w-12 h-12 object-contain rounded-xl border border-neon-cyan/80 shadow-[0_0_15px_rgba(6,182,212,0.4)]" />
                  <span className="font-display text-xl font-black tracking-widest text-neon-cyan uppercase">
                    NDN ANALYTICS INC. ACADEMY
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-on-surface-variant uppercase tracking-[0.3em]">
                    CERTIFICATE OF ACADEMIC EXCELLENCE
                  </p>
                  <h2 className="font-display text-2xl md:text-4xl font-extrabold text-white tracking-tight uppercase cert-print-text">
                    {selectedCert.title}
                  </h2>
                  <p className="text-xs text-neon-cyan font-bold">
                    [ TRACK: {selectedCert.trackName} ]
                  </p>
                </div>

                <div className="py-4 space-y-2 border-y border-circuit-line max-w-xl mx-auto">
                  <p className="text-xs text-on-surface-variant">THIS IS OFFICIALLY CONFERRED UPON</p>
                  <h3 className="font-display text-3xl md:text-4xl font-black text-neon-cyan underline decoration-neon-cyan decoration-2 underline-offset-8 cert-print-text">
                    {customRecipientName || selectedCert.recipientName}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed pt-2">
                    In recognition of successful completion of rigorous theoretical assessments, practical lab challenges, and architectural projects evaluated at NDN Analytics Inc.
                  </p>
                </div>

                {/* Certificate Footer Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left items-center">
                  <div>
                    <p className="text-[9px] text-on-surface-variant font-bold uppercase">ISSUE DATE</p>
                    <p className="text-xs font-bold text-white mt-0.5">{selectedCert.issueDate}</p>
                    <p className="text-[9px] text-neon-cyan mt-0.5">{selectedCert.cpdCredits} CPD CREDIT HOURS</p>
                  </div>

                  <div className="text-center border-x border-circuit-line px-4">
                    <p className="text-[9px] text-on-surface-variant font-bold uppercase">VERIFICATION ID</p>
                    <p className="text-xs font-mono font-bold text-neon-cyan mt-0.5">{selectedCert.verificationId}</p>
                    <p className="text-[9px] text-success-glimmer mt-0.5">AUTHENTICITY VERIFIED</p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] text-on-surface-variant font-bold uppercase">INSTRUCTOR & DIRECTOR</p>
                    <p className="text-xs font-bold text-white mt-0.5">{selectedCert.instructorName}</p>
                    <p className="text-[9px] text-neon-cyan mt-0.5">Founder, NDN Analytics Inc.</p>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

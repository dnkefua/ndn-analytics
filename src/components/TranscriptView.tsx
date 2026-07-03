import React, { useState } from 'react';
import { TranscriptRecord } from '../types';

interface TranscriptViewProps {
  transcript: TranscriptRecord;
}

export default function TranscriptView({ transcript }: TranscriptViewProps) {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredGrades = transcript.grades.filter((g) => {
    if (filterCategory === 'ALL') return true;
    return g.category === filterCategory;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12 font-mono">
      {/* Printable CSS styles */}
      <style>{`
        @media print {
          body { background: #ffffff !important; color: #000000 !important; }
          header, nav, footer, button, .no-print { display: none !important; }
          .print-container { padding: 0 !important; margin: 0 !important; width: 100% !important; background: #fff !important; color: #000 !important; }
          .print-border { border: 2px solid #000 !important; color: #000 !important; background: #fff !important; }
          .print-text-black { color: #000000 !important; }
        }
      `}</style>

      {/* Top Banner & Print Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-neon-cyan pl-6 no-print">
        <div>
          <span className="text-[10px] font-bold text-neon-cyan tracking-widest uppercase mb-1 block">
            [ ACADEMIC_RECORDS // VERIFIED ]
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Grades & Official Transcript
          </h1>
          <p className="text-xs text-on-surface-variant max-w-xl mt-1">
            Official academic record of completed courses, practical lab benchmarks, cumulative GPA, and CPD credits at NDN Analytics Inc. Academy.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-neon-cyan text-deep-void font-bold text-xs border border-neon-cyan hover:bg-transparent hover:text-neon-cyan transition-all flex items-center justify-center gap-2 cursor-pointer uppercase rounded-lg"
        >
          <span className="material-symbols-outlined text-sm">print</span>
          PRINT / EXPORT TRANSCRIPT
        </button>
      </div>

      {/* Transcript Document Outer Wrapper */}
      <div className="print-container glass-card rounded-xl border border-circuit-line p-6 md:p-10 relative overflow-hidden bg-surface-container-low">
        
        {/* Document Header Seal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-neon-cyan pb-8 mb-8 gap-6 print-border">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <img src="/ndn_3d_logo.png" alt="NDN 3D Logo" className="w-12 h-12 object-contain rounded-xl border border-neon-cyan/80 shadow-[0_0_15px_rgba(6,182,212,0.4)]" />
              <div>
                <h2 className="font-display text-2xl font-black text-white tracking-tight uppercase print-text-black">
                  NDN ANALYTICS INC. ACADEMY
                </h2>
                <p className="text-[10px] text-neon-cyan font-bold tracking-widest">
                  OFFICIAL REGISTRAR & ACADEMIC CREDENTIALS OFFICE
                </p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant max-w-md">
              Verification Portal: <a href="https://www.ndnanalytics.com/" target="_blank" rel="noreferrer" className="text-neon-cyan underline">www.ndnanalytics.com</a>
            </p>
          </div>

          {/* Verification Badge */}
          <div className="border border-neon-cyan p-4 rounded-lg bg-surface-container/80 text-right space-y-1">
            <p className="text-[9px] font-bold text-neon-cyan tracking-widest uppercase">STATUS: OFFICIALLY VERIFIED</p>
            <p className="text-xs font-bold text-white font-mono">{transcript.verificationHash}</p>
            <p className="text-[9px] text-on-surface-variant">ISSUED BY MSc Desmond Nkefua, ACADEMIC DIRECTOR</p>
          </div>
        </div>

        {/* Student Stats Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface-container p-4 border border-circuit-line rounded-lg">
            <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">Student Name</p>
            <p className="text-sm font-bold text-white mt-1">{transcript.studentName}</p>
            <p className="text-[9px] text-neon-cyan mt-0.5">ID: {transcript.studentId}</p>
          </div>

          <div className="bg-surface-container p-4 border border-circuit-line rounded-lg">
            <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">Cumulative GPA</p>
            <p className="text-2xl font-black text-neon-cyan mt-1">{transcript.gpa.toFixed(2)} <span className="text-xs text-on-surface-variant font-normal">/ 4.00</span></p>
            <p className="text-[9px] text-success-glimmer mt-0.5">[ SUMMA CUM LAUDE ]</p>
          </div>

          <div className="bg-surface-container p-4 border border-circuit-line rounded-lg">
            <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">CPD Credits Earned</p>
            <p className="text-2xl font-black text-primary mt-1">{transcript.cpdPoints} <span className="text-xs font-normal text-on-surface-variant">CPD</span></p>
            <p className="text-[9px] text-on-surface-variant mt-0.5">50 Academic Credits</p>
          </div>

          <div className="bg-surface-container p-4 border border-circuit-line rounded-lg">
            <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">Enrollment Date</p>
            <p className="text-xs font-bold text-white mt-2">{transcript.enrollmentDate}</p>
            <p className="text-[9px] text-success-glimmer mt-0.5">ACTIVE SENIOR FELLOW</p>
          </div>
        </div>

        {/* Filter Controls (No Print) */}
        <div className="flex items-center justify-between gap-4 mb-4 no-print">
          <h3 className="text-xs font-bold text-neon-cyan tracking-widest uppercase">
            COURSE_GRADE_LOG [ {filteredGrades.length} RECORDS ]
          </h3>
          <div className="flex gap-2 text-xs">
            {['ALL', 'Firebase & GCP', 'AI Engineering', 'GCP Architecture', 'Google App Store', 'BigData MLOps'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 text-[10px] font-bold border rounded cursor-pointer transition-all ${
                  filterCategory === cat
                    ? 'bg-neon-cyan text-deep-void border-neon-cyan'
                    : 'bg-surface-container text-on-surface-variant border-circuit-line hover:border-neon-cyan'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Official Grades Table */}
        <div className="overflow-x-auto border border-circuit-line rounded-lg mb-8">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container border-b border-circuit-line text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Code</th>
                <th className="p-4">Course Title & Specialty</th>
                <th className="p-4 text-center">Credits</th>
                <th className="p-4 text-center">Quiz %</th>
                <th className="p-4 text-center">Practical Lab %</th>
                <th className="p-4 text-center">Grade</th>
                <th className="p-4 text-right">Term</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-circuit-line bg-surface-container-lowest/50">
              {filteredGrades.map((grade) => (
                <tr key={grade.id} className="hover:bg-neon-cyan/5 transition-colors">
                  <td className="p-4 font-bold text-neon-cyan">{grade.courseCode}</td>
                  <td className="p-4">
                    <p className="font-bold text-white">{grade.courseTitle}</p>
                    <p className="text-[10px] text-on-surface-variant">{grade.category}</p>
                  </td>
                  <td className="p-4 text-center font-bold text-on-surface">{grade.credits}</td>
                  <td className="p-4 text-center text-on-surface">{grade.quizScore}%</td>
                  <td className="p-4 text-center text-on-surface">{grade.labScore}%</td>
                  <td className="p-4 text-center font-black">
                    <span className={`px-3 py-1 rounded text-xs inline-block ${
                      grade.finalGrade.startsWith('A')
                        ? 'bg-success-glimmer/20 text-success-glimmer border border-success-glimmer/40'
                        : 'bg-warning-amber/20 text-warning-amber border border-warning-amber/40'
                    }`}>
                      {grade.finalGrade}
                    </span>
                  </td>
                  <td className="p-4 text-right text-on-surface-variant font-bold">{grade.term}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Official Registrar Seal & Signatures Footer */}
        <div className="border-t-2 border-circuit-line pt-8 flex flex-col sm:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">OFFICIAL ACADEMIC STAMP</p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border-2 border-neon-cyan rounded-full flex items-center justify-center text-neon-cyan p-1 text-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <span className="text-[8px] font-extrabold leading-tight uppercase">NDN ANALYTICS INC. SEAL</span>
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">MSc Desmond Nkefua</p>
                <p className="text-[10px] text-neon-cyan">Academic Director & Founder</p>
                <p className="text-[9px] text-on-surface-variant">NDN Analytics Inc. (ndnanalytics.com)</p>
              </div>
            </div>
          </div>

          <div className="text-right text-[10px] text-on-surface-variant space-y-1">
            <p>Verification Code: <strong className="text-neon-cyan">NDN-2026-VAL-988</strong></p>
            <p>Cryptographic Sign: 0x8F9a...2B01 (SHA-256)</p>
            <p>© NDN Analytics Inc. All Academic Rights Reserved.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

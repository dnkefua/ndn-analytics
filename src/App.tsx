import React, { useState } from 'react';
import { coursesData, activeLessonData, transcriptData, certificatesData } from './data';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import AcademyDashboard from './components/AcademyDashboard';
import AcademyCatalog from './components/AcademyCatalog';
import LessonView from './components/LessonView';
import AssessmentEngine from './components/AssessmentEngine';
import TranscriptView from './components/TranscriptView';
import CertificationsView from './components/CertificationsView';
import ProjectPortfolio from './components/ProjectPortfolio';
import AiMentorChat from './components/AiMentorChat';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('firebase-gcp-app-dev');
  const [aiMentorOpen, setAiMentorOpen] = useState(false);
  const [badgeAwarded, setBadgeAwarded] = useState<string | null>(null);

  const operatorAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentTab('lesson');
  };

  const handleSelectTrack = (trackId: string) => {
    setCurrentTab('academy');
  };

  const handleAwardBadge = (badgeName: string) => {
    setBadgeAwarded(badgeName);
  };

  return (
    <div className="min-h-screen bg-deep-void text-on-surface flex flex-col relative circuit-bg font-sans">
      {/* Top Header Navigation */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        operatorAvatar={operatorAvatar}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-24 pb-28 md:pb-12 px-4 md:px-12 max-w-7xl mx-auto w-full transition-all duration-300">
        {currentTab === 'dashboard' && (
          <AcademyDashboard
            onContinue={() => setCurrentTab('lesson')}
            onSelectTrack={handleSelectTrack}
          />
        )}

        {currentTab === 'academy' && (
          <AcademyCatalog
            courses={coursesData}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {currentTab === 'lesson' && (
          <LessonView
            lesson={activeLessonData}
            onTakeQuiz={() => setCurrentTab('quiz')}
          />
        )}

        {currentTab === 'quiz' && (
          <AssessmentEngine
            onBackToLesson={() => setCurrentTab('lesson')}
            onAwardBadge={handleAwardBadge}
          />
        )}

        {currentTab === 'transcript' && (
          <TranscriptView transcript={transcriptData} />
        )}

        {currentTab === 'certificates' && (
          <CertificationsView certificates={certificatesData} />
        )}

        {currentTab === 'portfolio' && (
          <ProjectPortfolio />
        )}
      </main>

      {/* Badge Award Celebration Modal */}
      {badgeAwarded && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] px-4 backdrop-blur-md animate-fadeIn no-print">
          <div className="bg-surface-container border border-neon-cyan p-8 text-center max-w-sm relative hud-border shadow-[0_0_30px_#06b6d4]">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-cyan"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-cyan"></div>

            <div className="w-20 h-20 bg-secondary-container/20 border border-secondary-container rounded-full flex items-center justify-center text-neon-cyan mx-auto mb-6 shadow-[0_0_15px_rgba(96,1,209,0.5)]">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                workspace_premium
              </span>
            </div>

            <p className="font-mono text-[10px] text-neon-cyan font-bold tracking-widest uppercase mb-2">
              [ ACADEMIC BADGE UNLOCKED ]
            </p>
            <h3 className="font-display text-2xl font-bold text-white mb-4">
              {badgeAwarded.replace(/_/g, ' ')}
            </h3>
            <p className="font-mono text-xs text-on-surface-variant leading-relaxed mb-6">
              Congratulations MSc Desmond Nkefua! You have validated your practical logic score. Credentials appended to your official NDN Analytics transcript.
            </p>

            <button
              onClick={() => setBadgeAwarded(null)}
              className="w-full py-3 bg-neon-cyan text-deep-void font-bold text-xs hover:bg-transparent hover:text-neon-cyan border border-neon-cyan transition-colors cursor-pointer uppercase font-mono"
            >
              ACKNOWLEDGE & CLAIM CREDITS
            </button>
          </div>
        </div>
      )}

      {/* Floating AI Mentor Button (FAB) */}
      <div className="fixed bottom-20 md:bottom-8 right-6 md:right-8 z-[110] no-print">
        <button
          onClick={() => setAiMentorOpen(!aiMentorOpen)}
          className="flex items-center gap-2 px-4 py-3 bg-secondary-container hover:bg-secondary-container/80 text-white rounded-full border border-neon-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all font-mono text-[10px] font-bold tracking-wider cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            psychology
          </span>
          ASK_AI_MENTOR
        </button>
      </div>

      {/* AI Mentor Chat Widget */}
      <AiMentorChat isOpen={aiMentorOpen} onClose={() => setAiMentorOpen(false)} />

      {/* Mobile Bottom Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}

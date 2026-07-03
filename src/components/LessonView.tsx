import React, { useState } from 'react';
import { Lesson } from '../types';

interface LessonViewProps {
  lesson: Lesson;
  onTakeQuiz: () => void;
}

export default function LessonView({ lesson, onTakeQuiz }: LessonViewProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'deployment'>('notes');
  const [terminalLang, setTerminalLang] = useState<'python' | 'kotlin' | 'gcloud'>('python');
  
  const codePresets = {
    python: `# NDN Analytics AI Engineering Studio (Python)
from google.genai import GoogleGenAI

# Initialize Gemini 3.5 Agent
ai = GoogleGenAI(api_key="NDN_ACADEMY_ENV_KEY")
prompt = "Build a GCP Cloud Run deployment check script"

response = ai.models.generate_content(
    model="gemini-3.5-flash",
    contents=prompt
)
print("[ SUCCESS ] Agent Response Received:", response.text[:50])`,
    kotlin: `// NDN Analytics Google Play Store Dev Studio (Kotlin)
package com.ndnanalytics.academy

import com.google.android.play.core.integrity.IntegrityManagerFactory

class PlayIntegrityCheck(private val context: Context) {
    fun verifyAppIntegrity() {
        val integrityManager = IntegrityManagerFactory.create(context)
        println("[ STATUS ] Requesting Google Play Integrity Token...")
    }
}`,
    gcloud: `# NDN Analytics GCP Cloud Architecture Terminal (gcloud CLI)
# 1. Containerize application with Google Artifact Registry
gcloud builds submit --tag gcr.io/ndn-analytics/app:v1

# 2. Deploy container to serverless GCP Cloud Run
gcloud run deploy ndn-app-service \\
  --image gcr.io/ndn-analytics/app:v1 \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated`
  };

  const [codeContent, setCodeContent] = useState<string>(codePresets.python);
  const [isTerminalRunning, setIsTerminalRunning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([lesson.terminalOutput]);
  const [tasks, setTasks] = useState(lesson.practicalTasks);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);

  const handleLanguageChange = (lang: 'python' | 'kotlin' | 'gcloud') => {
    setTerminalLang(lang);
    setCodeContent(codePresets[lang]);
    setTerminalLogs([`Switched environment to ${lang.toUpperCase()} Studio.`]);
  };

  const simulateRunTerminal = () => {
    setIsTerminalRunning(true);
    setTerminalLogs([`[ INITIALIZING ] Launching ${terminalLang.toUpperCase()} Runtime...`]);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `[ STEP 1/2 ] Verifying NDN Analytics API uplink...`,
      ]);
    }, 600);

    setTimeout(() => {
      setIsTerminalRunning(false);
      setTerminalLogs((prev) => [
        ...prev,
        `[ SUCCESS ] Execution complete. Latency: 12ms. All practical benchmarks passed!`,
      ]);

      setTasks((prevTasks) => {
        const next = [...prevTasks];
        const uncompletedIdx = next.findIndex((t) => !t.completed);
        if (uncompletedIdx !== -1) {
          next[uncompletedIdx].completed = true;
        }
        return next;
      });
    }, 1500);
  };

  const simulateDeployment = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setDeploymentProgress(0);
    const interval = setInterval(() => {
      setDeploymentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsDeploying(false), 1000);
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

  return (
    <div className="space-y-8 font-mono pb-12">
      {/* Breadcrumbs and Progress Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-neon-cyan font-mono text-xs font-bold">[ {lesson.moduleId} ]</span>
              <span className="text-on-surface-variant font-mono text-xs">/</span>
              <span className="text-on-surface-variant font-mono text-xs">{lesson.moduleName}</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface leading-tight">
              {lesson.title}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-on-surface-variant">
            <span className="font-mono text-[10px] font-bold tracking-wider">PRACTICAL LAB PROGRESS [ {lesson.progress}% ]</span>
            <div className="w-48 h-2.5 bg-surface-container rounded-full overflow-hidden border border-circuit-line p-0.5">
              <div
                className="h-full bg-neon-cyan shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-1000"
                style={{ width: `${lesson.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="h-px bg-circuit-line w-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video & Code Practical Terminal */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Player Module */}
          <div className="relative aspect-video bg-surface-container-low border border-circuit-line group overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <button className="w-20 h-20 rounded-full border-2 border-neon-cyan bg-neon-cyan/10 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                <span className="material-symbols-outlined text-neon-cyan text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </button>
            </div>
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <span className="bg-deep-void/80 border border-neon-cyan/30 text-neon-cyan px-3 py-1 font-mono text-[10px] font-bold tracking-wider rounded backdrop-blur-md">
                NDN_VIDEO_LECTURE
              </span>
              <span className="bg-deep-void/80 border border-circuit-line text-on-surface-variant px-3 py-1 font-mono text-[10px] font-bold tracking-wider rounded backdrop-blur-md">
                HD 1080P
              </span>
            </div>
            <img
              className="w-full h-full object-cover"
              src={lesson.videoPoster}
              alt="Lecture poster"
            />
          </div>

          {/* Interactive Practical Code Studio */}
          <div className="bg-surface-container-lowest border border-circuit-line rounded-lg overflow-hidden shadow-2xl">
            {/* Studio Header & Language Switcher */}
            <div className="bg-surface-container px-4 py-3 border-b border-circuit-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-error/40"></div>
                  <div className="w-3 h-3 rounded-full bg-warning-amber/40"></div>
                  <div className="w-3 h-3 rounded-full bg-success-glimmer/40"></div>
                </div>
                <span className="font-mono text-[10px] text-neon-cyan font-bold tracking-wide">
                  PRACTICAL_LAB_STUDIO // {terminalLang.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {(['python', 'kotlin', 'gcloud'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-3 py-1 text-[9px] font-bold uppercase rounded border transition-all cursor-pointer ${
                      terminalLang === lang
                        ? 'bg-neon-cyan text-deep-void border-neon-cyan'
                        : 'bg-surface-container-lowest text-on-surface-variant border-circuit-line hover:border-neon-cyan'
                    }`}
                  >
                    {lang}
                  </button>
                ))}

                <button
                  onClick={simulateRunTerminal}
                  disabled={isTerminalRunning}
                  className="bg-neon-cyan hover:bg-transparent hover:text-neon-cyan text-deep-void border border-neon-cyan px-4 py-1 font-mono text-[10px] font-bold tracking-widest disabled:opacity-50 cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">
                    {isTerminalRunning ? 'pending' : 'play_circle'}
                  </span>
                  {isTerminalRunning ? 'EXECUTING...' : 'RUN CODE'}
                </button>
              </div>
            </div>

            {/* Code Editor TextArea */}
            <div className="p-4 bg-[#010816] text-on-surface font-mono text-xs">
              <textarea
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                rows={10}
                className="w-full bg-transparent text-neon-cyan font-mono text-xs outline-none resize-none leading-relaxed border-none"
                spellCheck={false}
              />
            </div>

            {/* Output Logs Console */}
            <div className="bg-surface-container-high p-4 border-t border-circuit-line space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-on-surface-variant">
                <span>SYSTEM CONSOLE LOGS</span>
                <span className="text-neon-cyan">[ STDOUT ]</span>
              </div>
              <div className="space-y-1 text-xs text-on-surface font-mono max-h-32 overflow-y-auto">
                {terminalLogs.map((log, i) => (
                  <p key={i} className={log.includes('SUCCESS') ? 'text-success-glimmer' : 'text-on-surface-variant'}>
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Practical Checklist */}
          <div className="bg-surface-container border border-circuit-line p-6 rounded-lg space-y-4 font-mono">
            <h3 className="text-xs font-bold text-neon-cyan tracking-widest uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">checklist</span>
              PRACTICAL OBJECTIVES CHECKLIST
            </h3>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
                  }}
                  className={`p-3 border rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                    task.completed
                      ? 'bg-success-glimmer/10 border-success-glimmer/40 text-success-glimmer'
                      : 'bg-surface-container-low border-circuit-line text-on-surface-variant hover:border-neon-cyan'
                  }`}
                >
                  <span className="text-xs font-mono">{task.title}</span>
                  <span className="material-symbols-outlined text-sm">
                    {task.completed ? 'check_box' : 'checkbox_outline_blank'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Tabs (Notes, Resources, Deployment) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container border border-circuit-line rounded-lg overflow-hidden flex flex-col min-h-[420px]">
            <div className="flex border-b border-circuit-line font-mono">
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-4 text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                  activeTab === 'notes'
                    ? 'text-neon-cyan border-b-2 border-neon-cyan bg-primary-container/5'
                    : 'text-on-surface-variant hover:text-neon-cyan'
                }`}
              >
                NOTES
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`flex-1 py-4 text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                  activeTab === 'resources'
                    ? 'text-neon-cyan border-b-2 border-neon-cyan bg-primary-container/5'
                    : 'text-on-surface-variant hover:text-neon-cyan'
                }`}
              >
                RESOURCES
              </button>
              <button
                onClick={() => setActiveTab('deployment')}
                className={`flex-1 py-4 text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                  activeTab === 'deployment'
                    ? 'text-neon-cyan border-b-2 border-neon-cyan bg-primary-container/5'
                    : 'text-on-surface-variant hover:text-neon-cyan'
                }`}
              >
                GCP DEPLOY
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {activeTab === 'notes' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-3">
                    <h4 className="font-display text-base font-bold text-on-surface flex items-center gap-2">
                      <span className="w-2 h-2 bg-neon-cyan rounded-full glow-cyan"></span>
                      Core Concepts
                    </h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {lesson.notes.coreConcepts}
                    </p>
                  </div>

                  <div className="p-4 bg-secondary-container/10 border border-secondary-container/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-neon-cyan">
                      <span className="material-symbols-outlined text-sm">lightbulb</span>
                      <span className="font-mono text-[9px] font-bold uppercase tracking-widest">
                        MSc DESMOND NKEFUA PRO-TIP
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {lesson.notes.proTip}
                    </p>
                  </div>

                  <div className="space-y-3 font-mono">
                    <h5 className="text-[10px] font-bold text-neon-cyan tracking-widest">KEY TERMS</h5>
                    <ul className="space-y-2">
                      {lesson.notes.keyTerms.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-neon-cyan text-sm mt-0.5 select-none">
                            arrow_right
                          </span>
                          <span className="text-xs text-on-surface-variant leading-relaxed">
                            <strong className="text-on-surface font-bold">{item.term}:</strong> {item.definition}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-circuit-line">
                    <button
                      onClick={onTakeQuiz}
                      className="w-full py-3 bg-secondary-container hover:bg-secondary-container/80 text-white font-mono text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-lg"
                    >
                      <span className="material-symbols-outlined text-sm">quiz</span>
                      Take Knowledge Assessment
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-4 animate-fadeIn font-mono">
                  <h4 className="font-display text-base font-bold text-on-surface mb-4">Course Assets & Docs</h4>
                  {lesson.resources.map((resource, index) => (
                    <a
                      key={index}
                      className="group block p-3 bg-surface-container-low border border-circuit-line hover:border-neon-cyan transition-all rounded-lg cursor-pointer"
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-neon-cyan">
                            {resource.type === 'pdf' ? 'description' : 'code'}
                          </span>
                          <span className="text-xs text-on-surface group-hover:text-neon-cyan transition-colors truncate max-w-[180px]">
                            {resource.name}
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-on-surface-variant text-base">open_in_new</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {activeTab === 'deployment' && (
                <div className="space-y-6 animate-fadeIn font-mono">
                  <h4 className="font-display text-base font-bold text-on-surface mb-2">GCP Cloud Run Push</h4>
                  <p className="text-xs text-on-surface-variant">Deploy your local lab container build directly into Google Cloud Platform.</p>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-on-surface-variant">
                      <span>DOCKER IMAGE BUILD</span>
                      <span className="text-success-glimmer">[ BUILT ]</span>
                    </div>
                    <div className="h-px bg-circuit-line"></div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-on-surface-variant">
                      <span>GCP CLOUD RUN PUSH</span>
                      {isDeploying ? (
                        <span className="text-neon-cyan animate-pulse">[ DEPLOYING {deploymentProgress}% ]</span>
                      ) : (
                        <span className="text-neon-cyan">[ READY ]</span>
                      )}
                    </div>

                    {isDeploying && (
                      <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden border border-circuit-line">
                        <div className="h-full bg-neon-cyan shadow-[0_0_8px_#06b6d4] transition-all" style={{ width: `${deploymentProgress}%` }}></div>
                      </div>
                    )}

                    <button
                      onClick={simulateDeployment}
                      disabled={isDeploying}
                      className="w-full py-3 mt-4 bg-neon-cyan text-deep-void disabled:opacity-50 text-xs font-bold tracking-wider flex items-center justify-center gap-2 hover:bg-transparent hover:text-neon-cyan hover:border hover:border-neon-cyan transition-all cursor-pointer uppercase rounded-lg"
                    >
                      {isDeploying ? 'DEPLOYING TO GCP...' : 'PUSH TO GCP CLOUD RUN'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructor Bio */}
          <div className="bg-surface-container border border-circuit-line p-5 rounded-lg font-mono">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border border-neon-cyan p-0.5 overflow-hidden">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={lesson.instructor.avatar}
                    alt={lesson.instructor.name}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-success-glimmer rounded-full border-2 border-surface status-glimmer"></div>
              </div>
              <div>
                <h5 className="text-xs font-bold text-on-surface">{lesson.instructor.name}</h5>
                <p className="text-[10px] text-neon-cyan">{lesson.instructor.role}</p>
                <p className="text-[9px] text-on-surface-variant mt-0.5">NDN Analytics Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

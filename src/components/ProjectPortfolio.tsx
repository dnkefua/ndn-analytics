import React, { useState } from 'react';
import { activeBuildsData, evalQueueData, skillNodesData } from '../data';
import { ActiveBuild, EvalQueueItem } from '../types';

export default function ProjectPortfolio() {
  const [activeBuilds, setActiveBuilds] = useState<ActiveBuild[]>(activeBuildsData);
  const [evalQueue, setEvalQueue] = useState<EvalQueueItem[]>(evalQueueData);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState('https://github.com/dnkefua/ndn-analytics.git');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  const handleSubmitRepo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !repoUrl) return;

    const newBuild: ActiveBuild = {
      id: `build-${Date.now()}`,
      title: projectTitle,
      description: projectDesc || 'Simulated build repository for GCP and Android app security compliance.',
      repoUrl,
      status: 'EVAL_RUNNING',
      progressLabel: 'GCP SECURITY AUDIT IN PROGRESS',
      progressValue: 15,
      complete: false
    };

    setActiveBuilds((prev) => [newBuild, ...prev]);

    const newQueueItem: EvalQueueItem = {
      id: `queue-${Date.now()}`,
      fileName: `${projectTitle.replace(/\s+/g, '_')}_audit.sh`,
      status: 'QUEUED'
    };
    setEvalQueue((prev) => [newQueueItem, ...prev]);

    setRepoUrl('https://github.com/dnkefua/ndn-analytics.git');
    setProjectTitle('');
    setProjectDesc('');
    setIsSubmitOpen(false);

    let progress = 15;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setActiveBuilds((prev) =>
          prev.map((b) =>
            b.id === newBuild.id
              ? { ...b, progressValue: 100, status: 'STABLE_RELEASE', progressLabel: 'AUDIT PASSED', complete: true }
              : b
          )
        );
        setEvalQueue((prev) => prev.filter((item) => item.id !== newQueueItem.id));
      } else {
        setActiveBuilds((prev) =>
          prev.map((b) => (b.id === newBuild.id ? { ...b, progressValue: progress } : b))
        );
      }
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Header Panel with Official Website & GitHub Links */}
      <div className="relative overflow-hidden p-8 rounded-xl border border-circuit-line bg-surface-container-low">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-20">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-neon-cyan rounded-full status-glimmer shadow-[0_0_8px_#06b6d4]"></span>
              <span className="font-mono text-[10px] font-bold text-neon-cyan tracking-[0.2em]">
                NDN ANALYTICS INC. // GITHUB REPOSITORY SYNC
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">Project Portfolios & Repositories</h2>
            <p className="text-on-surface-variant max-w-xl text-xs md:text-sm leading-relaxed">
              Official academic lab repositories and capstone projects created by NDN Analytics Inc. faculty & students.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono">
              <a
                href="https://www.ndnanalytics.com/"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-surface-container border border-neon-cyan text-neon-cyan font-bold text-xs hover:bg-neon-cyan hover:text-deep-void transition-all flex items-center gap-2 rounded cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">language</span>
                NDN ANALYTICS WEBSITE
              </a>

              <a
                href="https://github.com/dnkefua/ndn-analytics.git"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-surface-container border border-circuit-line text-white font-bold text-xs hover:border-neon-cyan transition-all flex items-center gap-2 rounded cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">code</span>
                GITHUB: dnkefua/ndn-analytics
              </a>
            </div>
          </div>

          <button
            onClick={() => setIsSubmitOpen(true)}
            className="px-6 py-3 bg-neon-cyan text-deep-void font-mono font-bold text-xs border border-neon-cyan hover:bg-transparent hover:text-neon-cyan transition-all flex items-center gap-2 cursor-pointer uppercase rounded-lg"
          >
            SUBMIT REPO FOR AUDIT →
          </button>
        </div>
      </div>

      {/* Modal for Repo Submission */}
      {isSubmitOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[150] px-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-low border border-neon-cyan p-6 md:p-8 w-full max-w-md relative hud-border font-mono">
            <button
              onClick={() => setIsSubmitOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-neon-cyan cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>

            <h3 className="font-display text-base font-bold text-white mb-6 uppercase tracking-wider text-neon-cyan border-b border-circuit-line pb-2">
              [ SUBMIT REPO FOR AUDIT ]
            </h3>

            <form onSubmit={handleSubmitRepo} className="space-y-4">
              <div>
                <label className="block text-[10px] text-on-surface-variant mb-1 font-bold uppercase">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GCP App Engine Microservice"
                  className="w-full bg-surface-container-lowest border border-circuit-line focus:border-neon-cyan p-3 text-sm text-neon-cyan outline-none"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] text-on-surface-variant mb-1 font-bold uppercase">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/dnkefua/ndn-analytics.git"
                  className="w-full bg-surface-container-lowest border border-circuit-line focus:border-neon-cyan p-3 text-sm text-neon-cyan outline-none"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] text-on-surface-variant mb-1 font-bold uppercase">
                  Description
                </label>
                <textarea
                  placeholder="Brief summary of architecture & GCP/Play Store constraints..."
                  className="w-full bg-surface-container-lowest border border-circuit-line focus:border-neon-cyan p-3 text-xs text-neon-cyan outline-none h-20 resize-none"
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neon-cyan text-deep-void font-bold text-xs hover:bg-transparent hover:text-neon-cyan border border-neon-cyan transition-all cursor-pointer uppercase rounded-lg"
              >
                START GCP & APP COMPLIANCE AUDIT
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="font-mono text-xs font-bold text-neon-cyan tracking-widest uppercase">
                ACTIVE_BUILDS_AND_REPOS
              </h3>
              <div className="h-[1px] w-full bg-circuit-line"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeBuilds.map((build) => {
                const isComplete = build.status === 'STABLE_RELEASE';
                return (
                  <div
                    key={build.id}
                    className="glass-card p-6 rounded-xl relative border border-circuit-line transition-all hover:border-neon-cyan/50"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-neon-cyan">
                          {isComplete ? 'cloud_done' : 'sync'}
                        </span>
                        <span
                          className={`font-mono text-[9px] px-2 py-0.5 border ${
                            isComplete
                              ? 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20'
                              : 'text-warning-amber bg-warning-amber/10 border-warning-amber/20'
                          }`}
                        >
                          {build.status}
                        </span>
                      </div>

                      <h4 className="font-display text-base font-bold text-white leading-tight">
                        {build.title}
                      </h4>

                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {build.description}
                      </p>

                      <div className="space-y-2 pt-2 font-mono">
                        <div className="flex justify-between text-[9px] opacity-60">
                          <span>{build.progressLabel}</span>
                          <span>[ {build.progressValue}% ]</span>
                        </div>
                        <div className="h-1.5 w-full bg-circuit-line rounded-full overflow-hidden p-0.5">
                          <div
                            className="h-full bg-neon-cyan transition-all duration-300"
                            style={{ width: `${build.progressValue}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="pt-2 font-mono">
                        <a
                          href={build.repoUrl || 'https://github.com/dnkefua/ndn-analytics.git'}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-bold text-neon-cyan hover:underline flex items-center gap-1"
                        >
                          <span>VIEW REPOSITORY ON GITHUB</span>
                          <span className="material-symbols-outlined text-xs">open_in_new</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Director Code Review block */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="font-mono text-xs font-bold text-neon-cyan tracking-widest uppercase">
                DIRECTOR_CODE_REVIEW
              </h3>
              <div className="h-[1px] w-full bg-circuit-line"></div>
            </div>

            <div className="p-6 border-l-2 border-neon-cyan bg-surface-container-high/50 rounded-r-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-white/10 flex items-center justify-center border border-circuit-line overflow-hidden">
                  <span className="material-symbols-outlined text-neon-cyan">account_circle</span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white tracking-wide">MSc Desmond Nkefua</h5>
                  <p className="text-[9px] opacity-50 uppercase tracking-widest font-mono">FACULTY REVIEW</p>
                </div>
              </div>
              <p className="text-xs text-on-surface italic leading-relaxed">
                "Excellent modular structure in your latest commit to `ndn-analytics`. The Cloud Run Docker image optimization reduces cold start overhead by 40%. Ensure Play Integrity token verification is cached on Redis."
              </p>
              <div className="flex gap-2 font-mono text-[9px] font-bold text-neon-cyan">
                <span className="bg-circuit-line px-2 py-1 rounded">#GCPCloudRun</span>
                <span className="bg-circuit-line px-2 py-1 rounded">#PlayStoreIntegrity</span>
                <span className="bg-circuit-line px-2 py-1 rounded">#GeminiAI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Skill Matrix */}
        <div className="lg:col-span-4 space-y-6 font-mono">
          <div className="glass-card rounded-xl p-6 border border-circuit-line space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-neon-cyan tracking-widest uppercase">ACADEMIC_SKILL_NODES</h3>
              <span className="text-[9px] opacity-60 font-bold">[ 4 NODES MASTERED ]</span>
            </div>

            <div className="relative w-full h-48 flex items-center justify-center border border-circuit-line rounded-lg bg-surface-container-lowest">
              <div className="w-12 h-12 bg-neon-cyan/20 border border-neon-cyan rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                <span className="material-symbols-outlined text-neon-cyan text-xl">school</span>
              </div>

              {skillNodesData.map((node) => (
                <div
                  key={node.id}
                  className="absolute"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <div className="p-2 bg-surface-container border border-neon-cyan/40 rounded flex items-center gap-1.5 text-[9px] font-bold text-white shadow-md">
                    <span className="material-symbols-outlined text-xs text-neon-cyan">{node.icon}</span>
                    {node.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-on-surface-variant font-bold">GCP App Architecture</span>
                  <span className="text-neon-cyan font-bold">95%</span>
                </div>
                <div className="h-1 bg-circuit-line w-full rounded-full overflow-hidden">
                  <div className="h-full bg-neon-cyan" style={{ width: '95%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-on-surface-variant font-bold">Google Play Store Publishing</span>
                  <span className="text-neon-cyan font-bold">90%</span>
                </div>
                <div className="h-1 bg-circuit-line w-full rounded-full overflow-hidden">
                  <div className="h-full bg-neon-cyan" style={{ width: '90%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-on-surface-variant font-bold">Applied AI & Gemini Agents</span>
                  <span className="text-neon-cyan font-bold">98%</span>
                </div>
                <div className="h-1 bg-circuit-line w-full rounded-full overflow-hidden">
                  <div className="h-full bg-neon-cyan" style={{ width: '98%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 border border-circuit-line space-y-4">
            <h3 className="text-xs font-bold text-neon-cyan tracking-widest uppercase">EVALUATION_QUEUE</h3>
            <div className="space-y-2">
              {evalQueue.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 bg-surface-container rounded border border-circuit-line text-xs">
                  <span>{item.fileName}</span>
                  <span className="text-[9px] text-neon-cyan font-bold">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

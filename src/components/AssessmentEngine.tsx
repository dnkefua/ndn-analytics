import React, { useState, useEffect } from 'react';
import { quizQuestions } from '../data';

interface AssessmentEngineProps {
  onBackToLesson: () => void;
  onAwardBadge: (badgeName: string) => void;
}

export default function AssessmentEngine({ onBackToLesson, onAwardBadge }: AssessmentEngineProps) {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const quiz = quizQuestions[currentQuizIndex] || quizQuestions[0];

  const [selectedOption, setSelectedOption] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState(900);
  const [isAnswerValidated, setIsAnswerValidated] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [scoreCount, setScoreCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleValidateLogic = () => {
    if (!selectedOption) return;
    setIsAnswerValidated(true);
    const correct = selectedOption === quiz.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScoreCount((prev) => prev + 150);
      onAwardBadge(quiz.potentialRewards[0]?.name || 'CERTIFIED_ENGINEER');
    }
  };

  const handleNextQuestion = () => {
    setIsAnswerValidated(false);
    setSelectedOption('');
    setIsCorrect(null);
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      setCurrentQuizIndex(0);
    }
  };

  return (
    <div className="space-y-8 pb-12 font-mono">
      {/* Navigation & Header */}
      <div className="flex justify-between items-center no-print">
        <button
          onClick={onBackToLesson}
          className="text-xs font-bold text-neon-cyan hover:text-primary flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          RETURN_TO_LAB
        </button>

        <span className="text-xs font-bold text-on-surface-variant">
          ASSESSMENT {currentQuizIndex + 1} OF {quizQuestions.length}
        </span>
      </div>

      {/* HUD Score & Timer Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress */}
        <div className="bg-surface-container-low/50 border border-circuit-line p-6 relative overflow-hidden rounded-md">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-pulse"></div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[9px] font-bold text-on-surface-variant mb-1 tracking-wider">EVALUATION_PROGRESS</p>
              <h2 className="font-display text-4xl font-extrabold text-neon-cyan">
                0{currentQuizIndex + 1}<span className="text-on-surface-variant/30">/0{quizQuestions.length}</span>
              </h2>
            </div>
            <span className="material-symbols-outlined text-neon-cyan/40 text-4xl">analytics</span>
          </div>
          <div className="mt-4 w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-neon-cyan" style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}></div>
          </div>
        </div>

        {/* Global Timer */}
        <div className="bg-surface-container-low/50 border border-circuit-line p-6 relative overflow-hidden rounded-md">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-warning-amber to-transparent animate-pulse"></div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[9px] font-bold text-on-surface-variant mb-1 tracking-wider">REMAINING_TIME</p>
              <h2 className="font-display text-4xl font-extrabold text-warning-amber">
                {formatTimer(timerSeconds)}
              </h2>
            </div>
            <span className="material-symbols-outlined text-warning-amber/40 text-4xl">timer</span>
          </div>
          <div className="mt-4 flex gap-1">
            <div className="flex-1 h-1 bg-warning-amber"></div>
            <div className="flex-1 h-1 bg-warning-amber"></div>
            <div className="flex-1 h-1 bg-warning-amber/20"></div>
          </div>
        </div>

        {/* CPD Intel Credits */}
        <div className="bg-surface-container-low/50 border border-circuit-line p-6 relative overflow-hidden rounded-md">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[9px] font-bold text-on-surface-variant mb-1 tracking-wider">ACADEMIC_CREDITS</p>
              <h2 className="font-display text-4xl font-extrabold text-primary">300 <span className="text-xs text-neon-cyan">+{scoreCount}</span></h2>
            </div>
            <span className="material-symbols-outlined text-primary/40 text-4xl">workspace_premium</span>
          </div>
          <p className="mt-4 text-[10px] text-success-glimmer font-bold">[ VERIFIED ACADEMIC STANDING ]</p>
        </div>
      </div>

      {/* Main Question & Options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-container-low border border-circuit-line p-6 md:p-10 relative hud-border rounded-lg">
            <div className="flex items-start gap-3 mb-6">
              <span className="text-[10px] font-bold text-neon-cyan border border-neon-cyan px-2 py-1 bg-neon-cyan/10">
                {quiz.category}
              </span>
              <span className="text-xs text-on-surface-variant opacity-60 mt-0.5">ID: {quiz.idCode}</span>
            </div>

            <h1 className="font-display text-xl md:text-2xl font-extrabold text-on-surface mb-8 leading-relaxed">
              {quiz.question}
            </h1>

            <div className="space-y-4">
              {quiz.options.map((option) => {
                const isSelected = selectedOption === option.key;
                return (
                  <button
                    key={option.key}
                    onClick={() => {
                      if (!isAnswerValidated) setSelectedOption(option.key);
                    }}
                    disabled={isAnswerValidated}
                    className="w-full text-left cursor-pointer transition-all"
                  >
                    <div
                      className={`border p-5 flex items-center gap-4 rounded-lg relative transition-all ${
                        isSelected
                          ? 'bg-primary-container/10 border-neon-cyan shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                          : 'bg-surface-container/50 border-circuit-line hover:border-neon-cyan/60'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded border flex items-center justify-center text-sm font-bold ${
                          isSelected
                            ? 'bg-neon-cyan text-deep-void border-neon-cyan'
                            : 'border-circuit-line text-on-surface-variant'
                        }`}
                      >
                        {option.key}
                      </div>
                      <span className={`text-xs md:text-sm ${isSelected ? 'text-white font-bold' : 'text-on-surface-variant'}`}>
                        {option.text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {isAnswerValidated && (
              <div className={`mt-6 p-4 border rounded-md text-xs space-y-2 ${
                isCorrect 
                  ? 'bg-success-glimmer/10 border-success-glimmer text-success-glimmer' 
                  : 'bg-error/10 border-error text-error'
              }`}>
                <p className="flex items-center gap-2 font-bold">
                  <span className="material-symbols-outlined text-sm">{isCorrect ? 'verified' : 'error'}</span>
                  {isCorrect ? 'CORRECT LOGIC VERIFIED! [+150 INTEL CREDITS AWARDED]' : 'INCORRECT ANSWER SELECTED'}
                </p>
                <p className="text-on-surface-variant leading-relaxed text-[11px]">
                  <strong>Explanation:</strong> {quiz.explanation}
                </p>
              </div>
            )}

            <div className="mt-8 flex justify-between items-center border-t border-circuit-line pt-6">
              <button
                onClick={handleNextQuestion}
                className="text-[10px] font-bold text-on-surface-variant hover:text-neon-cyan flex items-center gap-2 cursor-pointer uppercase"
              >
                SKIP QUESTION →
              </button>

              {isAnswerValidated ? (
                <button
                  onClick={handleNextQuestion}
                  className="bg-neon-cyan text-deep-void text-[10px] font-bold tracking-widest px-6 py-3 border border-neon-cyan cursor-pointer uppercase hover:bg-transparent hover:text-neon-cyan transition-all rounded-lg"
                >
                  NEXT QUESTION →
                </button>
              ) : (
                <button
                  onClick={handleValidateLogic}
                  disabled={!selectedOption}
                  className="bg-neon-cyan text-deep-void text-[10px] font-bold tracking-widest px-8 py-3 border border-neon-cyan disabled:opacity-50 cursor-pointer uppercase hover:bg-transparent hover:text-neon-cyan transition-all rounded-lg"
                >
                  SUBMIT ANSWER
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Rewards & Docs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-high border border-circuit-line p-6 rounded-lg space-y-4">
            <p className="text-[10px] font-bold text-neon-cyan border-b border-circuit-line pb-2 tracking-widest uppercase">
              POTENTIAL_ACADEMIC_REWARDS
            </p>
            <div className="space-y-3">
              {quiz.potentialRewards.map((reward, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-surface-container p-3 border border-circuit-line rounded">
                  <div className="w-10 h-10 bg-secondary-container/20 border border-secondary-container flex items-center justify-center text-neon-cyan rounded">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {reward.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">{reward.name}</p>
                    <p className="text-[10px] text-on-surface-variant">{reward.badge}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low border border-circuit-line p-6 rounded-lg space-y-3">
            <p className="text-[10px] font-bold text-on-surface-variant border-b border-circuit-line pb-2 tracking-widest uppercase">
              RECOMMENDED_READING
            </p>
            <ul className="space-y-2 text-xs">
              {quiz.technicalResources.map((doc, idx) => (
                <li key={idx}>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neon-cyan hover:underline flex items-center justify-between"
                  >
                    <span>{doc.title}</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

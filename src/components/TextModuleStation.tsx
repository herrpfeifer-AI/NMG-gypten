import React, { useState, useEffect } from 'react';
import { 
  Puzzle, 
  HelpCircle, 
  Check, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Plus, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  Lock, 
  AlertCircle,
  Shuffle
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { CLOZE_STORIES, TEXT_QUESTIONS } from '../data/learningData';
import { sounds } from '../utils/soundEffects';

export const TextModuleStation: React.FC = () => {
  const { 
    student, 
    setClozeAnswer, 
    resetClozeAnswers, 
    markClozeCompleted, 
    setTextAnswer, 
    markTextCompleted, 
    setCurrentStation,
    teacherSettings,
    allThreeClozesSolved,
    solvedStoriesCount,
    lockedNotice,
    dismissLockedNotice
  } = useProgress();

  const [activeTab, setActiveTab] = useState<'cloze' | 'questions'>('cloze');
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(0);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(1);
  const [showQuestionSolution, setShowQuestionSolution] = useState<{ [qId: number]: boolean }>({});
  const [showClozeValidation, setShowClozeValidation] = useState<boolean>(false);
  const [shuffleSeeds, setShuffleSeeds] = useState<{ [storyId: string]: number }>({});

  const currentStory = CLOZE_STORIES[selectedStoryIndex];
  const currentQuestion = TEXT_QUESTIONS.find(q => q.id === selectedQuestionId) || TEXT_QUESTIONS[0];

  // Helper to deterministically shuffle an array with a seed or re-order
  const getScrambledWords = (words: string[], seed: number) => {
    const copy = [...words];
    // Simple deterministic pseudo-shuffle based on seed
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.abs(Math.sin(seed + i * 997)) * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const currentSeed = shuffleSeeds[currentStory.id] || 42;
  const currentDisplayWords = getScrambledWords(currentStory.availableWords, currentSeed);

  const handleReshuffleWords = () => {
    sounds.playPop();
    setShuffleSeeds(prev => ({
      ...prev,
      [currentStory.id]: (prev[currentStory.id] || 42) + Math.floor(Math.random() * 100) + 1
    }));
  };

  // Check how many gaps in current story are correctly answered
  const gapsKeys = Object.keys(currentStory.gaps);
  const correctCount = gapsKeys.filter(
    k => student.clozeAnswers[`${currentStory.id}_${k}`] === currentStory.gaps[k]
  ).length;
  const isCurrentStorySolved = correctCount === gapsKeys.length;

  const handleInsertWord = (gapKey: string, word: string) => {
    setClozeAnswer(`${currentStory.id}_${gapKey}`, word);
  };

  const handleAddBlockToQuestion = (block: string) => {
    sounds.playPop();
    const current = student.textAnswers[currentQuestion.id] || '';
    const newText = current ? `${current.trim()} ${block}` : block;
    setTextAnswer(currentQuestion.id, newText);
  };

  const handleValidateCloze = () => {
    setShowClozeValidation(true);
    if (isCurrentStorySolved) {
      sounds.playCorrect();
      const willAllBeSolved = CLOZE_STORIES.every(s => {
        if (s.id === currentStory.id) return true;
        const keys = Object.keys(s.gaps);
        return keys.every(k => student.clozeAnswers[`${s.id}_${k}`] === s.gaps[k]);
      });
      if (willAllBeSolved) {
        markClozeCompleted();
      }
    } else {
      sounds.playPop();
    }
  };

  const handleCompleteStation = () => {
    if (!allThreeClozesSolved) {
      sounds.playPop();
      const firstUnsolvedIdx = CLOZE_STORIES.findIndex(s => {
        const keys = Object.keys(s.gaps);
        return !keys.every(k => student.clozeAnswers[`${s.id}_${k}`] === s.gaps[k]);
      });
      if (firstUnsolvedIdx !== -1) {
        setSelectedStoryIndex(firstUnsolvedIdx);
        setActiveTab('cloze');
      }
      return;
    }
    markTextCompleted();
    setCurrentStation('quiz');
  };

  const toggleSolution = (qId: number) => {
    setShowQuestionSolution(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Render template with interactive gaps
  const renderClozeTemplate = () => {
    const parts = currentStory.textTemplate.split(/(\{[^}]+\})/g);
    return (
      <div className="leading-loose text-base sm:text-lg text-slate-200">
        {parts.map((part, idx) => {
          if (part.startsWith('{') && part.endsWith('}')) {
            const gapKey = part.replace('{', '').replace('}', '');
            const currentAnswer = student.clozeAnswers[`${currentStory.id}_${gapKey}`];
            const isCorrect = currentAnswer === currentStory.gaps[gapKey];
            const isFilled = Boolean(currentAnswer);

            return (
              <span key={idx} className="inline-block mx-1.5 my-1 align-middle">
                {currentAnswer ? (
                  <span
                    onClick={() => handleInsertWord(gapKey, '')}
                    className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-sm border shadow-sm transition-all ${
                      showClozeValidation
                        ? isCorrect
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                          : 'bg-rose-950/80 border-rose-500 text-rose-300 ring-2 ring-rose-500/30'
                        : 'bg-amber-500/20 border-amber-400 text-amber-200 hover:bg-amber-500/30'
                    }`}
                    title="Klicken zum Entfernen"
                  >
                    <span>{currentAnswer}</span>
                    <span className="text-xs opacity-60">×</span>
                  </span>
                ) : (
                  <span className="inline-block border-2 border-dashed border-amber-500/50 bg-slate-950/60 rounded-xl px-4 py-1 text-xs text-amber-400 font-medium">
                    [Baustein hier einfügen]
                  </span>
                )}
              </span>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </div>
    );
  };

  // Determine which words are still unused in the current story
  const usedWords = gapsKeys.map(k => student.clozeAnswers[`${currentStory.id}_${k}`]).filter(Boolean);
  const nextEmptyGap = gapsKeys.find(k => !student.clozeAnswers[`${currentStory.id}_${k}`]);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-1.5">
              <Puzzle className="w-3.5 h-3.5 text-emerald-400" />
              Station 2: Schriftliches Arbeiten mit Textbausteinen
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-amber-200">
              Die Papyrus-Schreibwerkstatt
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Schreiber waren im alten Ägypten hoch angesehen! Löse die Aufgaben, indem du vorgefertigte Textbausteine zu vollständigen Sätzen kombinierst oder eigene Worte ergänzt.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('cloze')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'cloze'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Puzzle className="w-4 h-4" />
              <span>1. Lückentext-Baukasten</span>
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'questions'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>2. Die 8 Verständnisfragen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gatekeeping Notice if user tried to skip */}
      {lockedNotice && (
        <div className="bg-rose-950/90 border-2 border-rose-500 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3 text-rose-200 animate-pulse">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="text-xs sm:text-sm font-bold">
              Station 3 (Quiz) ist gesperrt: Löse zuerst alle 3 Textbausteine-Aufgaben (Rätsel 1, 2 und 3) vollständig und korrekt! ({solvedStoriesCount} von 3 gelöst)
            </div>
          </div>
          <button
            onClick={dismissLockedNotice}
            className="text-xs font-bold bg-rose-900 hover:bg-rose-800 text-rose-200 px-3 py-1.5 rounded-xl border border-rose-700 shrink-0"
          >
            Verstanden
          </button>
        </div>
      )}

      {/* TAB 1: CLOZE TEXTBAUSTEINE */}
      {activeTab === 'cloze' && (
        <div className="space-y-6">
          {/* Story Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CLOZE_STORIES.map((story, idx) => {
              const isSelected = selectedStoryIndex === idx;
              const storyGaps = Object.keys(story.gaps);
              const doneCount = storyGaps.filter(
                k => student.clozeAnswers[`${story.id}_${k}`] === story.gaps[k]
              ).length;
              const isDone = doneCount === storyGaps.length;

              return (
                <button
                  key={story.id}
                  onClick={() => {
                    setSelectedStoryIndex(idx);
                    setShowClozeValidation(false);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-300">{story.title}</span>
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Korrekt
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {doneCount}/{storyGaps.length} Bausteine
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{story.intro}</p>
                </button>
              );
            })}
          </div>

          {/* Main Cloze Interactive Box */}
          <div className="bg-slate-900 border border-amber-500/20 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-amber-200">
                  {currentStory.title}
                </h3>
                <p className="text-xs text-slate-400">{currentStory.intro}</p>
              </div>
              <span className="text-xs font-mono bg-amber-500/10 text-amber-300 px-3 py-1 rounded-full border border-amber-500/20">
                {correctCount} von {gapsKeys.length} Bausteinen richtig
              </span>
            </div>

            {/* Rendered Cloze Sentence */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-inner">
              {renderClozeTemplate()}
            </div>

            {/* Textbausteine Bank */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  Gemischte Textbausteine (Klicke auf ein Wort, um es in die nächste Lücke einzusetzen):
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReshuffleWords}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20"
                    title="Reihenfolge der Textbausteine zufällig neu mischen"
                  >
                    <Shuffle className="w-3 h-3" />
                    Bausteine neu mischen
                  </button>
                  <button
                    onClick={() => {
                      resetClozeAnswers();
                      setShowClozeValidation(false);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Lücken leeren
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                {currentDisplayWords.map((word) => {
                  const isUsed = usedWords.includes(word);
                  return (
                    <button
                      key={word}
                      disabled={isUsed}
                      onClick={() => {
                        if (nextEmptyGap) {
                          handleInsertWord(nextEmptyGap, word);
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 ${
                        isUsed
                          ? 'bg-slate-800/50 text-slate-500 border border-slate-800 cursor-not-allowed line-through'
                          : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 hover:scale-105 active:scale-95'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{word}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleValidateCloze}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Antworten prüfen</span>
                </button>

                {(teacherSettings.allowStudentSolutionView || isCurrentStorySolved) && (
                  <button
                    onClick={() => {
                      gapsKeys.forEach(k => {
                        handleInsertWord(k, currentStory.gaps[k]);
                      });
                      setShowClozeValidation(true);
                      sounds.playCorrect();
                    }}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs rounded-xl border border-amber-500/20"
                  >
                    Musterlösung einsetzen
                  </button>
                )}
              </div>

              {/* Direct Next Button when current story is solved */}
              {isCurrentStorySolved && (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Rätsel {selectedStoryIndex + 1} korrekt gelöst!</span>
                  </div>

                  {selectedStoryIndex < CLOZE_STORIES.length - 1 ? (
                    <button
                      onClick={() => {
                        setSelectedStoryIndex(prev => prev + 1);
                        setShowClozeValidation(false);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1 hover:scale-105 transition-all"
                    >
                      <span>Zu Rätsel {selectedStoryIndex + 2}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : allThreeClozesSolved ? (
                    <button
                      onClick={handleCompleteStation}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1 hover:scale-105 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Alle 3 gelöst! Weiter zum Quiz</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: THE 8 QUESTIONS WITH TEXTBAUSTEINE HELPER */}
      {activeTab === 'questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Question List (Left) */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="font-display font-bold text-sm text-amber-200 px-1 mb-2">
              Die 8 Beobachtungsfragen:
            </h3>
            <div className="space-y-1.5">
              {TEXT_QUESTIONS.map((q) => {
                const isSelected = selectedQuestionId === q.id;
                const hasAnswer = Boolean(student.textAnswers[q.id]?.trim());

                return (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQuestionId(q.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected 
                        ? 'bg-amber-400 text-slate-950' 
                        : hasAnswer 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {q.id}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 truncate">
                          {q.title}
                        </span>
                        {hasAnswer && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {q.question}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Editor & Textbausteine Palette (Right) */}
          <div className="lg:col-span-8 bg-slate-900 border border-amber-500/20 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {currentQuestion.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Frage {currentQuestion.id} von 8
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 mt-1">
                {currentQuestion.question}
              </h3>
              <div className="mt-2 p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
                <span><strong>Woozles Tipp:</strong> {currentQuestion.tip}</span>
              </div>
            </div>

            {/* Clickable Textbausteine Palette */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Puzzle className="w-3.5 h-3.5 text-amber-400" />
                  Textbausteine-Helfer (Klicke zum Einfügen in deine Antwort):
                </span>
                <span className="text-[11px] text-slate-400">Kombiniere die Bausteine!</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentQuestion.suggestedBlocks.map((block, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddBlockToQuestion(block)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 hover:border-amber-400 transition-all shadow-sm flex items-center gap-1.5 group"
                  >
                    <Plus className="w-3 h-3 text-amber-400 group-hover:text-slate-950" />
                    <span>{block}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Student's Custom Answer Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-200">
                  Deine schriftliche Antwort:
                </label>
                <span className="text-[11px] text-slate-400">
                  Du kannst Textbausteine einfügen und deine eigenen Sätze formulieren.
                </span>
              </div>
              <textarea
                value={student.textAnswers[currentQuestion.id] || ''}
                onChange={(e) => setTextAnswer(currentQuestion.id, e.target.value)}
                placeholder="Formuliere hier deine Antwort mit den Textbausteinen..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 shadow-inner"
              />
            </div>

            {/* Model Solution Reveal Toggle */}
            <div className="border-t border-slate-800 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleSolution(currentQuestion.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-2 border border-slate-700"
                >
                  {showQuestionSolution[currentQuestion.id] ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Musterlösung verbergen</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Musterlösung vergleichen</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  {selectedQuestionId < 8 && (
                    <button
                      onClick={() => setSelectedQuestionId(prev => prev + 1)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                    >
                      <span>Nächste Frage</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {showQuestionSolution[currentQuestion.id] && (
                <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Offizielle Musterlösung:</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    {currentQuestion.sampleSolution}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Station Final Completion Banner with Gatekeeper */}
      <div className={`border rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
        allThreeClozesSolved
          ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border-emerald-500/40'
          : 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-rose-950/30 border-amber-500/30'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
            allThreeClozesSolved
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
          }`}>
            {allThreeClozesSolved ? <Award className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className={`font-display font-bold text-base ${
                allThreeClozesSolved ? 'text-emerald-200' : 'text-amber-200'
              }`}>
                {allThreeClozesSolved
                  ? 'Alle 3 Textbaustein-Rätsel gemeistert!'
                  : 'Voraussetzung für Station 3 (Quiz):'}
              </h4>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                allThreeClozesSolved
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {solvedStoriesCount} von 3 Rätseln gelöst
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {allThreeClozesSolved
                ? 'Klasse! Alle 3 Textbausteine-Aufgaben sind korrekt befüllt. Du kannst nun direkt zum Quiz weiterziehen!'
                : 'Du darfst erst zu Station 3 (Quiz) weiter, wenn du alle 3 Textbausteine-Aufgaben (Rätsel 1, 2 und 3) korrekt gelöst hast.'}
            </p>
          </div>
        </div>

        {allThreeClozesSolved ? (
          <button
            onClick={handleCompleteStation}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <span>Fertig! Weiter zu Station 3 (Quiz)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              const firstUnsolvedIdx = CLOZE_STORIES.findIndex(s => {
                const keys = Object.keys(s.gaps);
                return !keys.every(k => student.clozeAnswers[`${s.id}_${k}`] === s.gaps[k]);
              });
              if (firstUnsolvedIdx !== -1) {
                setSelectedStoryIndex(firstUnsolvedIdx);
                setActiveTab('cloze');
              }
            }}
            className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            title="Zu ungelöstem Rätsel springen"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Erst alle 3 Rätsel lösen ({solvedStoriesCount}/3)</span>
          </button>
        )}
      </div>


    </div>
  );
};

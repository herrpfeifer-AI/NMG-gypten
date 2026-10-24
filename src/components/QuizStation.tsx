import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ChevronRight, 
  RotateCcw, 
  Trophy, 
  Star,
  Lock,
  Unlock,
  KeyRound,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  FastForward,
  Key,
  X,
  AlertCircle
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { QUIZ_QUESTIONS } from '../data/learningData';

export const QuizStation: React.FC = () => {
  const { 
    student, 
    setQuizOptionAttempt, 
    unlockQuizWithRamsesCode, 
    skipQuizStationWithPassword,
    submitQuiz, 
    setCurrentStation,
    isTeacherMode 
  } = useProgress();

  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);
  const [showSummary, setShowSummary] = useState<boolean>(student.quizCompleted);
  const [ramsesInput, setRamsesInput] = useState<string>('');
  const [ramsesError, setRamsesError] = useState<boolean>(false);
  const [ramsesSuccess, setRamsesSuccess] = useState<boolean>(false);

  // Password skip modal state
  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);
  const [skipPassword, setSkipPassword] = useState('');
  const [skipError, setSkipError] = useState<string | null>(null);

  const handleSkipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = skipQuizStationWithPassword(skipPassword);
    if (res.success) {
      setIsSkipModalOpen(false);
      setSkipPassword('');
      setSkipError(null);
    } else {
      setSkipError(res.error || 'Falsches Passwort!');
    }
  };

  const currentQ = QUIZ_QUESTIONS[activeQuestionIdx];
  const finalAnswer = student.quizAnswers[currentQ.id];
  const firstWrongAnswer = student.quizFirstWrongAnswers?.[currentQ.id];
  const currentAttempts = student.quizAttempts[currentQ.id] || 0;

  // Has question reached a completed state? (either correct on attempt 1, or attempt 2 completed)
  const isQuestionFinished = Boolean(finalAnswer);
  const isCorrect = finalAnswer === currentQ.correctAnswer;
  // Is it currently in the "Hint" state (wrong pick on 1st attempt, waiting for 2nd attempt)?
  const isWaitingForSecondAttempt = currentAttempts === 1 && Boolean(firstWrongAnswer) && !finalAnswer;

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    // If already finished, don't allow changing
    if (isQuestionFinished) return;
    // Don't allow clicking the same wrong answer that was picked in attempt 1
    if (isWaitingForSecondAttempt && key === firstWrongAnswer) return;

    setQuizOptionAttempt(currentQ.id, key);
  };

  const handleFinishQuiz = () => {
    submitQuiz();
    setShowSummary(true);
  };

  const handleCheckRamsesCode = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockQuizWithRamsesCode(ramsesInput);
    if (success) {
      setRamsesSuccess(true);
      setRamsesError(false);
    } else {
      setRamsesError(true);
    }
  };

  // Check how many questions are answered/finished
  const finishedQuestionsCount = QUIZ_QUESTIONS.filter(q => Boolean(student.quizAnswers[q.id])).length;
  const allQuestionsFinished = finishedQuestionsCount === QUIZ_QUESTIONS.length;
  const totalErrors = student.quizErrorsCount || 0;
  const needsRamsesCode = totalErrors >= 3 && !student.quizRamsesUnlocked;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 mb-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              Station 3: Die große Sphinx-Prüfung
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-amber-200">
              Das große Ägypten-Quiz
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Beantworte die 6 Fragen! Wenn deine 1. Antwort nicht stimmt, hilft dir ein <strong>Tipp</strong> für deinen 2. Versuch. Bei weniger als 3 Fehlern geht es direkt weiter zu Station 4!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-300">
              Frage {activeQuestionIdx + 1} von {QUIZ_QUESTIONS.length}
            </span>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
              totalErrors >= 3 
                ? 'bg-rose-950/60 text-rose-300 border-rose-500/50' 
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              Fehler: {totalErrors} {totalErrors >= 3 ? '(Mündliche Prüfung nötig)' : ''}
            </span>
            {student.quizCompleted && (
              <button
                onClick={() => setShowSummary(true)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              >
                Ergebnis ansehen
              </button>
            )}

            {/* Skip button with teacher password */}
            <button
              type="button"
              onClick={() => {
                setIsSkipModalOpen(true);
                setSkipPassword('');
                setSkipError(null);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 transition-all hover:scale-102 shadow-sm"
              title="Quiz mit Passwort der Lehrperson überspringen (z.B. wenn bereits gelöst)"
            >
              <FastForward className="w-3.5 h-3.5 text-amber-400" />
              <span>Quiz überspringen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Quiz Flow or Summary */}
      {!showSummary ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Question Navigator */}
          <div className="lg:col-span-3 space-y-2">
            <h3 className="font-display font-bold text-xs text-amber-200 px-1 mb-2">
              Fragen-Übersicht:
            </h3>
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
              {QUIZ_QUESTIONS.map((q, idx) => {
                const ans = student.quizAnswers[q.id];
                const isActive = activeQuestionIdx === idx;
                const isItemCorrect = ans === q.correctAnswer;
                const isHintMode = student.quizAttempts[q.id] === 1 && Boolean(student.quizFirstWrongAnswers?.[q.id]) && !ans;

                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionIdx(idx)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                        : isHintMode
                        ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                        : ans
                        ? isItemCorrect
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xs font-bold">Frage {idx + 1}</span>
                    {isHintMode ? (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">Tipp</span>
                    ) : ans ? (
                      isItemCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      )
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Card */}
          <div className="lg:col-span-9 bg-slate-900 border border-amber-500/20 rounded-3xl p-6 shadow-2xl space-y-6">
            
            {/* Question Text */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400">
                  Frage {activeQuestionIdx + 1} von {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {isQuestionFinished 
                    ? (isCorrect ? '✓ Gelöst' : 'Ausgewertet')
                    : isWaitingForSecondAttempt 
                    ? '2. Versuch aktiv' 
                    : '1. Versuch'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                {currentQ.question}
              </h3>
            </div>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentQ.options.map((opt) => {
                const isFirstWrongPick = firstWrongAnswer === opt.key;
                const isFinalSelected = finalAnswer === opt.key;
                const isRightAnswer = opt.key === currentQ.correctAnswer;

                let cardStyle = 'bg-slate-950/70 border-slate-800 hover:border-amber-400/60 hover:bg-slate-850 text-slate-200 cursor-pointer';

                if (isWaitingForSecondAttempt) {
                  if (isFirstWrongPick) {
                    cardStyle = 'bg-rose-950/40 border-rose-500/40 text-rose-300 opacity-60 cursor-not-allowed line-through';
                  } else {
                    cardStyle = 'bg-slate-950/70 border-amber-500/40 hover:border-amber-400 hover:bg-amber-950/20 text-slate-100 cursor-pointer';
                  }
                } else if (isQuestionFinished) {
                  if (isFinalSelected) {
                    cardStyle = isRightAnswer 
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40' 
                      : 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/40';
                  } else if (isRightAnswer) {
                    cardStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300';
                  } else {
                    cardStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-50 cursor-default';
                  }
                }

                return (
                  <button
                    key={opt.key}
                    disabled={isQuestionFinished || (isWaitingForSecondAttempt && isFirstWrongPick)}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 shadow-md ${cardStyle}`}
                  >
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isQuestionFinished && isFinalSelected && isRightAnswer
                        ? 'bg-emerald-400 text-slate-950'
                        : isQuestionFinished && isFinalSelected && !isRightAnswer
                        ? 'bg-rose-400 text-slate-950'
                        : isFirstWrongPick
                        ? 'bg-rose-950 text-rose-400 border border-rose-600'
                        : 'bg-slate-800 text-amber-300'
                    }`}>
                      {opt.key}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-snug flex-1 pt-0.5">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* STAGE 1 FEEDBACK: HINT ON 1ST WRONG ATTEMPT (Solution NOT revealed yet!) */}
            {isWaitingForSecondAttempt && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border-2 border-amber-500/50 text-amber-200 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-300">
                  <Lightbulb className="w-4 h-4 text-yellow-400 animate-pulse shrink-0" />
                  <span>Nicht ganz richtig! Du hast noch einen 2. Versuch!</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-6">
                  {currentQ.hint}
                </p>
                <div className="text-[11px] text-amber-400/90 pl-6 font-semibold">
                  👉 Wähle oben eine andere Antwort aus.
                </div>
              </div>
            )}

            {/* STAGE 2 FEEDBACK: FINAL RESULT & EXPLANATION REVEALED */}
            {isQuestionFinished && (
              <div className={`p-4 rounded-2xl border space-y-2 animate-fadeIn ${
                isCorrect 
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{currentAttempts === 1 ? 'Richtig beim 1. Versuch! Großartig kombiniert!' : 'Richtig im 2. Versuch gelöst! Sehr gut nachgedacht!'}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Auch im 2. Versuch leider nicht richtig! Richtige Lösung: Option {currentQ.correctAnswer}</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  <span><strong>Woozle-Wissen:</strong> {currentQ.woozleFact}</span>
                </div>
              </div>
            )}

            {/* Quiz Navigation Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <button
                disabled={activeQuestionIdx === 0}
                onClick={() => setActiveQuestionIdx(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Zurück
              </button>

              {activeQuestionIdx < QUIZ_QUESTIONS.length - 1 ? (
                <button
                  onClick={() => setActiveQuestionIdx(prev => prev + 1)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md flex items-center gap-1.5"
                >
                  <span>Nächste Frage</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  disabled={!allQuestionsFinished}
                  onClick={handleFinishQuiz}
                  className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg transition-all ${
                    allQuestionsFinished
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Quiz abschließen & Auswerten!</span>
                </button>
              )}
            </div>

          </div>
        </div>
      ) : (
        /* Summary Score View & Ramses Code Gate */
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-w-2xl mx-auto">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 p-1 shadow-xl flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-amber-300">
              Quiz-Ergebnis: {student.quizScore} von {QUIZ_QUESTIONS.length} Punkten!
            </h3>
            <p className="text-sm text-slate-300">
              Insgesamt gemachte Fehler: <strong className={totalErrors >= 3 ? 'text-rose-400' : 'text-emerald-400'}>{totalErrors}</strong>
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((star) => {
              const active = star <= Math.ceil((student.quizScore / 6) * 3);
              return (
                <Star
                  key={star}
                  className={`w-8 h-8 ${active ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
                />
              );
            })}
          </div>

          {/* Teacher Pairing Instruction Banner */}
          <div className="bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20 border-2 border-amber-400/60 rounded-2xl p-5 text-left space-y-2 shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shrink-0 shadow">
                👥
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  Wichtige Anweisung für die 5. Klassen
                </span>
                <h4 className="font-display font-bold text-base text-amber-200">
                  Gehe jetzt zur Lehrperson!
                </h4>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
              Glückwunsch, du hast das Wissens-Quiz beendet! Gehe jetzt nach vorne zur <strong>Lehrperson</strong>. Die Lehrperson teilt dich direkt mit einer Mitschülerin oder einem Mitschüler in eine <strong>2er-Gruppe</strong> ein!
            </p>
          </div>

          {/* RAMSES GATEKEEPER IF 3 OR MORE ERRORS */}
          {needsRamsesCode ? (
            <div className="bg-rose-950/60 border-2 border-rose-500/60 rounded-3xl p-5 sm:p-6 space-y-4 text-left shadow-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/40">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-rose-200">
                    Mündliche Erklärung bei der Lehrperson erforderlich!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                    Du hattest <strong>{totalErrors} Fehler</strong> im Quiz. Gehe jetzt bitte zu deiner <strong>Lehrperson</strong> und erkläre ihr die Fragen nochmals mündlich. Von der Lehrkraft erhältst du danach den Freischalt-Code für Aufgabe 4!
                  </p>
                </div>
              </div>

              <form onSubmit={handleCheckRamsesCode} className="space-y-3 pt-2 border-t border-rose-800/40">
                <label className="block text-xs font-bold text-rose-300">
                  Lehrkraft-Code eingeben:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="w-4 h-4 text-rose-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={ramsesInput}
                      onChange={(e) => {
                        setRamsesInput(e.target.value);
                        setRamsesError(false);
                      }}
                      placeholder="Code der Lehrperson..."
                      className="w-full bg-slate-950 border border-rose-700/60 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all shrink-0"
                  >
                    Code prüfen
                  </button>
                </div>

                {ramsesError && (
                  <p className="text-xs text-rose-400 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Falscher Code! Bitte gehe zur Lehrkraft und lass dir den Code geben.
                  </p>
                )}
              </form>
            </div>
          ) : student.quizRamsesUnlocked ? (
            <div className="bg-emerald-950/50 border border-emerald-500/50 rounded-2xl p-4 flex items-center gap-3 text-emerald-300 text-xs sm:text-sm font-bold">
              <Unlock className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Lehrer-Code „Ramses“ erfolgreich eingelöst! Station 4 ist freigeschaltet!</span>
            </div>
          ) : null}

          {/* Question Breakdown List */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-left space-y-2">
            <div className="text-xs font-bold text-amber-300 mb-2">Alle Antworten im Überblick:</div>
            {QUIZ_QUESTIONS.map((q) => {
              const studentChoice = student.quizAnswers[q.id];
              const isCorrectQ = studentChoice === q.correctAnswer;
              const attemptsQ = student.quizAttempts[q.id] || 1;

              return (
                <div key={q.id} className="text-xs flex items-center justify-between border-b border-slate-800/60 pb-1.5">
                  <span className="text-slate-300 truncate max-w-xs sm:max-w-md">
                    {q.id}. {q.question}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-slate-400">Wahl: {studentChoice || '-'}</span>
                    {isCorrectQ ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        {attemptsQ === 1 ? '1. Versuch ✓' : '2. Versuch ✓'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                        Richtig: {q.correctAnswer}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setShowSummary(false);
                setActiveQuestionIdx(0);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Fragen nochmal ansehen</span>
            </button>

            {/* Continue to Station 4 button - blocked if needs Ramses */}
            {needsRamsesCode ? (
              <button
                disabled
                className="px-6 py-2.5 bg-slate-800 text-slate-500 font-bold rounded-xl border border-slate-700 text-xs sm:text-sm flex items-center gap-2 cursor-not-allowed"
                title="Erst bei der Lehrperson vorsprechen und den Code eingeben!"
              >
                <Lock className="w-4 h-4 text-rose-400" />
                <span>Station 4 gesperrt (Erst Code eingeben)</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentStation('gruppenarbeit')}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 text-xs sm:text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Weiter zu Station 4: Gruppenarbeit</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Password Skip Modal */}
      {isSkipModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsSkipModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-amber-200">
                  Quiz überspringen
                </h3>
                <p className="text-xs text-slate-400">Station 3: Wissens-Quiz</p>
              </div>
            </div>

            {/* Teacher note requirement */}
            <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-3.5 text-xs text-amber-200/90 mb-4 leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Wichtiger Hinweis:</strong> Das Überspringen geht nur, wenn du der Lehrperson mitteilst, dass du das Quiz bereits gelöst hast (z.B. auf Papier oder in OneNote). Die Lehrperson gibt dir dann das Lösungswort.
              </div>
            </div>

            <form onSubmit={handleSkipSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Passwort der Lehrperson eingeben:
                </label>
                <input
                  type="text"
                  value={skipPassword}
                  onChange={(e) => {
                    setSkipPassword(e.target.value);
                    setSkipError(null);
                  }}
                  placeholder="Passwort eingeben..."
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono tracking-wider"
                />
                {skipError && (
                  <p className="text-xs text-rose-400 font-semibold mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{skipError}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsSkipModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={!skipPassword.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold rounded-xl text-xs shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Freischalten & zu Station 4 springen ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

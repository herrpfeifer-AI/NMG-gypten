import React from 'react';
import { Video, Scroll, HelpCircle, Users, Award, Check, Lock } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { StationId } from '../types';

export const ProgressBar: React.FC = () => {
  const { 
    currentStation, 
    setCurrentStation, 
    student, 
    totalProgressPercent, 
    allThreeClozesSolved, 
    isTeacherMode,
    needsRamsesCode,
    needsCheopsCode
  } = useProgress();

  const steps: { id: StationId; label: string; icon: React.ComponentType<{ className?: string }>; completed: boolean }[] = [
    { id: 'video', label: '1. Video schauen', icon: Video, completed: student.videoWatched },
    { id: 'textbausteine', label: '2. Textbausteine', icon: Scroll, completed: allThreeClozesSolved },
    { id: 'quiz', label: '3. Wissens-Quiz', icon: HelpCircle, completed: student.quizCompleted && !needsRamsesCode },
    { id: 'gruppenarbeit', label: '4. Gruppenwerkstatt', icon: Users, completed: student.groupCompleted && !needsCheopsCode },
    { id: 'belohnungen', label: '5. Grabkammer & Urkunde', icon: Award, completed: student.submittedToTeacher || student.badges.length >= 4 },
  ];

  return (
    <div className="bg-slate-900/60 border border-amber-500/20 rounded-2xl p-3 sm:p-4 mb-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-sm font-display font-bold">Deine Expeditions-Route</span>
          <span className="text-xs text-slate-400">| Folge den Stationen entlang des Nils</span>
        </div>
        <div className="text-xs font-semibold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          Gesamtfortschritt: <span className="font-bold text-amber-200">{totalProgressPercent}%</span>
        </div>
      </div>

      {/* Progress Line */}
      <div className="relative">
        <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1.5 bg-slate-800 rounded-full z-0">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500 shadow-sm shadow-amber-500/50"
            style={{ width: `${totalProgressPercent}%` }}
          />
        </div>

        {/* Step Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCurrent = currentStation === step.id;

            // Step locking rules
            let isLocked = false;
            let lockReason = '';
            if (!isTeacherMode) {
              if (step.id === 'quiz' && !allThreeClozesSolved) {
                isLocked = true;
                lockReason = 'Erst alle 3 Textbaustein-Rätsel lösen!';
              } else if (step.id === 'gruppenarbeit') {
                if (!allThreeClozesSolved) {
                  isLocked = true;
                  lockReason = 'Erst alle 3 Textbaustein-Rätsel lösen!';
                } else if (!student.quizCompleted) {
                  isLocked = true;
                  lockReason = 'Erst das Quiz beenden!';
                } else if (needsRamsesCode) {
                  isLocked = true;
                  lockReason = 'Mündliche Erklärung bei Lehrkraft nötig (Code Ramses)!';
                }
              } else if (step.id === 'belohnungen') {
                if (!allThreeClozesSolved) {
                  isLocked = true;
                  lockReason = 'Erst alle 3 Textbausteine in Station 2 lösen!';
                } else if (needsRamsesCode) {
                  isLocked = true;
                  lockReason = 'Code Ramses bei der Lehrperson holen!';
                } else if (needsCheopsCode) {
                  isLocked = true;
                  lockReason = 'Erst das 4er-Theater vorspielen und Freischaltcode bei der Lehrperson abholen!';
                }
              }
            }

            return (
              <button
                key={step.id}
                onClick={() => setCurrentStation(step.id)}
                title={isLocked ? lockReason : step.label}
                className={`flex flex-row sm:flex-col items-center gap-2 p-2 sm:p-2.5 rounded-xl text-left sm:text-center transition-all ${
                  isCurrent
                    ? 'bg-amber-500/20 border-2 border-amber-400 shadow-lg shadow-amber-500/10 scale-[1.02]'
                    : isLocked
                    ? 'bg-slate-900/40 border border-slate-800 text-slate-500 opacity-70'
                    : step.completed
                    ? 'bg-slate-800/80 border border-emerald-500/40 hover:bg-slate-800'
                    : 'bg-slate-800/40 border border-slate-700/60 hover:bg-slate-800/80'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                    step.completed
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                      : isCurrent
                      ? 'bg-amber-400 text-slate-950 font-bold animate-pulse'
                      : isLocked
                      ? 'bg-slate-800 text-slate-500'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {step.completed ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-amber-500/70" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-slate-200 truncate leading-tight">
                    {step.label}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {step.completed ? 'Abgeschlossen' : isCurrent ? 'Jetzt bearbeiten' : isLocked ? 'Gesperrt' : `Schritt ${index + 1}`}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};


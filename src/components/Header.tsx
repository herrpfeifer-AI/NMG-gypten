import React, { useState } from 'react';
import { 
  Sparkles, 
  Video, 
  FileText, 
  HelpCircle, 
  Users, 
  Trophy, 
  GraduationCap, 
  Key, 
  User, 
  CheckCircle2,
  BookOpen,
  Edit2,
  Lock,
  Compass,
  RotateCcw
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { StationId } from '../types';

interface HeaderProps {
  onOpenSolutions: () => void;
  onOpenOverview?: () => void;
  onOpenNameSelect?: () => void;
  onResetApp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenSolutions, 
  onOpenOverview,
  onOpenNameSelect,
  onResetApp
}) => {
  const { 
    student, 
    currentStation, 
    setCurrentStation, 
    isTeacherMode, 
    setIsTeacherMode, 
    setStudentName,
    teacherSettings,
    totalProgressPercent,
    allThreeClozesSolved,
    needsRamsesCode,
    needsCheopsCode
  } = useProgress();

  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [tempName, setTempName] = useState(student.name);
  const [tempClass, setTempClass] = useState(student.schoolClass);

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const navItems: { id: StationId; label: string; icon: React.ComponentType<{ className?: string }>; completed: boolean }[] = [
    { id: 'video', label: '1. Video', icon: Video, completed: student.videoWatched },
    { id: 'textbausteine', label: '2. Textbausteine', icon: FileText, completed: student.textCompleted },
    { id: 'quiz', label: '3. Quiz', icon: HelpCircle, completed: student.quizCompleted },
    { id: 'gruppenarbeit', label: '4. Gruppenarbeit', icon: Users, completed: student.groupCompleted },
    { id: 'belohnungen', label: '5. Belohnungen', icon: Trophy, completed: student.badges.length >= 4 },
  ];

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setStudentName(tempName.trim(), tempClass.trim());
      setIsNameModalOpen(false);
    }
  };

  const handleTeacherAccess = (e: React.FormEvent) => {
    e.preventDefault();
    // Teacher PIN: 4051 (PLZ Erlenmatt)
    if (enteredPin.trim() === '4051') {
      setIsTeacherMode(true);
      setIsPinModalOpen(false);
      setEnteredPin('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-amber-500/20 shadow-lg">
        {/* Top Gold Border Accent */}
        <div className="h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 w-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            
            {/* Logo & Student Welcome */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-yellow-700 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-amber-400 font-display font-bold text-xl">
                    𓀀
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display font-extrabold text-base sm:text-lg tracking-wider text-amber-300 uppercase drop-shadow">
                      Expedition Altes Ägypten
                    </h1>
                    <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                      Woozle Goozle
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5">
                    <span>Forscher:in:</span>
                    <button 
                      onClick={() => {
                        if (onOpenNameSelect) {
                          onOpenNameSelect();
                        } else {
                          setTempName(student.name);
                          setTempClass(student.schoolClass);
                          setIsNameModalOpen(true);
                        }
                      }}
                      className="font-semibold text-amber-400 hover:text-amber-200 underline decoration-dotted flex items-center gap-1 group"
                      title="Name aus der Klassenliste wählen oder ändern"
                    >
                      {student.name} ({student.schoolClass})
                      <Edit2 className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                    </button>
                  </p>
                </div>
              </div>

              {/* Mobile Teacher Toggle */}
              <div className="flex md:hidden items-center gap-2">
                {onOpenNameSelect && (
                  <button
                    onClick={onOpenNameSelect}
                    className="p-2 rounded-lg text-xs font-semibold bg-slate-800 text-amber-300 border border-slate-700"
                    title="Namen wählen"
                  >
                    <User className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsTeacherMode(!isTeacherMode)}
                  className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    isTeacherMode 
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' 
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions & Teacher Switcher (Desktop) */}
            <div className="flex items-center justify-end gap-2 sm:gap-3">
              {/* Reset App Button */}
              {onResetApp && (
                <button
                  onClick={() => {
                    if (window.confirm('Möchtest du die App wirklich zurücksetzen und die Lerneinheit von ganz vorne starten?')) {
                      onResetApp();
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 flex items-center gap-1.5 shadow-sm transition-all"
                  title="App zurücksetzen und von vorne starten"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Neustart</span>
                </button>
              )}

              {/* Overview Button */}
              {onOpenOverview && (
                <button
                  onClick={onOpenOverview}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm transition-all"
                  title="Ablauf der 5 Stationen im Überblick anzeigen"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Stations-Überblick</span>
                  <span className="sm:hidden">Überblick</span>
                </button>
              )}

              {/* Solution Handbook Button */}
              {(teacherSettings.allowStudentSolutionView || isTeacherMode || student.quizCompleted) && (
                <button
                  onClick={onOpenSolutions}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm transition-all"
                  title="Musterlösungen & Erklärungen einsehen"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Lösungsheft</span>
                  <span className="sm:hidden">Lösungen</span>
                </button>
              )}

              {/* Teacher Mode Button */}
              <button
                onClick={() => {
                  if (isTeacherMode) {
                    setIsTeacherMode(false);
                  } else {
                    setIsPinModalOpen(true);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isTeacherMode
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>{isTeacherMode ? 'Lehrer-Modus Aktiv' : 'Lehrer-Pult'}</span>
              </button>

              {/* Progress Summary Pill */}
              <div 
                onClick={() => setCurrentStation('belohnungen')}
                className="cursor-pointer px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-center gap-2 hover:bg-amber-950/60 transition-colors"
                title="Klicke für deine Belohnungen"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                <span className="text-xs font-bold">{totalProgressPercent}%</span>
                <span className="text-[11px] text-amber-400/80 hidden lg:inline">Fortschritt</span>
              </div>
            </div>

          </div>

          {/* Navigation Stations */}
          <nav className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentStation === item.id;
              
              let isLocked = false;
              let lockReason = '';
              if (!isTeacherMode && !item.completed) {
                if (item.id === 'quiz' && !allThreeClozesSolved) {
                  isLocked = true;
                  lockReason = 'Erst alle 3 Textbausteine in Station 2 lösen!';
                } else if (item.id === 'gruppenarbeit') {
                  if (!allThreeClozesSolved) {
                    isLocked = true;
                    lockReason = 'Erst alle 3 Textbausteine in Station 2 lösen!';
                  } else if (needsRamsesCode) {
                    isLocked = true;
                    lockReason = 'Code Ramses bei der Lehrperson holen!';
                  }
                } else if (item.id === 'belohnungen') {
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
                  key={item.id}
                  onClick={() => setCurrentStation(item.id)}
                  title={isLocked ? lockReason : item.label}
                  className={`flex-1 min-w-[100px] sm:min-w-0 py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 relative ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/25 scale-[1.02]'
                      : isLocked
                      ? 'bg-slate-900/40 text-slate-500 border border-slate-800/80 hover:bg-slate-850'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : isLocked ? 'text-slate-500' : 'text-amber-400'}`} />
                  <span className="truncate">{item.label}</span>
                  {item.completed ? (
                    <CheckCircle2 className={`w-3 h-3 ml-0.5 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                  ) : isLocked ? (
                    <Lock className="w-3 h-3 ml-0.5 text-amber-500/70" />
                  ) : null}
                </button>
              );
            })}

          </nav>
        </div>
      </header>

      {/* Edit Student Name Modal */}
      {isNameModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-amber-300">Forscher-Pass</h3>
                <p className="text-xs text-slate-400">Trage deinen Namen und deine Klasse ein.</p>
              </div>
            </div>

            <form onSubmit={handleSaveName} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Dein Name / Forschername:</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="z.B. Alex Müller"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deine Schulklasse:</label>
                <input
                  type="text"
                  value={tempClass}
                  onChange={(e) => setTempClass(e.target.value)}
                  placeholder="z.B. Klasse 5b (Herr Pfeifer & Frau Escher)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNameModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-md transition-colors"
                >
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher PIN Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-amber-300">Lehrer-Zugang</h3>
                <p className="text-xs text-slate-400">Klassen-Übersicht & Musterlösungen</p>
              </div>
            </div>

            <form onSubmit={handleTeacherAccess} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Lehrer-PIN eingeben: <span className="text-amber-400 font-mono">(Tipp: PLZ Erlenmatt)</span>
                </label>
                <input
                  type="password"
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="PIN eingeben..."
                  className={`w-full bg-slate-800 border rounded-xl px-3.5 py-2.5 text-center tracking-widest text-lg text-white focus:outline-none ${
                    pinError ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700 focus:border-amber-400'
                  }`}
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-red-400 mt-1">Falsche PIN. (Tipp: PLZ Erlenmatt)</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPinModalOpen(false);
                    setPinError(false);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-md"
                >
                  Öffnen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

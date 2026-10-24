import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Plus, 
  RotateCcw, 
  Eye, 
  Printer, 
  Sparkles, 
  HelpCircle, 
  Scroll, 
  Video, 
  Trophy,
  ArrowRight,
  ExternalLink,
  Key,
  FastForward
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { TEXT_QUESTIONS, QUIZ_QUESTIONS } from '../data/learningData';
import { StudentProgress } from '../types';

export const TeacherDashboard: React.FC = () => {
  const { 
    studentsList, 
    switchActiveStudent, 
    addNewStudent, 
    resetCurrentStudent, 
    resetEntireApp,
    resetStudentProgressById,
    teacherSettings, 
    updateTeacherSettings,
    setIsTeacherMode 
  } = useProgress();

  const [activeTab, setActiveTab] = useState<'progress' | 'groups' | 'solutions' | 'settings'>('progress');
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<'all' | '5a' | '5b'>('all');
  const [inspectingStudent, setInspectingStudent] = useState<StudentProgress | null>(null);

  // New student modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState(teacherSettings.classGroup || 'Klasse 5a');

  // Filter students
  const filteredStudents = studentsList.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.schoolClass.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (classFilter === '5a') return s.schoolClass.includes('5a');
    if (classFilter === '5b') return s.schoolClass.includes('5b');
    return true;
  });

  // Compute classroom stats
  const totalStudents = studentsList.length;
  const videoDoneCount = studentsList.filter(s => s.videoWatched).length;
  const textDoneCount = studentsList.filter(s => s.textCompleted).length;
  const quizDoneCount = studentsList.filter(s => s.quizCompleted).length;
  const submittedCount = studentsList.filter(s => s.submittedToTeacher).length;
  const noBookletCount = studentsList.filter(s => !s.usedSolutionBooklet).length;
  const avgQuizScore = totalStudents > 0 
    ? (studentsList.reduce((acc, curr) => acc + (curr.quizScore || 0), 0) / totalStudents).toFixed(1)
    : '0';

  // Extract all formed 2er-groups without duplicate mirrors
  interface GroupTeamEntry {
    id: string;
    partner1: string;
    partner2: string;
    taskChoice?: StudentProgress['groupTaskChoice'];
    completed: boolean;
    notes: StudentProgress['groupNotes'];
    lastUpdated: string;
    presentationPartnerGroup?: { partner1: string; partner2: string };
    cheopsUnlocked?: boolean;
    submitted?: boolean;
  }

  const formedTeams: GroupTeamEntry[] = [];
  const pairedStudentNames = new Set<string>();

  studentsList.forEach(s => {
    if (s.groupPartner1 && s.groupPartner2) {
      const p1 = s.groupPartner1;
      const p2 = s.groupPartner2;
      const key = [p1, p2].sort().join('___');

      pairedStudentNames.add(p1);
      pairedStudentNames.add(p2);

      if (!formedTeams.some(t => t.id === key)) {
        formedTeams.push({
          id: key,
          partner1: p1,
          partner2: p2,
          taskChoice: s.groupTaskChoice,
          completed: s.groupCompleted,
          notes: s.groupNotes || {},
          lastUpdated: s.lastUpdated,
          presentationPartnerGroup: s.assignedPresentationGroup,
          cheopsUnlocked: Boolean(s.groupCheopsUnlocked),
          submitted: Boolean(s.submittedToTeacher)
        });
      }
    }
  });

  const unpairedStudents = studentsList.filter(s => !pairedStudentNames.has(s.name));

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim()) {
      addNewStudent(newStudentName.trim(), newStudentClass.trim());
      setNewStudentName('');
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 rounded-3xl p-6 text-slate-950 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900/80">
              NMG 5. Klassen (Klasse 5a & 5b)
            </div>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-950">
              Klassen-Cockpit: Altes Ägypten
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'progress'
                ? 'bg-slate-950 text-amber-300 shadow-md'
                : 'bg-amber-700/40 text-slate-950 hover:bg-amber-700/60'
            }`}
          >
            Fortschritt ({totalStudents})
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'groups'
                ? 'bg-slate-950 text-purple-300 shadow-md'
                : 'bg-amber-700/40 text-slate-950 hover:bg-amber-700/60'
            }`}
          >
            👥 2er-Gruppen ({formedTeams.length})
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'solutions'
                ? 'bg-slate-950 text-amber-300 shadow-md'
                : 'bg-amber-700/40 text-slate-950 hover:bg-amber-700/60'
            }`}
          >
            Musterlösungen
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-slate-950 text-amber-300 shadow-md'
                : 'bg-amber-700/40 text-slate-950 hover:bg-amber-700/60'
            }`}
          >
            Optionen & Codes
          </button>
          <button
            onClick={() => setIsTeacherMode(false)}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow ml-1"
          >
            Schüler-Ansicht
          </button>
        </div>
      </div>

      {/* Quick Teacher Cheat-Sheet Bar (immer sichtbar) */}
      <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-slate-800 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Lehrer-Codes & Überspring-Passwörter
            </h3>
          </div>
          <span className="text-[11px] text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-xl">
            💡 <strong>Pädagogische Regel:</strong> Überspring-Passwörter nur herausgeben, wenn Schüler:in mitteilt, dass die Station bereits gelöst wurde!
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 font-bold uppercase block">Station 2 überspringen:</span>
            <span className="font-mono font-black text-amber-300 text-base">Gize</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Textbausteine</span>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 font-bold uppercase block">Station 3 überspringen:</span>
            <span className="font-mono font-black text-amber-300 text-base">Sphinx</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Wissens-Quiz</span>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-cyan-400 font-bold uppercase block">Station 4 freischalten:</span>
            <span className="font-mono font-black text-cyan-300 text-base">Ramses</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Mündlich bei 3+ Fehlern</span>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-purple-400 font-bold uppercase block">Station 5 Urkunde:</span>
            <span className="font-mono font-black text-purple-300 text-base">Cheops</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Nach Theater-Präsentation</span>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">Lehrer-Pult PIN:</span>
            <span className="font-mono font-black text-emerald-300 text-base">4051</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">PLZ Erlenmatt</span>
          </div>
        </div>
      </div>

      {/* TAB 1: PROGRESS TRACKER */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-4 shadow-md">
              <span className="text-xs text-slate-400 block">Klassenstärke</span>
              <span className="text-2xl font-display font-extrabold text-amber-300">{totalStudents}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Schüler:innen angelegt</span>
            </div>
            <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-4 shadow-md">
              <span className="text-xs text-slate-400 block">Ergebnisse Abgegeben</span>
              <span className="text-2xl font-display font-extrabold text-emerald-400">{submittedCount} / {totalStudents}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{totalStudents > 0 ? Math.round((submittedCount / totalStudents) * 100) : 0}% der Klasse</span>
            </div>
            <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-4 shadow-md">
              <span className="text-xs text-slate-400 block">Ohne Lösungsheft</span>
              <span className="text-2xl font-display font-extrabold text-cyan-400">{noBookletCount} / {totalStudents}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">⭐ Selbstständig gemeistert</span>
            </div>
            <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-4 shadow-md">
              <span className="text-xs text-slate-400 block">Ø Quiz-Punktzahl</span>
              <span className="text-2xl font-display font-extrabold text-purple-400">{avgQuizScore} / 6</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{quizDoneCount} haben Quiz fertig</span>
            </div>
          </div>

          {/* Table Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Schüler suchen..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setClassFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    classFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Alle ({studentsList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setClassFilter('5a')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    classFilter === '5a'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  5a ({studentsList.filter(s => s.schoolClass.includes('5a')).length})
                </button>
                <button
                  type="button"
                  onClick={() => setClassFilter('5b')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    classFilter === '5b'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-amber-300'
                  }`}
                >
                  5b ({studentsList.filter(s => s.schoolClass.includes('5b')).length})
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Schüler hinzufügen</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Drucken</span>
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Name / Klasse</th>
                    <th className="py-3 px-3 text-center">Video</th>
                    <th className="py-3 px-3 text-center">Textbausteine</th>
                    <th className="py-3 px-3 text-center">Quiz</th>
                    <th className="py-3 px-3 text-center">2er-Team</th>
                    <th className="py-3 px-3 text-center">Lösungsheft</th>
                    <th className="py-3 px-3 text-center">Abgabe</th>
                    <th className="py-3 px-3 text-center">Schätze</th>
                    <th className="py-3 px-4 text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredStudents.map((stud) => {
                    const answeredTextCount = Object.keys(stud.textAnswers).length;
                    return (
                      <tr key={stud.id} className="hover:bg-slate-850/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-100">{stud.name}</div>
                          <div className="text-[11px] text-slate-400">{stud.schoolClass} • {stud.lastUpdated}</div>
                        </td>

                        <td className="py-3 px-3 text-center">
                          {stud.videoWatched ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">
                              <CheckCircle2 className="w-3 h-3" /> Gesehen
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Offen</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center">
                          {stud.textCompleted ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px]">
                              <CheckCircle2 className="w-3 h-3" /> Gelöst ({answeredTextCount})
                            </span>
                          ) : (
                            <span className="text-amber-400/80 text-[11px]">{answeredTextCount} / 8 Fragen</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center">
                          {stud.quizCompleted ? (
                            <div className="inline-flex flex-col items-center">
                              <span className="font-bold font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[11px]">
                                {stud.quizScore} / 6 Pkt.
                              </span>
                              {stud.quizRamsesUnlocked ? (
                                <span className="text-[9px] text-amber-300 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 mt-1">
                                  🔑 Code Ramses
                                </span>
                              ) : (stud.quizErrorsCount || 0) >= 3 ? (
                                <span className="text-[9px] text-rose-300 font-bold bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-500/30 mt-1">
                                  ⚠️ Mündl. Prüfung
                                </span>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Ausstehend</span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center">
                          {stud.groupPartner1 && stud.groupPartner2 ? (
                            <div className="inline-flex flex-col items-center">
                              <span className="inline-flex items-center gap-1 text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold border border-purple-500/30">
                                <Users className="w-3 h-3 text-purple-400" />
                                {stud.groupPartner1 === stud.name ? stud.groupPartner2 : stud.groupPartner1}
                              </span>
                              <span className="text-[10px] text-slate-400 mt-0.5">
                                {stud.groupTaskChoice === 'erfindungen' 
                                  ? '1. Erfindungen' 
                                  : stud.groupTaskChoice === 'puzzle' 
                                  ? '2. Pyramiden' 
                                  : stud.groupTaskChoice === 'kreativ' 
                                  ? '3. Kreativ' 
                                  : 'Aufgabe wählen'}
                              </span>
                              {stud.groupCompleted && (
                                <span className="text-[9px] text-emerald-400 font-bold">✓ Fertig</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-500 text-[11px]">- (Kein 2er-Team)</span>
                          )}
                        </td>

                        {/* Lösungsheft Status */}
                        <td className="py-3 px-3 text-center">
                          {stud.usedSolutionBooklet ? (
                            <span className="inline-flex items-center gap-1 text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full text-[10px] border border-amber-500/20 font-semibold" title="Hat das Lösungsheft zur Kontrolle verwendet">
                              📖 Benutzt
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full text-[10px] border border-emerald-500/30 font-bold" title="Hat ohne Lösungsheft gearbeitet">
                              ⭐ Ohne Hilfe
                            </span>
                          )}
                        </td>

                        {/* Abgabe Status */}
                        <td className="py-3 px-3 text-center">
                          {stud.submittedToTeacher ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Abgegeben ({stud.submittedAt || 'Ja'})
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">
                              ⏳ Offen
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-amber-400 text-xs">
                            {stud.badges.length} / 5
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setInspectingStudent(stud)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700"
                              title="Arbeit einsehen"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Möchtest du den Fortschritt von ${stud.name} wirklich komplett zurücksetzen?`)) {
                                  resetStudentProgressById(stud.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30"
                              title={`${stud.name} zurücksetzen`}
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                switchActiveStudent(stud.id);
                                setIsTeacherMode(false);
                              }}
                              className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold"
                              title="Als dieser Schüler einloggen"
                            >
                              Öffnen
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* TAB 2: 2ER-GRUPPEN ÜBERSICHT */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Station 4 Kooperation</span>
                <h3 className="font-display font-bold text-lg text-amber-200">
                  Übersicht aller 2er-Gruppen ({formedTeams.length} Teams gebildet)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hier sehen Sie genau, welche Kinder sich zu einem 2er-Team zusammengeschlossen haben und für welche der 3 Aufgaben sie sich entschieden haben.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Gruppenliste drucken</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 block">Gebildete 2er-Teams:</span>
                <span className="text-xl font-bold font-display text-purple-300">
                  {formedTeams.length} Teams ({pairedStudentNames.size} Kinder)
                </span>
              </div>
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 block">Kinder ohne 2er-Team:</span>
                <span className="text-xl font-bold font-display text-amber-400">
                  {unpairedStudents.length} Schüler:innen
                </span>
              </div>
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 block">Aufgaben-Verteilung:</span>
                <span className="text-xs text-slate-300 block mt-1">
                  💡 {formedTeams.filter(t => t.taskChoice === 'erfindungen').length} Erfindungen • 📐 {formedTeams.filter(t => t.taskChoice === 'puzzle').length} Pyramiden • ✍️ {formedTeams.filter(t => t.taskChoice === 'kreativ').length} Kreativ
                </span>
              </div>
            </div>

            {/* Formed Teams Cards */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Aktive 2er-Teams:
              </h4>

              {formedTeams.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
                  Noch keine 2er-Teams eingetragen. Sobald Schüler:innen Station 4 öffnen und sich eintragen, erscheinen sie hier.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formedTeams.map((team, idx) => {
                    const taskName = 
                      team.taskChoice === 'erfindungen' ? '1. Erfindungen-Check (Think-Pair-Share)' :
                      team.taskChoice === 'puzzle' ? '2. Pyramiden-Puzzle (Experten-Tandem)' :
                      team.taskChoice === 'kreativ' ? '3. Kreativ-Werkstatt (Tagebuch / Zeitkapsel)' :
                      'Noch keine Aufgabe gewählt';

                    return (
                      <div key={team.id} className="bg-slate-950/70 border border-purple-500/30 rounded-2xl p-4 space-y-3 shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-sm text-amber-200">
                              {team.partner1} & {team.partner2}
                            </span>
                          </div>
                          {team.completed ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" /> Fertig
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                              In Bearbeitung
                            </span>
                          )}
                        </div>

                        <div className="text-xs space-y-1 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                          <div className="text-slate-400 font-semibold">
                            Gewählte Aufgabe: <strong className="text-slate-200">{taskName}</strong>
                          </div>

                          {team.taskChoice === 'erfindungen' && (
                            <div className="text-[11px] text-slate-300 mt-1">
                              <div>Ausgewählte Erfindungen: {team.notes.erfindungenSelected?.join(', ') || 'Noch keine'}</div>
                              {team.notes.erfindungenFavorite && (
                                <div className="text-amber-300">Favorit: {team.notes.erfindungenFavorite}</div>
                              )}
                            </div>
                          )}

                          {team.taskChoice === 'puzzle' && (
                            <div className="text-[11px] text-slate-300 mt-1">
                              <div>Experten-Aufteilung: {team.partner1} (Baustelle/Transport) & {team.partner2} (Grabkammer)</div>
                              {team.notes.puzzleRoleNotes && (
                                <div className="text-amber-300 italic">"{team.notes.puzzleRoleNotes}"</div>
                              )}
                            </div>
                          )}

                          {team.taskChoice === 'kreativ' && (
                            <div className="text-[11px] text-slate-300 mt-1">
                              <div>Modus: {team.notes.kreativType || 'tagebuch'}</div>
                              {team.notes.kreativText && (
                                <div className="text-amber-300 italic line-clamp-2">"{team.notes.kreativText}"</div>
                              )}
                              {team.notes.zeitkapselItems && team.notes.zeitkapselItems.length > 0 && (
                                <div>Zeitkapsel: {team.notes.zeitkapselItems.join(', ')}</div>
                              )}
                            </div>
                          )}

                          {/* Presentation & Cheops status */}
                          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-1 text-[11px]">
                            <span className="text-slate-400">
                              Präsentations-Partner:{' '}
                              {team.presentationPartnerGroup ? (
                                <strong className="text-amber-300">
                                  {team.presentationPartnerGroup.partner1} & {team.presentationPartnerGroup.partner2}
                                </strong>
                              ) : (
                                <span className="text-slate-500 italic">Noch nicht zugeordnet</span>
                              )}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              team.cheopsUnlocked 
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {team.cheopsUnlocked ? '🔑 Cheops freigeschaltet' : '⏳ Cheops ausstehend'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Unpaired Students list */}
            {unpairedStudents.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Noch ohne 2er-Partner ({unpairedStudents.length}):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {unpairedStudents.map(stud => (
                    <span 
                      key={stud.id}
                      className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {stud.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: OFFICIAL MUSTERLÖSUNGEN */}
      {activeTab === 'solutions' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-amber-500/20 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="text-xs font-semibold text-amber-400">Didaktischer Leitfaden</div>
                <h3 className="font-display font-bold text-lg text-amber-200">
                  Offizielle Musterlösungen & Erwartungshorizonte
                </h3>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Lösungsblatt drucken</span>
              </button>
            </div>

            {/* Section A: 8 Beobachtungsfragen */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                <Scroll className="w-4 h-4 text-amber-400" />
                1. Lösungen der 8 Beobachtungs- & Verständnisfragen (Einzelarbeit)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TEXT_QUESTIONS.map((q) => (
                  <div key={q.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">{q.title}</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">{q.category}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-200">{q.question}</p>
                    <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-200/90 leading-relaxed">
                      <strong>Musterlösung:</strong> {q.sampleSolution}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section B: Quiz Answer Key */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h4 className="font-bold text-sm text-cyan-300 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                2. Lösungen der 6 Multiple-Choice-Quizfragen
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QUIZ_QUESTIONS.map((q) => (
                  <div key={q.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300">Frage {q.id}</span>
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        Richtige Option: {q.correctAnswer}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">{q.question}</p>
                    <p className="text-xs text-slate-400">{q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section C: Group Work Guidelines */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="font-bold text-sm text-purple-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                3. Didaktische Hinweise zur Gruppen- & Kreativphase
              </h4>
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong>Think-Pair-Share:</strong> Fördert den Austausch über historische Tragweite von Erfindungen (Papyrus als Wissensspeicher vs. Kalender für Landwirtschaft und Zeitmessung).
                </p>
                <p>
                  <strong>Gruppenpuzzle:</strong> Jedes Gruppenmitglied sollte vor der Plakatgestaltung 2–3 Minuten ungestört Notizen formulieren. Die 4 Rollen decken Transport, Technik, Religion und Archäologie ab.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-slate-900 border border-amber-500/20 rounded-3xl p-6 shadow-xl space-y-6 max-w-2xl">
          <h3 className="font-display font-bold text-lg text-amber-200 border-b border-slate-800 pb-3">
            Unterrichts-Einstellungen
          </h3>

          {/* Solution Visibility Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 block">
              Sichtbarkeit der Musterlösungen für Schüler:innen:
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  checked={teacherSettings.allowStudentSolutionView === true}
                  onChange={() => updateTeacherSettings({ allowStudentSolutionView: true })}
                  className="text-amber-500 focus:ring-amber-400"
                />
                <span>Schüler dürfen Musterlösungen zur Selbstkontrolle vergleichen (Empfohlen)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  checked={teacherSettings.allowStudentSolutionView === false}
                  onChange={() => updateTeacherSettings({ allowStudentSolutionView: false })}
                  className="text-amber-500 focus:ring-amber-400"
                />
                <span>Lösungen nur im Lehrer-Cockpit sichtbar (Prüfungsmodus)</span>
              </label>
            </div>
          </div>

          {/* YouTube Video ID Config */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-200 block">
              YouTube Video-ID oder Link (Standard: L9jJ_EwuaE4):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={teacherSettings.customYoutubeId}
                onChange={(e) => updateTeacherSettings({ customYoutubeId: e.target.value })}
                placeholder="z.B. L9jJ_EwuaE4 oder vollständiger YouTube-Link"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={() => updateTeacherSettings({ customYoutubeId: 'L9jJ_EwuaE4' })}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-xl"
              >
                Standard
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Trage hier die Video-ID oder den vollständigen YouTube-Link ein.
            </p>
          </div>

          {/* Teacher Codes Cheat-Sheet */}
          <div className="space-y-4 pt-4 border-t border-slate-800 bg-slate-950/60 p-5 rounded-2xl border border-amber-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Übersicht aller Lehrer-Codes & Passwörter</span>
              </h4>
              <span className="text-[11px] text-amber-300 bg-amber-950/60 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                Passwörter sind nicht case-sensitiv
              </span>
            </div>

            <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-200/90 leading-relaxed">
              <strong>Hinweis zum Überspringen:</strong> Wenn Schüler:innen Station 2 oder 3 bereits vorab im Unterricht, auf Papier oder in OneNote gelöst haben, können sie dies der Lehrperson mitteilen. Die Lehrperson gibt ihnen das jeweilige Passwort zum Überspringen ein oder gibt es ihnen an:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-amber-500/30 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase">Station 2 überspringen</span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded">Textbausteine</span>
                </div>
                <span className="font-mono font-black text-amber-300 text-lg">Gize</span>
                <span className="text-[11px] text-slate-300 block mt-1">
                  Füllt alle 3 Lückentexte korrekt aus, verleiht das Text-Abzeichen und springt sofort zu Station 3 (Quiz).
                </span>
              </div>

              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-amber-500/30 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase">Station 3 überspringen</span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded">Wissens-Quiz</span>
                </div>
                <span className="font-mono font-black text-amber-300 text-lg">Sphinx</span>
                <span className="text-[11px] text-slate-300 block mt-1">
                  Schliesst das Quiz mit voller Punktzahl (6/6) ab, verleiht das Quiz-Abzeichen und springt sofort zu Station 4 (Gruppenarbeit).
                </span>
              </div>

              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-cyan-500/30 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase">Station 4 freischalten</span>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-1.5 py-0.5 rounded">Quiz-Fehler &ge; 3</span>
                </div>
                <span className="font-mono font-black text-cyan-300 text-lg">Ramses</span>
                <span className="text-[11px] text-slate-300 block mt-1">
                  Wird bei &ge;3 Fehlern im Quiz verlangt (nach persönlicher mündlicher Prüfung/Besprechung).
                </span>
              </div>

              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-purple-500/30 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-purple-400 font-bold uppercase">Station 5 Urkunde</span>
                  <span className="text-[10px] bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded">Gruppenarbeit</span>
                </div>
                <span className="font-mono font-black text-purple-300 text-lg">Cheops</span>
                <span className="text-[11px] text-slate-300 block mt-1">
                  Schaltet die Urkunde frei, nachdem die 2er-Gruppe ihr Rollenspiel vor einer anderen Gruppe präsentiert hat.
                </span>
              </div>

              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-emerald-500/30 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Lehrer-Pult PIN</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded">Admin</span>
                </div>
                <span className="font-mono font-black text-emerald-300 text-lg">4051</span>
                <span className="text-[11px] text-slate-300 block mt-1">
                  Öffnet dieses Lehrer-Pult (Erlenmatt-PLZ).
                </span>
              </div>
            </div>
          </div>

          {/* Reset Action */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-200 block">
                Aktiven Schüler zurücksetzen:
              </label>
              <button
                onClick={() => {
                  if (confirm('Möchtest du den aktuellen Fortschritt dieses Schülers wirklich auf 0 zurücksetzen?')) {
                    resetCurrentStudent();
                  }
                }}
                className="mt-1 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Fortschritt des aktiven Schülers zurücksetzen</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <label className="text-xs font-bold text-rose-400 block">
                Gesamte 5. Klassen & App zurücksetzen (Neustart von vorn):
              </label>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Setzt alle Schüler:innen auf 0, öffnet die Namensauswahl und startet die Lerneinheit von Station 1.
              </p>
              <button
                onClick={() => {
                  if (confirm('Möchtest du wirklich die gesamte App und alle Schüler:innen der 5. Klassen (5a & 5b) auf den Neuzustand zurücksetzen?')) {
                    resetEntireApp();
                    setIsTeacherMode(false);
                  }
                }}
                className="mt-2 px-4 py-2 bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Gesamte App & Klassen (5a & 5b) zurücksetzen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECTOR MODAL FOR INDIVIDUAL STUDENT */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-400">Schülerheft-Einsicht</span>
                <h3 className="font-display font-bold text-xl text-white">
                  {inspectingStudent.name} ({inspectingStudent.schoolClass})
                </h3>
              </div>
              <button
                onClick={() => setInspectingStudent(null)}
                className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Video Notes */}
            <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-amber-300">Notizen zum Video:</span>
              <p className="text-xs text-slate-200 italic">
                {inspectingStudent.videoNotes || 'Keine Notizen erfasst.'}
              </p>
            </div>

            {/* Written Question Answers */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-300 block">
                Schriftliche Antworten (Station 2):
              </span>
              <div className="space-y-2">
                {TEXT_QUESTIONS.map((q) => {
                  const ans = inspectingStudent.textAnswers[q.id];
                  return (
                    <div key={q.id} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="font-bold text-slate-300">{q.id}. {q.question}</div>
                      <div className="text-amber-200">
                        {ans ? ans : <span className="text-slate-500 italic">Noch keine Antwort eingetragen</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quiz & Group task results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-cyan-300 block mb-1">Station 3: Quiz-Ergebnis</span>
                <div className="font-extrabold text-white text-base">
                  {inspectingStudent.quizScore} / 6 Punkte
                </div>
                <div className="text-slate-400">
                  Gesamtfehler: <strong className={(inspectingStudent.quizErrorsCount || 0) >= 3 ? 'text-rose-400' : 'text-slate-300'}>{inspectingStudent.quizErrorsCount || 0}</strong>
                </div>
                {inspectingStudent.quizRamsesUnlocked ? (
                  <div className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30 mt-1">
                    ✓ Mit Lehrkraft-Code „Ramses“ freigeschaltet
                  </div>
                ) : (inspectingStudent.quizErrorsCount || 0) >= 3 ? (
                  <div className="text-rose-400 font-bold bg-rose-500/10 px-2 py-1 rounded border border-rose-500/30 mt-1">
                    ⚠️ 3 Fehler: Mündliche Erklärung bei Lehrkraft erforderlich!
                  </div>
                ) : null}
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-purple-300 block mb-1">Station 4: 2er-Team & Aufgabe</span>
                {inspectingStudent.groupPartner1 && inspectingStudent.groupPartner2 ? (
                  <>
                    <div className="font-bold text-amber-300 text-sm">
                      Team: {inspectingStudent.groupPartner1} & {inspectingStudent.groupPartner2}
                    </div>
                    <div className="text-slate-300">
                      Gewählte Aufgabe:{' '}
                      <strong className="text-white">
                        {inspectingStudent.groupTaskChoice === 'erfindungen' 
                          ? '1. Erfindungen-Check' 
                          : inspectingStudent.groupTaskChoice === 'puzzle' 
                          ? '2. Pyramiden-Puzzle' 
                          : inspectingStudent.groupTaskChoice === 'kreativ' 
                          ? '3. Kreativ-Werkstatt' 
                          : 'Noch nicht gewählt'}
                      </strong>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Status: {inspectingStudent.groupCompleted ? '✓ Abgeschlossen' : 'In Bearbeitung'}
                    </div>
                    {inspectingStudent.assignedPresentationGroup && (
                      <div className="text-[11px] text-amber-300">
                        Präsentations-Team: {inspectingStudent.assignedPresentationGroup.partner1} & {inspectingStudent.assignedPresentationGroup.partner2}
                      </div>
                    )}
                    <div className="text-[11px]">
                      Code Cheops: {inspectingStudent.groupCheopsUnlocked ? (
                        <span className="text-emerald-400 font-bold">✓ Eingegeben & Station 5 freigeschaltet</span>
                      ) : (
                        <span className="text-slate-400">Ausstehend</span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-slate-500 italic">Noch kein 2er-Team aus der Klassenliste eingetragen.</div>
                )}
              </div>
            </div>

            {/* Booklet & Submission Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-slate-800 pt-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Lösungsheft-Status:</span>
                <div className="mt-1 font-bold text-sm">
                  {!inspectingStudent.usedSolutionBooklet ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      ⭐ Ohne Lösungsheft gemeistert!
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1.5">
                      📖 Lösungsheft verwendet
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Ergebnisse Abgegeben:</span>
                <div className="mt-1 font-bold text-sm">
                  {inspectingStudent.submittedToTeacher ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      ✅ Abgegeben um {inspectingStudent.submittedAt || 'heute'}
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      ⏳ Noch nicht abgegeben
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectingStudent(null)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <h3 className="font-display font-bold text-base text-amber-300 mb-3">
              Neuen Schüler anlegen
            </h3>
            <form onSubmit={handleCreateStudent} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Name:</label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="z.B. Tim Becker"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Klasse:</label>
                <input
                  type="text"
                  value={newStudentClass}
                  onChange={(e) => setNewStudentClass(e.target.value)}
                  placeholder="z.B. Klasse 5a oder Klasse 5b"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Anlegen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

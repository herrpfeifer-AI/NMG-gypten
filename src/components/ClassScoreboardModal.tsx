import React, { useState } from 'react';
import { 
  Trophy, 
  X, 
  Sparkles, 
  Search, 
  Medal, 
  CheckCircle2, 
  Users, 
  HelpCircle, 
  Scroll, 
  Video, 
  Award,
  Crown,
  Star
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { StudentProgress } from '../types';

interface ClassScoreboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClassScoreboardModal: React.FC<ClassScoreboardModalProps> = ({ isOpen, onClose }) => {
  const { studentsList, student: activeStudent, setCurrentStation } = useProgress();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'points' | 'name' | 'quiz'>('points');

  if (!isOpen) return null;

  // Calculate student total score
  const calculateStudentScore = (s: StudentProgress): { total: number; quizPts: number; badgesCount: number; rankTitle: string; rankBadge: string } => {
    let pts = 0;
    if (s.videoWatched) pts += 15;
    // cloze text
    if (s.textCompleted) pts += 30;
    // quiz (up to 6 questions * 8 pts = 48 pts)
    const quizPts = (s.quizScore || 0) * 8;
    pts += quizPts;
    // group completed
    if (s.groupCompleted) pts += 25;
    // cheops unlocked
    if (s.groupCheopsUnlocked) pts += 15;
    // badges bonus
    const badgesCount = s.badges.length;
    pts += badgesCount * 5;

    let rankTitle = 'Jung-Archäologe';
    let rankBadge = '🔍';
    if (pts >= 120) {
      rankTitle = 'Oberster Pharaonen-Gelehrter';
      rankBadge = '👑';
    } else if (pts >= 95) {
      rankTitle = 'Meister-Ägyptologe';
      rankBadge = '🏆';
    } else if (pts >= 65) {
      rankTitle = 'Tempelschreiber';
      rankBadge = '📜';
    } else if (pts >= 35) {
      rankTitle = 'Pyramiden-Forscher';
      rankBadge = '🏺';
    }

    return { total: pts, quizPts, badgesCount, rankTitle, rankBadge };
  };

  const processedStudents = studentsList.map(s => {
    const stats = calculateStudentScore(s);
    return {
      ...s,
      ...stats,
      isCurrentUser: s.name === activeStudent.name
    };
  });

  // Sort
  const sortedStudents = [...processedStudents].sort((a, b) => {
    if (sortBy === 'points') return b.total - a.total;
    if (sortBy === 'quiz') return (b.quizScore || 0) - (a.quizScore || 0);
    return a.name.localeCompare(b.name, 'de');
  });

  // Filter
  const filteredStudents = sortedStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-4xl w-full shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Klasse 5b • Herr Pfeifer & Frau Escher
                </span>
              </div>
              <h3 className="font-display font-extrabold text-lg sm:text-2xl text-amber-300">
                Klassen-Punkte & Forscher-Rangliste
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors shrink-0"
            title="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Mitschüler:in suchen..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end flex-wrap">
            <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Sortieren:</span>
            <button
              onClick={() => setSortBy('points')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                sortBy === 'points'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Gesamt-Punkte
            </button>
            <button
              onClick={() => setSortBy('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                sortBy === 'quiz'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Quiz-Ergebnis
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                sortBy === 'name'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Name (A-Z)
            </button>
          </div>
        </div>

        {/* Student Cards List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 divide-y divide-slate-800/60 max-h-[60vh]">
          {filteredStudents.map((s, index) => {
            const isTop3 = index < 3 && sortBy === 'points';
            return (
              <div
                key={s.id}
                className={`pt-3 first:pt-0 p-3 rounded-2xl transition-all ${
                  s.isCurrentUser
                    ? 'bg-amber-500/15 border-2 border-amber-400/80 shadow-lg shadow-amber-500/10'
                    : isTop3
                    ? 'bg-slate-850/60 border border-amber-500/30'
                    : 'bg-slate-900/50 border border-slate-800/80 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Place & Student Info */}
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      index === 0 && sortBy === 'points'
                        ? 'bg-yellow-400 text-slate-950 shadow-md shadow-yellow-400/30'
                        : index === 1 && sortBy === 'points'
                        ? 'bg-slate-300 text-slate-950'
                        : index === 2 && sortBy === 'points'
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {sortBy === 'points' ? `#${index + 1}` : <Medal className="w-4 h-4 text-slate-400" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-bold text-sm sm:text-base text-white">
                          {s.name}
                        </span>
                        {s.isCurrentUser && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider animate-pulse">
                            Du ⭐
                          </span>
                        )}
                        <span className="text-xs text-amber-300 font-medium flex items-center gap-1 bg-slate-950/60 px-2 py-0.5 rounded-lg border border-amber-500/20">
                          <span>{s.rankBadge}</span>
                          <span>{s.rankTitle}</span>
                        </span>
                      </div>
                      
                      {/* Sub-status badges */}
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 flex-wrap">
                        {s.groupPartner2 && (
                          <span className="flex items-center gap-1 text-purple-300">
                            <Users className="w-3 h-3 text-purple-400" />
                            2er-Team mit {s.groupPartner2}
                          </span>
                        )}
                        {s.submittedToTeacher && (
                          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Ergebnisse abgegeben
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Scores & Stations status */}
                  <div className="flex items-center gap-3 sm:gap-4 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                    <div className="flex items-center gap-2 sm:gap-3 text-center text-xs">
                      <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800" title="Quiz-Punkte">
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Quiz</span>
                        <span className="font-bold text-amber-300 flex items-center gap-1 justify-center">
                          <HelpCircle className="w-3 h-3 text-amber-400" />
                          {s.quizScore || 0}/6
                        </span>
                      </div>

                      <div className="bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800" title="Schätze & Abzeichen">
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Schätze</span>
                        <span className="font-bold text-cyan-300 flex items-center gap-1 justify-center">
                          <Award className="w-3 h-3 text-cyan-400" />
                          {s.badgesCount}
                        </span>
                      </div>

                      <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/50 to-slate-950">
                        <span className="block text-[10px] text-amber-400/90 font-bold uppercase">Punkte</span>
                        <span className="font-display font-extrabold text-base sm:text-lg text-yellow-300">
                          {s.total} <span className="text-[10px] font-normal text-amber-400">Pkt</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Note */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Punkte setzen sich zusammen aus Video-Notizen, Textbausteinen, Wissens-Quiz und Theater-Gruppenarbeit!</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md"
          >
            Fertig ✓
          </button>
        </div>

      </div>
    </div>
  );
};

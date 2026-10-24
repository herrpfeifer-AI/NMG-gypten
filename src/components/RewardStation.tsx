import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Scroll, 
  Sun, 
  Bug, 
  Crown, 
  Sparkles, 
  Printer, 
  CheckCircle, 
  Calendar,
  User,
  PartyPopper,
  Send,
  Lightbulb,
  BookOpen,
  Pencil,
  Camera,
  Laptop,
  ArrowRight,
  Theater
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { BADGES } from '../data/learningData';
import { HieroglyphGame } from './HieroglyphGame';
import { NextStepsModal } from './NextStepsModal';

interface RewardStationProps {
  onOpenPhotoWall?: () => void;
  onOpenScoreboard?: () => void;
}

export const RewardStation: React.FC<RewardStationProps> = ({
  onOpenPhotoWall,
  onOpenScoreboard
}) => {
  const { student, triggerCelebration, submitResultsToTeacher } = useProgress();
  const [activeTab, setActiveTab] = useState<'certificate' | 'hieroglyphs'>('certificate');
  const [isNextStepsModalOpen, setIsNextStepsModalOpen] = useState(false);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return Sun;
      case 'Scroll': return Scroll;
      case 'Bug': return Bug;
      case 'Crown': return Crown;
      case 'Award': return Award;
      default: return Trophy;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const todayDate = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const allCompleted = student.videoWatched && student.textCompleted && student.quizCompleted && student.groupCompleted;

  const getImprovementTip = () => {
    if ((student.quizErrorsCount || 0) >= 2 || (student.quizScore || 0) < 5) {
      return 'Achte beim Video noch genauer auf die Details zum Pyramidenbau (z.B. den Transport der 2,5-Tonnen-Kalksteine über Kanäle und Schlitten). Mit gezielten Notizen im Forscherheft erreichst du beim nächsten Wissens-Quiz mit Leichtigkeit alle 6 von 6 Punkten!';
    }
    if (!student.videoNotes || student.videoNotes.trim().length < 25) {
      return 'Nutze dein digitales Notizheft bei Station 1 noch intensiver! Notiere dir Jahreszahlen, Götternamen und Werkzeuge direkt beim Schauen – das spart Zeit und festigt dein Expertenwissen.';
    }
    if (student.usedSolutionBooklet) {
      return 'Versuche bei der nächsten Runde, alle kniffligen Textbausteine ganz ohne das Lösungsheft zu enträtseln – du hast das Zeug dazu, auch die schwersten Hieroglyphen ganz allein zu meistern!';
    }
    return 'Herausragende Forscherarbeit! Als nächste Meister-Herausforderung kannst du bei der 2er-Gruppenarbeit den Sketch auswendig vortragen oder eine noch längere Zeitkapsel-Liste mit historischen Begründungen verfassen!';
  };

  return (
    <div className="space-y-8">
      {/* Celebration Header */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/50 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
          <PartyPopper className="w-4 h-4 text-amber-400" />
          Die Schatzkammer der Pharaonen
        </div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400">
          Deine Verdienten Schätze & Auszeichnungen
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Für jede erfolgreich abgeschlossene Lerneinheit hast du ein heiliges Artefakt des alten Ägyptens errungen.
        </p>

        <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={triggerCelebration}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 text-xs inline-flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Fanfare abspielen!</span>
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'certificate' ? 'hieroglyphs' : 'certificate')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold rounded-xl text-xs inline-flex items-center gap-2 transition-all"
          >
            {activeTab === 'certificate' ? (
              <>
                <span>𓁹 Zum Hieroglyphen-Spiel</span>
              </>
            ) : (
              <>
                <Scroll className="w-4 h-4" />
                <span>Zurück zur Urkunde</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'certificate'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Scroll className="w-4 h-4" />
            <span>1. Schätze & Urkunde</span>
          </button>
          <button
            onClick={() => setActiveTab('hieroglyphs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'hieroglyphs'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md font-extrabold'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-sm">𓁹</span>
            <span>2. Hieroglyphen-Spiel & Zeichnungsheft</span>
          </button>
        </div>
      </div>

      {activeTab === 'hieroglyphs' ? (
        <HieroglyphGame />
      ) : (
        <>
          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {BADGES.map((badge) => {
          const Icon = getBadgeIcon(badge.icon);
          const isUnlocked = student.badges.includes(badge.id) || (badge.id === 'badge-master' && allCompleted);

          return (
            <div
              key={badge.id}
              className={`p-5 rounded-3xl border transition-all text-center flex flex-col items-center justify-between relative overflow-hidden group ${
                isUnlocked
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-xl shadow-amber-500/10 hover:-translate-y-1'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              {isUnlocked && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
              )}

              <div className="space-y-3">
                <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center p-0.5 shadow-lg ${
                  isUnlocked ? `bg-gradient-to-br ${badge.color}` : 'bg-slate-800'
                }`}>
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Icon className={`w-8 h-8 ${isUnlocked ? 'text-amber-300 group-hover:scale-110 transition-transform' : 'text-slate-600'}`} />
                  </div>
                </div>

                <div>
                  <h4 className={`text-xs font-bold leading-tight ${isUnlocked ? 'text-amber-200' : 'text-slate-400'}`}>
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 w-full">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isUnlocked 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {isUnlocked ? 'Freigeschaltet' : 'Gesperrt'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Teacher Submission Action Banner */}
      <div className={`p-5 sm:p-6 rounded-3xl border transition-all ${
        student.submittedToTeacher 
          ? 'bg-emerald-950/50 border-emerald-500/40' 
          : 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/70 border-2 border-amber-500/60 shadow-xl'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              student.submittedToTeacher 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
            }`}>
              {student.submittedToTeacher ? <CheckCircle className="w-6 h-6" /> : <Send className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-amber-200">
                {student.submittedToTeacher 
                  ? 'Ergebnisse erfolgreich an Lehrperson abgegeben!' 
                  : 'Expedition beendet? Ergebnisse der Lehrperson abgeben!'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {student.submittedToTeacher 
                  ? `Deine Ergebnisse wurden übermittelt (Abgabe um ${student.submittedAt || 'heute'}). Die Lehrperson sieht deinen Fortschritt im Klassen-Dashboard!` 
                  : 'Klicke auf den Button, damit die Lehrperson im Lehrer-Pult sieht, wie weit du bist und welche Aufgaben du gelöst hast.'}
              </p>
            </div>
          </div>

          {!student.submittedToTeacher ? (
            <button
              onClick={submitResultsToTeacher}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Ergebnisse der Lehrperson abgeben</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 shrink-0">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Bereits abgegeben ({student.submittedAt || 'Heute'})</span>
            </div>
          )}
        </div>
      </div>

      {/* Official Certificate Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-amber-200">
              Deine Persönliche Ägyptologen-Urkunde
            </h3>
            <p className="text-xs text-slate-400">
              Zum Ausdrucken für deine Mappe oder das Klassenzimmer!
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl border border-amber-500/30 text-xs flex items-center gap-2 shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Urkunde drucken / PDF</span>
          </button>
        </div>

        {/* Printable Certificate Card */}
        <div 
          id="egypt-certificate" 
          className="papyrus-bg text-slate-900 border-8 border-double border-amber-700 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Ancient Corner Ornaments */}
          <div className="absolute top-3 left-3 text-amber-800 font-display text-xl select-none">𓀀</div>
          <div className="absolute top-3 right-3 text-amber-800 font-display text-xl select-none">𓁹</div>
          <div className="absolute bottom-3 left-3 text-amber-800 font-display text-xl select-none">𓃭</div>
          <div className="absolute bottom-3 right-3 text-amber-800 font-display text-xl select-none">𓆣</div>

          <div className="max-w-xl mx-auto text-center space-y-4">
            
            {/* Top Seal */}
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-amber-600 to-yellow-600 p-1 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#fbf5e6] rounded-full flex items-center justify-center text-amber-900 font-display font-black text-2xl">
                𓋹
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold tracking-widest text-amber-900 uppercase">
                Akademie der Pharaonen & Archäologie
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-amber-950 uppercase tracking-wider">
                Offizielle Urkunde
              </h2>
              <p className="text-xs text-amber-900/80 font-serif italic">
                Hiermit wird feierlich beurkundet, dass
              </p>
            </div>

            {/* Student Name */}
            <div className="py-2 border-b-2 border-amber-800/40">
              <span className="font-display font-bold text-2xl sm:text-3xl text-amber-950 underline decoration-amber-600/50 decoration-wavy">
                {student.name || 'Junge/r Forscher/in'}
              </span>
              <div className="text-xs text-amber-900 font-semibold mt-1">
                {student.schoolClass}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-serif">
              die historische Expedition <strong>„Was macht Woozle im alten Ägypten?“</strong> erfolgreich absolviert hat. 
              Hieroglyphen, der Pyramidenbau der Cheops-Pyramide, die Geheimnisse der Mumifizierung und die Erfindungen der Pharaonen wurden mit Bravour erforscht!
            </p>

            {/* Extra Würdigung (Self-reliance praise without solution booklet) */}
            {!student.usedSolutionBooklet ? (
              <div className="my-2 py-2 px-3 bg-amber-500/20 border-2 border-amber-700/60 rounded-xl text-center shadow-inner">
                <div className="flex items-center justify-center gap-1.5 text-amber-950 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                  <span>Besondere Würdigung: Ohne Lösungsheft gemeistert!</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                </div>
                <p className="text-xs text-amber-950 font-serif italic mt-0.5 font-semibold">
                  „Diese Expedition wurde vollständig aus eigener Denkkraft und ohne Hilfe des Lösungshefts gemeistert. Eine wahrhaft pharaonische Meisterleistung!“
                </p>
              </div>
            ) : (
              <div className="my-1.5 py-1 px-3 bg-amber-900/5 border border-amber-800/20 rounded-xl text-center">
                <p className="text-[10px] text-amber-900 font-serif italic">
                  Erfolgreich absolviert mit Unterstützung des offiziellen Lösungshefts.
                </p>
              </div>
            )}

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-2 py-3 bg-amber-900/10 rounded-2xl border border-amber-900/20 text-center">
              <div>
                <span className="block text-[10px] uppercase font-bold text-amber-900">Quiz-Ergebnis</span>
                <span className="font-display font-bold text-sm sm:text-base text-amber-950">
                  {student.quizScore}/6 Punkte
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-amber-900">Schätze</span>
                <span className="font-display font-bold text-sm sm:text-base text-amber-950">
                  {student.badges.length} Relikte
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-amber-900">Hilfsmittel</span>
                <span className="font-display font-bold text-xs sm:text-sm text-amber-950">
                  {!student.usedSolutionBooklet ? 'Ohne Hilfe ⭐' : 'Mit Lösungsheft'}
                </span>
              </div>
            </div>

            {/* Improvement Tip for next time on the certificate */}
            <div className="my-3 p-3 bg-amber-900/10 border border-amber-800/30 rounded-xl text-left">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                <Lightbulb className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <span>Persönlicher Tipp für das nächste Mal:</span>
              </div>
              <p className="text-xs text-amber-950 font-serif italic mt-1 leading-relaxed">
                „{getImprovementTip()}“
              </p>
            </div>

            {/* Signature Area */}
            <div className="pt-4 grid grid-cols-3 items-center text-xs text-amber-900 border-t border-amber-800/30">
              <div className="text-left">
                <span className="block text-[10px] text-amber-800">Datum:</span>
                <span className="font-bold">{todayDate}</span>
                <span className="block text-[10px] text-amber-800/80 mt-0.5">{student.schoolClass || 'NMG 5. Klassen'}</span>
              </div>

              <div className="text-center">
                <span className="text-lg">𓋹 𓏏 𓈖</span>
                <span className="block text-[9px] uppercase tracking-wider text-amber-800">Siegel des Pharao</span>
              </div>

              <div className="text-right">
                <span className="block text-[10px] text-amber-800">Begutachtet durch:</span>
                <span className="font-bold font-child text-xs sm:text-sm block">Fachlehrperson NMG</span>
                <span className="block text-[9px] text-amber-800/80">NMG 5. Klassen</span>
              </div>
            </div>

          </div>
        </div>
        {/* SECTION: WIE GEHT ES JETZT WEITER? (3 MÖGLICHKEITEN) */}
        <div className="mt-8 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 p-0.5 shadow-md shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400 font-display font-bold text-xl">
                  𓋹
                </div>
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                  Geschafft! • Deine nächsten Aufgaben
                </span>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-amber-200 mt-1">
                  Wie geht es weiter? (3 Möglichkeiten)
                </h3>
              </div>
            </div>

            <button
              onClick={() => setIsNextStepsModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Fenster im Vollbild öffnen</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-300">
            Du hast deine Ägyptologen-Urkunde erhalten, <strong className="text-amber-300">{student.name}</strong>! Nun hast du die freie Wahl zwischen 3 spannenden Möglichkeiten:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* OPTION 1: BÜCHER LESEN & ONENOTE */}
            <div className="bg-gradient-to-br from-emerald-950/60 to-slate-950 border border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-emerald-400 transition-all group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
                    1. Möglichkeit
                  </span>
                  <h4 className="font-display font-bold text-base text-emerald-200 mt-0.5">
                    Bücher lesen & OneNote
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Gehe leise in die <strong>Leseecke</strong> im Klassenzimmer und lies in den Sachbüchern über das alte Ägypten – oder öffne dein Tablet (OneNote) und arbeite an deinen Notizen weiter.
                </p>
              </div>

              <div className="pt-2 border-t border-emerald-500/20 text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5" />
                <span>Leseecke / OneNote</span>
              </div>
            </div>

            {/* OPTION 2: HIEROGLYPHEN-SPIEL */}
            <div className="bg-gradient-to-br from-purple-950/60 to-slate-950 border border-purple-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-purple-400 transition-all group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-display text-amber-300">𓁹</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 block">
                    2. Möglichkeit
                  </span>
                  <h4 className="font-display font-bold text-base text-purple-200 mt-0.5">
                    Hieroglyphen-Spiel & Zeichnungsheft
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Schreibe deinen Namen in eine <strong>königliche Kartusche</strong>, teste das Übersetzungstool und zeichne die Symbole in dein <strong>Zeichnungsheft</strong> ab!
                </p>
              </div>

              <button
                onClick={() => setActiveTab('hieroglyphs')}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102"
              >
                <span>Hieroglyphen-Studio öffnen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* OPTION 3: THEATER VON ANDEREN KINDERN ANSCHAUEN */}
            <div className="bg-gradient-to-br from-amber-950/60 to-slate-950 border border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-amber-400 transition-all group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform">
                  <Theater className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
                    3. Möglichkeit
                  </span>
                  <h4 className="font-display font-bold text-base text-amber-200 mt-0.5">
                    Theater anderer Kinder anschauen
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Schau leise bei den <strong>Theater-Aufführungen anderer Gruppen</strong> im Zimmer zu oder wirf einen Blick auf die <strong>Klassen-Fotowand</strong>!
                </p>
              </div>

              <div className="space-y-2">
                {onOpenPhotoWall && (
                  <button
                    onClick={onOpenPhotoWall}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Fotowand öffnen</span>
                  </button>
                )}
                {onOpenScoreboard && (
                  <button
                    onClick={onOpenScoreboard}
                    className="w-full py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Klassen-Punkte prüfen</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )}

  {/* Next Steps Modal Dialog */}
  <NextStepsModal
    isOpen={isNextStepsModalOpen}
    onClose={() => setIsNextStepsModalOpen(false)}
    onOpenHieroglyphs={() => setActiveTab('hieroglyphs')}
    onOpenPhotoWall={onOpenPhotoWall || (() => {})}
    onOpenScoreboard={onOpenScoreboard || (() => {})}
  />

</div>
  );
};

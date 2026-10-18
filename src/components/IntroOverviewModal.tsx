import React from 'react';
import { 
  Compass, 
  X, 
  Video, 
  Scroll, 
  HelpCircle, 
  Users, 
  Trophy, 
  User, 
  UserCheck, 
  Sparkles, 
  ChevronRight,
  Send,
  BookOpen
} from 'lucide-react';

interface IntroOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartStation1: () => void;
}

export const IntroOverviewModal: React.FC<IntroOverviewModalProps> = ({ 
  isOpen, 
  onClose, 
  onStartStation1 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-[#0c121e] border-2 border-amber-500/40 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Header Banner */}
        <div className="p-5 sm:p-6 border-b border-amber-500/30 bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/50 flex items-start justify-between relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3.5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 flex items-center justify-center shadow-lg font-display text-2xl font-black shrink-0">
              𓋹
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 mb-1">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Klasse 5b • Herr Pfeifer & Frau Escher</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-amber-200">
                Willkommen zur Ägypten-Expedition!
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
            title="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-slate-200">
          
          {/* Intro Text */}
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-2">
            <h3 className="font-display font-bold text-sm sm:text-base text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Was erwartet die Klasse 5b in dieser Lerneinheit?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Gemeinsam mit Woozle Goozle und Moderator Marc reist die <strong>Klasse 5b von Herr Pfeifer & Frau Escher</strong> tausende Jahre zurück in das Land der Pharaonen! 
              In dieser digitalen Lerneinheit durchlauft ihr <strong>5 aufeinander aufbauende Stationen</strong>. Ihr werdet dabei 
              <strong> mal einzeln, mal zu zweit und mal in einer Gruppe</strong> zusammenarbeiten.
            </p>
            <div className="pt-1.5 flex items-center gap-2 text-xs font-semibold text-amber-300/90 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>Schritt 1:</strong> Gleich nach diesem Überblick wählt jedes Kind seinen eigenen Namen aus der Klassenliste aus!</span>
            </div>
          </div>

          {/* Work Modes Overview */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Eure Arbeitsformen in dieser Einheit:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>1. Einzelarbeit (alleine)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Bei Station 1 (Video schauen & Notizen) sowie Station 2 & 3 (Textbausteine & Wissens-Quiz) forscht jede/r konzentriert für sich.
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-purple-300 font-bold">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>2. Zu zweit (2er-Team)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  In Station 4 bildet ihr ein festes 2er-Team aus der Klassenliste (20 Schüler:innen) und wählt gemeinsam eine Vertiefungsaufgabe.
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>3. In der Gruppe präsentieren</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Nach der 2er-Werkstatt stellt ihr eure Ergebnisse einem anderen 2er-Team vor und holt euch den Geheimcode bei der Lehrkraft!
                </p>
              </div>

            </div>
          </div>

          {/* The 5 Stations Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Die 5 Stationen eurer Pharaonen-Expedition:
            </h4>

            <div className="space-y-2.5">
              
              {/* Station 1 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold text-xs border border-amber-500/30">
                  <Video className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-200">Station 1: Film ab! (Video schauen)</span>
                    <span className="text-[10px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">Einzelarbeit</span>
                  </div>
                  <p className="text-slate-300 mt-1">
                    Schau dir das ca. 22-minütige Video „Was macht Woozle im alten Ägypten?“ an und mache dir im Forscherheft wichtige Notizen zum Pyramidenbau und den Pharaonen.
                  </p>
                </div>
              </div>

              {/* Station 2 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold text-xs border border-cyan-500/30">
                  <Scroll className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-200">Station 2: Die Textbausteine</span>
                    <span className="text-[10px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">Einzelarbeit</span>
                  </div>
                  <p className="text-slate-300 mt-1">
                    Setze die gemischten Textbausteine in 3 Hieroglyphen-Lückentexte ein. <em>Wichtig:</em> Erst wenn alle 3 Rätsel fehlerfrei gelöst sind, wird Station 3 für dich geöffnet!
                  </p>
                </div>
              </div>

              {/* Station 3 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 font-bold text-xs border border-purple-500/30">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-200">Station 3: Das Forscher-Quiz</span>
                    <span className="text-[10px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">Einzelarbeit</span>
                  </div>
                  <p className="text-slate-300 mt-1">
                    6 knifflige Fragen zum Video. Beim 1. Fehlversuch gibt es einen Tipp, beim 2. die Lösung. Wer 3 Fehler sammelt, erklärt die Fragen mündlich bei der Lehrperson und erhält den Code <strong>„Ramses“</strong>!
                  </p>
                </div>
              </div>

              {/* Station 4 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 font-bold text-xs border border-pink-500/30">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-200">Station 4: 2er-Gruppenwerkstatt & Präsentation</span>
                    <span className="text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-500/30">2er-Team & Gruppe</span>
                  </div>
                  <p className="text-slate-300 mt-1">
                    Wählt zu zweit ein Thema für euer kurzes Ägypten-Theater (<em>„Transport & Baustelle“</em> oder <em>„Grabbeigaben & Tal der Könige“</em>). Sobald eine weitere 2er-Gruppe fertig ist, führt ihr euch gegenseitig euer Theater vor, gebt Feedback und holt euch danach bei der Lehrperson den geheimen Freischaltcode für die Urkunde ab!
                  </p>
                </div>
              </div>

              {/* Station 5 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center shrink-0 font-bold text-xs border border-yellow-500/30">
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-200">Station 5: Die Schatzkammer & Urkunde</span>
                    <span className="text-[10px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">Abschluss</span>
                  </div>
                  <p className="text-slate-300 mt-1">
                    Erhalte deine persönliche Ägyptologen-Urkunde mit individuellem Forscher-Tipp für das nächste Mal. Wer ohne Lösungsheft gearbeitet hat, bekommt eine <strong>besondere Pharaonen-Würdigung</strong>! Vergesst nicht, auf <strong>„Ergebnisse der Lehrperson abgeben“</strong> zu klicken.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Tip Footer Banner */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/20 text-xs text-slate-300 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="leading-relaxed">
              <strong>Tipp:</strong> Ihr könnt diesen Stations-Überblick jederzeit oben im Menü über den Button <strong>„Stations-Überblick“</strong> wieder öffnen.
            </p>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Fenster schließen
          </button>

          <button
            onClick={() => {
              onStartStation1();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <span>Weiter zur Namensauswahl (Klasse 5b)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

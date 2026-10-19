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
  BookOpen,
  Pencil
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

  const stations = [
    {
      num: 1,
      title: 'Film ab!',
      shortDesc: '22-Minuten Video schauen & Notizen im Forscherheft machen.',
      mode: 'Allein',
      modeColor: 'text-cyan-300 bg-cyan-950/80 border-cyan-500/30',
      icon: Video,
      iconColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
      symbol: '🎬'
    },
    {
      num: 2,
      title: 'Textbausteine',
      shortDesc: '3 Lückentexte mit Textbausteinen zu Pyramiden und Pharaonen lösen.',
      mode: 'Allein',
      modeColor: 'text-cyan-300 bg-cyan-950/80 border-cyan-500/30',
      icon: Scroll,
      iconColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      symbol: '🧩'
    },
    {
      num: 3,
      title: 'Sphinx-Quiz',
      shortDesc: '6 Wissensfragen knacken → Danach teilt euch die Lehrperson zu zweit ein!',
      mode: 'Allein',
      modeColor: 'text-cyan-300 bg-cyan-950/80 border-cyan-500/30',
      icon: HelpCircle,
      iconColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      symbol: '❓'
    },
    {
      num: 4,
      title: 'Pharaonen-Theater',
      shortDesc: 'Zu zweit ein Theaterstück proben → Zu viert vorführen & Code bei der Lehrperson abholen!',
      mode: 'Zu zweit & 4er-Gruppe',
      modeColor: 'text-purple-300 bg-purple-950/80 border-purple-500/30',
      icon: Users,
      iconColor: 'bg-pink-500/20 text-pink-400 border-pink-500/40',
      symbol: '🎭'
    },
    {
      num: 5,
      title: 'Schatzkammer & Urkunde',
      shortDesc: 'Urkunde drucken + Namen in Hieroglyphen ins Zeichnungsheft malen!',
      mode: 'Abschluss',
      modeColor: 'text-amber-300 bg-amber-950/80 border-amber-500/30',
      icon: Trophy,
      iconColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
      symbol: '📜'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-[#0b101b] border-2 border-amber-500/40 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Header Banner */}
        <div className="p-5 sm:p-6 border-b border-amber-500/30 bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/60 flex items-start justify-between relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
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
                Die Ägypten-Expedition im Überblick
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
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-200">
          
          {/* Quick Notice: Name Selection Next */}
          <div className="bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20 border border-amber-400/40 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👉</span>
              <div>
                <strong className="text-xs sm:text-sm text-amber-200 block">
                  Erster Schritt nach diesem Überblick:
                </strong>
                <span className="text-xs text-slate-300">
                  Jedes Kind wählt seinen eigenen Namen aus der Klassenliste der Klasse 5b aus.
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                onStartStation1();
                onClose();
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shrink-0 shadow transition-all hover:scale-105"
            >
              Direkt zum Namen
            </button>
          </div>

          {/* Visual Roadmap Cards (The 5 Stations) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="font-bold uppercase tracking-wider text-amber-400">
                Eure Route durch die 5 Stationen:
              </span>
              <span>1 bis 5 der Reihe nach durchlaufen</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {stations.map((st) => {
                const IconComponent = st.icon;
                return (
                  <div
                    key={st.num}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group shadow-sm"
                  >
                    <div>
                      {/* Top Bar with Number and Mode */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xs font-bold font-mono">
                          {st.num}
                        </span>
                        <span className="text-lg select-none">{st.symbol}</span>
                      </div>

                      <h4 className="font-display font-bold text-xs sm:text-sm text-amber-200 leading-snug">
                        {st.title}
                      </h4>

                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        {st.shortDesc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block ${st.modeColor}`}>
                        {st.mode}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How we work together (Visual 3-Step Guide) */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Wie arbeitet ihr zusammen?</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <User className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Station 1–3: Allein</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Video schauen, Notizen machen, Lückentext und Quiz selbstständig lösen.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-purple-300 font-bold">
                  <Users className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Station 4: Zu zweit</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  <strong>Lehrperson teilt euch ein:</strong> Gemeinsam ein kurzes Theater einstudieren!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Station 4–5: Zu viert</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Theater gegenseitig vorführen, Feedback geben & Freischaltcode bei der Lehrperson abholen!
                </p>
              </div>

            </div>
          </div>

          {/* End activities info */}
          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Pencil className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Tipp für Schnelle:</strong> Am Ende wartet das <strong>Hieroglyphen-Spiel</strong>, bei dem ihr euren Namen ins Zeichnungsheft malen könnt!
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Schließen
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

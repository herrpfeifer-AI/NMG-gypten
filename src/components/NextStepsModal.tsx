import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Theater, 
  X, 
  ArrowRight, 
  Scroll, 
  Camera, 
  Trophy, 
  Laptop, 
  CheckCircle2 
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

interface NextStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHieroglyphs: () => void;
  onOpenPhotoWall: () => void;
  onOpenScoreboard: () => void;
}

export const NextStepsModal: React.FC<NextStepsModalProps> = ({
  isOpen,
  onClose,
  onOpenHieroglyphs,
  onOpenPhotoWall,
  onOpenScoreboard
}) => {
  const { student } = useProgress();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-3xl w-full shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-950/80 via-slate-900 to-purple-950/80 border-b border-amber-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-600 to-yellow-600 p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400 font-display font-bold text-xl">
                𓋹
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Expedition Abgeschlossen • NMG 5. Klassen
                </span>
              </div>
              <h3 className="font-display font-extrabold text-lg sm:text-2xl text-amber-300">
                Herzlichen Glückwunsch! Wie geht es weiter?
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

        {/* Intro */}
        <div className="px-6 pt-5 pb-2 text-center max-w-xl mx-auto space-y-1">
          <p className="text-xs sm:text-sm text-slate-300">
            Du hast deine Ägyptologen-Urkunde erhalten, <strong className="text-amber-300">{student.name}</strong>! 
            Jetzt stehen dir <strong>3 spannende Möglichkeiten</strong> offen:
          </p>
        </div>

        {/* 3 Main Action Cards */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* OPTION 1: BÜCHER LESEN & ONENOTE */}
            <div className="bg-gradient-to-br from-emerald-950/70 to-slate-900 border-2 border-emerald-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-emerald-400 transition-all shadow-lg group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
                    Möglichkeit 1
                  </span>
                  <h4 className="font-display font-bold text-base text-emerald-200 mt-0.5">
                    Bücher lesen & OneNote
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Gehe leise in die <strong>Leseecke</strong> und vertiefe dein Wissen in den Sachbüchern über Pharaonen, Götter und Pyramiden – oder führe deine Notizen auf <strong>OneNote</strong> weiter.
                </p>
              </div>

              <div className="pt-2 border-t border-emerald-500/20">
                <div className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Im Klassenzimmer oder Tablet</span>
                </div>
              </div>
            </div>

            {/* OPTION 2: HIEROGLYPHEN-SPIEL & ZEICHNUNGSHEFT */}
            <div className="bg-gradient-to-br from-purple-950/70 to-slate-900 border-2 border-purple-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-purple-400 transition-all shadow-lg group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-display text-amber-300">𓁹</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 block">
                    Möglichkeit 2
                  </span>
                  <h4 className="font-display font-bold text-base text-purple-200 mt-0.5">
                    Hieroglyphen-Spiel
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Schreibe deinen Namen in eine <strong>königliche Kartusche</strong>, übersetze Wörter und zeichne die heiligen Symbole in dein <strong>Zeichnungsheft</strong> ab!
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenHieroglyphs();
                }}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102"
              >
                <span>Hieroglyphen öffnen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* OPTION 3: THEATER VON ANDEREN KINDERN ANSCHAUEN */}
            <div className="bg-gradient-to-br from-amber-950/70 to-slate-900 border-2 border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all shadow-lg group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform">
                  <Theater className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
                    Möglichkeit 3
                  </span>
                  <h4 className="font-display font-bold text-base text-amber-200 mt-0.5">
                    Theater anderer Kinder
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Schau leise bei den <strong>Theater-Aufführungen anderer 2er-Teams</strong> im Klassenzimmer zu oder bewundere ihre Posen auf der <strong>Klassen-Fotowand</strong>!
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenPhotoWall();
                  }}
                  className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Fotowand ansehen</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenScoreboard();
                  }}
                  className="w-full py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Klassen-Punkte prüfen</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Tipp: Du kannst dieses Fenster jederzeit unten auf der Urkunden-Seite erneut öffnen.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md"
          >
            Verstanden ✓
          </button>
        </div>

      </div>
    </div>
  );
};

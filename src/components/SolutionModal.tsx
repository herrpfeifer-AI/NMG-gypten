import React, { useState, useEffect } from 'react';
import { BookOpen, X, CheckCircle, HelpCircle, Scroll, Users, Printer, Info } from 'lucide-react';
import { TEXT_QUESTIONS, QUIZ_QUESTIONS } from '../data/learningData';
import { useProgress } from '../context/ProgressContext';

interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SolutionModal: React.FC<SolutionModalProps> = ({ isOpen, onClose }) => {
  const { recordSolutionBookletUsed, isTeacherMode } = useProgress();
  const [activeTab, setActiveTab] = useState<'fragen' | 'quiz' | 'gruppen'>('fragen');

  useEffect(() => {
    if (isOpen && !isTeacherMode) {
      recordSolutionBookletUsed();
    }
  }, [isOpen, isTeacherMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-950/60 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Offizielles Begleitmaterial
              </div>
              <h3 className="font-display font-bold text-lg text-amber-200">
                Musterlösungen & Erklärungen
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Drucken</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-5 pt-3 gap-2 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('fragen')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'fragen'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scroll className="w-3.5 h-3.5" />
            <span>1. Die 8 Verständnisfragen</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>2. Quiz-Lösungen</span>
          </button>
          <button
            onClick={() => setActiveTab('gruppen')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'gruppen'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>3. Gruppenaufgaben</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* TAB: 8 QUESTIONS */}
          {activeTab === 'fragen' && (
            <div className="space-y-4">
              {TEXT_QUESTIONS.map((q) => (
                <div key={q.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">{q.title}</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                      {q.category}
                    </span>
                  </div>
                  <p className="text-slate-200 font-medium">{q.question}</p>
                  <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 text-amber-200/90 leading-relaxed">
                    <strong className="text-amber-300">Musterlösung:</strong> {q.sampleSolution}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-4">
              {QUIZ_QUESTIONS.map((q) => (
                <div key={q.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300">Frage {q.id}</span>
                    <span className="font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px]">
                      Richtige Antwort: Option {q.correctAnswer}
                    </span>
                  </div>
                  <p className="text-slate-200 font-semibold">{q.question}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {q.options.map((opt) => (
                      <div
                        key={opt.key}
                        className={`p-2 rounded-lg text-[11px] border flex items-center gap-2 ${
                          opt.key === q.correctAnswer
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="font-bold">{opt.key})</span>
                        <span>{opt.text}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <strong className="text-amber-300">Erklärung:</strong> {q.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB: GROUP WORK */}
          {activeTab === 'gruppen' && (
            <div className="space-y-4 text-slate-300">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-purple-300">Aufgabe 1: Think-Pair-Share (Erfindungen)</h4>
                <p>
                  <strong>Mustererwartung:</strong> Die Schülerinnen und Schüler erkennen den nachhaltigen Nutzen antiker Erfindungen. Insbesondere Papyrus (Ermöglichte Bücher, Bibliotheken, Verwaltung) und der 12-Monats-Kalender (Einteilung unseres heutigen Jahres) gelten historisch als Schlüssel-Entwicklungen.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-purple-300">Aufgabe 2: Gruppenpuzzle „Pyramiden-Detektive“</h4>
                <ul className="list-disc pl-5 space-y-1 text-[11px]">
                  <li><strong>Experte A:</strong> Transport aus weit entfernten Steinbrüchen via Schiffe über den Nil und künstlich abgezweigte Hafenbecken / Kanäle (Papyros-Fund 2017).</li>
                  <li><strong>Experte B:</strong> Transport an Land mit Holzschlitten auf angefeuchtetem Sand, Muskelkraft tausender Arbeiter und ansteigenden Rampen.</li>
                  <li><strong>Experte C:</strong> Grabbeigaben dienten der Versorgung im ewigen Jenseits (Speisen, Möbel, Amulette, Totenmasken).</li>
                  <li><strong>Experte D:</strong> Schutz vor Grabräubern veranlasste Pharaonen im Neuen Reich zum Felsen-Grabbau im abgelegenen Tal der Könige.</li>
                </ul>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-purple-300">Didaktischer Rhythmus-Tipp</h4>
                <p className="text-[11px] text-slate-400">
                  Da das Video ca. 22 Minuten dauert, empfiehlt es sich, die Fragen vorher auszuteilen oder in der App parallel anzeigen zu lassen, damit Schüler:innen währenddessen Stichpunkte im Notizblock festhalten können.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
          >
            Schließen
          </button>
        </div>

      </div>
    </div>
  );
};

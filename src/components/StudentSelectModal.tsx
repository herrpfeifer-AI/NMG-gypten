import React, { useState } from 'react';
import { 
  User, 
  CheckCircle, 
  Search, 
  Sparkles, 
  ChevronRight, 
  UserCheck, 
  Plus, 
  GraduationCap,
  X
} from 'lucide-react';
import { CLASS_STUDENTS } from '../types';
import { sounds } from '../utils/soundEffects';

interface StudentSelectModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSelectStudent: (studentName: string) => void;
  currentStudentName?: string;
  canCloseWithoutSelect?: boolean;
}

// Egyptian explorer avatar hieroglyphs
const HIEROGLYPHS = ['𓀀', '𓋹', '𓃠', '𓆃', '𓇳', '𓁹', '𓃭', '𓆣', '𓎛', '𓊹', '𓍯', '𓏛', '𓀭', '𓅓', '𓆗', '𓇋', '𓈖', '𓂋', '𓌳', '𓄿'];

export const StudentSelectModal: React.FC<StudentSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectStudent,
  currentStudentName,
  canCloseWithoutSelect = false
}) => {
  const [selectedName, setSelectedName] = useState<string>(currentStudentName || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const filteredStudents = CLASS_STUDENTS.filter(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleChooseName = (name: string) => {
    sounds.playPop();
    setSelectedName(name);
  };

  const handleConfirm = () => {
    const finalName = showCustomInput && customName.trim() ? customName.trim() : selectedName;
    if (!finalName) return;
    sounds.playFanfare();
    onSelectStudent(finalName);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 via-[#0c121e] to-slate-950 border-2 border-amber-500/50 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-amber-500/30 bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 relative z-10 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 flex items-center justify-center shadow-lg font-display text-2xl font-black shrink-0">
                𓋹
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/40 mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Klasse 5b • Herr Pfeifer & Frau Escher</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-amber-200">
                  Wer bist du? Wähle deinen Namen aus!
                </h2>
              </div>
            </div>

            {canCloseWithoutSelect && onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
                title="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <p className="text-xs sm:text-sm text-slate-300 mt-2.5">
            Tippe auf deinen Namen in der Klassenliste, um deine persönliche Ägypten-Expedition zu beginnen. 
            Dein Forscherheft, Quiz-Punkte und die Urkunde werden genau für dich gespeichert!
          </p>

          {/* Quick Search Bar */}
          <div className="mt-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Namen schnell suchen..."
              className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 transition-colors"
            />
          </div>
        </div>

        {/* Scrollable Student Cards Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-slate-200 relative z-10">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider">
            <span>Schülerinnen & Schüler der Klasse 5b ({filteredStudents.length}):</span>
            {selectedName && (
              <span className="text-emerald-400 font-semibold normal-case flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Ausgewählt: <strong className="text-white">{selectedName}</strong>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {filteredStudents.map((name, idx) => {
              const isSelected = selectedName === name && !showCustomInput;
              const glyph = HIEROGLYPHS[idx % HIEROGLYPHS.length];

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setShowCustomInput(false);
                    handleChooseName(name);
                  }}
                  className={`group relative p-3 rounded-2xl border text-left transition-all duration-150 flex flex-col items-center justify-center gap-1.5 text-center min-h-[96px] ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-500/30 to-amber-700/20 border-2 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.03]'
                      : 'bg-slate-900/70 border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/80'
                  }`}
                >
                  {/* Selected check badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow">
                      <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}

                  {/* Hieroglyph avatar */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-display text-xl transition-transform group-hover:scale-110 ${
                    isSelected 
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md' 
                      : 'bg-slate-800 text-amber-300/80 border border-slate-700'
                  }`}>
                    {glyph}
                  </div>

                  <span className={`font-bold text-xs sm:text-sm tracking-wide ${
                    isSelected ? 'text-amber-200' : 'text-slate-200 group-hover:text-white'
                  }`}>
                    {name}
                  </span>

                  <span className="text-[10px] text-slate-400">
                    Klasse 5b
                  </span>
                </button>
              );
            })}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs">
              Kein Name gefunden mit „{searchTerm}“.
            </div>
          )}

          {/* Fallback Custom Name Accordion */}
          <div className="pt-2">
            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => {
                  setShowCustomInput(true);
                  setSelectedName('');
                }}
                className="text-xs text-amber-400/80 hover:text-amber-300 underline decoration-dotted flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Mein Name ist nicht aufgeführt? Hier als Gast eintragen</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-2">
                <label className="block text-xs font-bold text-amber-300">
                  Eigenen Namen eintragen:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Vorname & Nachname"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customName.trim()) {
                        setSelectedName(customName.trim());
                      }
                    }}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold"
                  >
                    Übernehmen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Confirmation */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 relative z-10">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            {selectedName ? (
              <span>Du startest als <strong className="text-amber-300">{selectedName}</strong> (Klasse 5b)</span>
            ) : (
              <span>Bitte wähle oben deinen Namen aus, um fortzufahren.</span>
            )}
          </div>

          <button
            type="button"
            disabled={!selectedName && !(showCustomInput && customName.trim())}
            onClick={handleConfirm}
            className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none disabled:transform-none"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {selectedName 
                ? `Als ${selectedName} Expedition starten!` 
                : 'Expedition starten'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

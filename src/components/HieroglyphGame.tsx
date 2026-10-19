import React, { useState } from 'react';
import { 
  Sparkles, 
  Pencil, 
  BookOpen, 
  RotateCcw, 
  CheckCircle2, 
  Trophy, 
  Copy, 
  Check, 
  Printer, 
  HelpCircle,
  Eye,
  Scroll,
  Layers,
  Star,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { sounds } from '../utils/soundEffects';

export interface HieroglyphDefinition {
  char: string;
  hieroglyph: string;
  sound: string;
  meaning: string;
  category: 'Vogel' | 'Tier' | 'Körper' | 'Natur' | 'Gegenstand' | 'Bauwerk' | 'Pflanze';
}

export const HIEROGLYPHS_ALPHABET: HieroglyphDefinition[] = [
  { char: 'A', hieroglyph: '𓄿', sound: 'a', meaning: 'Ägyptischer Geier (Symbol für Schutz & Weisheit)', category: 'Vogel' },
  { char: 'B', hieroglyph: '𓃀', sound: 'b', meaning: 'Unterschenkel & Fuß (Kraft & Vorwärtskommen)', category: 'Körper' },
  { char: 'C', hieroglyph: '𓎡', sound: 'k/c', meaning: 'Geflochtener Korb mit Griff (Gefäß & Besitz)', category: 'Gegenstand' },
  { char: 'D', hieroglyph: '𓂧', sound: 'd', meaning: 'Ausgestreckte Hand (Schaffenskraft)', category: 'Körper' },
  { char: 'E', hieroglyph: '𓇋', sound: 'e/i', meaning: 'Blühendes Schilfblatt am Nil (Leben)', category: 'Pflanze' },
  { char: 'F', hieroglyph: '𓆑', sound: 'f', meaning: 'Gehörnte Hornviper (Wachsamkeit & Schutz)', category: 'Tier' },
  { char: 'G', hieroglyph: '𓎼', sound: 'g', meaning: 'Krugständer aus Holz (Opfergaben)', category: 'Gegenstand' },
  { char: 'H', hieroglyph: '𓉔', sound: 'h', meaning: 'Schilfhütte / Hof (Heimat & Schutzraum)', category: 'Bauwerk' },
  { char: 'I', hieroglyph: '𓇋', sound: 'i', meaning: 'Schilfrohr am Nilufer (Schreibmaterial)', category: 'Pflanze' },
  { char: 'J', hieroglyph: '𓆓', sound: 'j/dsch', meaning: 'Aufgerichtete Kobra / Uräusschlange (Königswürde)', category: 'Tier' },
  { char: 'K', hieroglyph: '𓎡', sound: 'k', meaning: 'Korb mit Tragehenkel', category: 'Gegenstand' },
  { char: 'L', hieroglyph: '𓃭', sound: 'l/r', meaning: 'Ruhender Wüstenlöwe (Macht & Stärke)', category: 'Tier' },
  { char: 'M', hieroglyph: '𓅓', sound: 'm', meaning: 'Schleiereule (Weitsicht & Klugheit)', category: 'Vogel' },
  { char: 'N', hieroglyph: '𓈖', sound: 'n', meaning: 'Gekräuselte Nil-Wasserwelle (Lebensader)', category: 'Natur' },
  { char: 'O', hieroglyph: '𓅱', sound: 'o/u', meaning: 'Junges Wachtelküken (Neuanfang & Energie)', category: 'Vogel' },
  { char: 'P', hieroglyph: '𓊪', sound: 'p', meaning: 'Hocker / Schilfmatte des Schreibers', category: 'Gegenstand' },
  { char: 'Q', hieroglyph: '𓈎', sound: 'q', meaning: 'Sonniger Sandhügel am Wüstenhorizont', category: 'Natur' },
  { char: 'R', hieroglyph: '𓂋', sound: 'r', meaning: 'Menschlicher Mund (Worte & Gesang)', category: 'Körper' },
  { char: 'S', hieroglyph: '𓋴', sound: 's', meaning: 'Gefaltetes feines Leinentuch (Königsstoff)', category: 'Gegenstand' },
  { char: 'T', hieroglyph: '𓏏', sound: 't', meaning: 'Runder Brotlaib (Tägliche Speise)', category: 'Gegenstand' },
  { char: 'U', hieroglyph: '𓅱', sound: 'u', meaning: 'Wachtelküken', category: 'Vogel' },
  { char: 'V', hieroglyph: '𓆑', sound: 'v/f', meaning: 'Hornviper', category: 'Tier' },
  { char: 'W', hieroglyph: '𓍯', sound: 'w', meaning: 'Geknotetes Seil / Lasso', category: 'Gegenstand' },
  { char: 'X', hieroglyph: '𓎡𓋴', sound: 'x (ks)', meaning: 'Korb mit Tuch', category: 'Gegenstand' },
  { char: 'Y', hieroglyph: '𓇌', sound: 'y', meaning: 'Zwei Schilfblätter nebeneinander', category: 'Pflanze' },
  { char: 'Z', hieroglyph: '𓊃', sound: 'z/s', meaning: 'Türriegel des Heiligtums', category: 'Bauwerk' },
  { char: 'Ä', hieroglyph: '𓄿', sound: 'ä/a', meaning: 'Geier', category: 'Vogel' },
  { char: 'Ö', hieroglyph: '𓅱', sound: 'ö/u', meaning: 'Wachtelküken', category: 'Vogel' },
  { char: 'Ü', hieroglyph: '𓇌', sound: 'ü/y', meaning: 'Zwei Schilfblätter', category: 'Pflanze' },
];

export const SPECIAL_GROUPS: { [key: string]: HieroglyphDefinition } = {
  'SCH': { char: 'SCH', hieroglyph: '𓈙', sound: 'sch', meaning: 'Wasserteich mit Lotusblüten', category: 'Natur' },
  'CH': { char: 'CH', hieroglyph: '𓐍', sound: 'ch', meaning: 'Sonnenscheibe / Sieb', category: 'Natur' },
};

export interface DecipherPuzzle {
  id: number;
  word: string;
  hieroglyphs: string;
  hint: string;
  fact: string;
}

export const PUZZLES: DecipherPuzzle[] = [
  { id: 1, word: 'NIL', hieroglyphs: '𓈖 𓇋 𓃭', hint: 'Der längste Fluss Afrikas und die Lebensader Ägyptens.', fact: 'Ohne die jährliche Nilflut hätte es im alten Ägypten keine Ernte und kein Leben gegeben!' },
  { id: 2, word: 'RA', hieroglyphs: '𓂋 𓄿', hint: 'Der mächtige Sonnengott mit dem Falkenkopf.', fact: 'Ra reiste laut Mythos tagsüber mit einer Sonnenbarke über den Himmelsbogen.' },
  { id: 3, word: 'PHARAO', hieroglyphs: '𓊪 𓉔 𓄿 𓂋 𓄿 𓅱', hint: 'Der oberste Herrscher und Gottkönig über Ober- und Unterägypten.', fact: 'Das Wort Pharao bedeutete ursprünglich „Großes Haus“ (der königliche Palast).' },
  { id: 4, word: 'CHEOPS', hieroglyphs: '𓐍 𓅱 𓆑 𓅱', hint: 'Erbauer der größten Pyramide von Gizeh.', fact: 'In Ägypten hieß er eigentlich Chufu. Seine Pyramide war über 3800 Jahre lang das höchste Bauwerk der Welt!' },
  { id: 5, word: 'MUMIE', hieroglyphs: '𓅓 𓅱 𓅓 𓇋 𓇋', hint: 'Ein haltbar gemachter Körper für das ewige Weiterleben.', fact: 'Das Einbalsamieren dauerte bis zu 70 Tage mit speziellem Natronsalz!' },
  { id: 6, word: 'SPHINX', hieroglyphs: '𓋴 𓊪 𓉔 𓇋 𓈖 𓐍', hint: 'Wächterfigur mit Löwenkörper und Menschenkopf vor den Pyramiden.', fact: 'Die große Sphinx von Gizeh blickt genau nach Osten zur aufgehenden Morgensonne.' }
];

export const HieroglyphGame: React.FC = () => {
  const { student } = useProgress();
  const [activeTab, setActiveTab] = useState<'cartouche' | 'drawing_mission' | 'puzzles' | 'alphabet'>('cartouche');
  
  // Cartouche Translator State
  const [inputText, setInputText] = useState<string>(student.name || 'Carla');
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedCharDetail, setSelectedCharDetail] = useState<HieroglyphDefinition | null>(null);

  // Puzzle State
  const [puzzleIdx, setPuzzleIdx] = useState<number>(0);
  const [puzzleInput, setPuzzleInput] = useState<string>('');
  const [puzzleSolved, setPuzzleSolved] = useState<{ [id: number]: boolean }>({});
  const [puzzleError, setPuzzleError] = useState<boolean>(false);

  // Function to translate string into hieroglyph tokens
  const translateToHieroglyphs = (text: string) => {
    const upper = text.toUpperCase().replace(/[^A-ZÄÖÜß\s]/g, '');
    const tokens: HieroglyphDefinition[] = [];
    
    let i = 0;
    while (i < upper.length) {
      const char = upper[i];
      if (char === ' ') {
        tokens.push({ char: ' ', hieroglyph: ' • ', sound: 'Pause', meaning: 'Wortabstand', category: 'Gegenstand' });
        i++;
        continue;
      }
      
      // Check 3-char group 'SCH'
      if (upper.slice(i, i + 3) === 'SCH') {
        tokens.push(SPECIAL_GROUPS['SCH']);
        i += 3;
        continue;
      }
      // Check 2-char group 'CH'
      if (upper.slice(i, i + 2) === 'CH') {
        tokens.push(SPECIAL_GROUPS['CH']);
        i += 2;
        continue;
      }

      // Single char
      const match = HIEROGLYPHS_ALPHABET.find(h => h.char === char);
      if (match) {
        tokens.push(match);
      } else {
        tokens.push({ char, hieroglyph: '𓏤', sound: char.toLowerCase(), meaning: 'Schreiber-Zeichen', category: 'Gegenstand' });
      }
      i++;
    }
    return tokens;
  };

  const translatedTokens = translateToHieroglyphs(inputText);
  const hieroglyphString = translatedTokens.map(t => t.hieroglyph).join(' ');

  const handleCopy = () => {
    sounds.playPop();
    navigator.clipboard.writeText(hieroglyphString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckPuzzle = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPuzzle = PUZZLES[puzzleIdx];
    const cleaned = puzzleInput.trim().toUpperCase();
    if (cleaned === currentPuzzle.word) {
      sounds.playFanfare();
      setPuzzleSolved(prev => ({ ...prev, [currentPuzzle.id]: true }));
      setPuzzleError(false);
    } else {
      sounds.playPop();
      setPuzzleError(true);
    }
  };

  const currentPuzzle = PUZZLES[puzzleIdx];
  const isCurrentPuzzleSolved = puzzleSolved[currentPuzzle.id];
  const totalSolvedPuzzles = Object.keys(puzzleSolved).length;

  return (
    <div className="space-y-6">
      
      {/* Game Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/60 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 flex items-center justify-center font-display font-black text-2xl shadow-xl shrink-0">
              𓁹
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Königliche Schreiber-Akademie • Klasse 5b</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-amber-200">
                Die Hieroglyphen-Werkstatt
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Übersetze jedes Wort sofort in echte altägyptische Schriftzeichen, gestalte deine eigene Namenskartusche und übertrage sie in dein <strong>Zeichnungsheft</strong>!
              </p>
            </div>
          </div>

          {/* Navigation Pill Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveTab('cartouche')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'cartouche'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>𓍹 Kartuschen-Schreiber 𓍺</span>
            </button>
            <button
              onClick={() => setActiveTab('drawing_mission')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'drawing_mission'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>🎨 Zeichnungsheft-Auftrag</span>
            </button>
            <button
              onClick={() => setActiveTab('puzzles')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'puzzles'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Rätsel-Spiel ({totalSolvedPuzzles}/{PUZZLES.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('alphabet')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'alphabet'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Alphabet</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: CARTOUCHE TRANSLATOR */}
      {activeTab === 'cartouche' && (
        <div className="space-y-6">
          
          {/* Input & Quick Buttons Box */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Tippe einen Namen oder ein beliebiges deutsches Wort ein:
                </label>
                <p className="text-xs text-slate-400">
                  Die Hieroglyphen werden sofort in Echtzeit generiert!
                </p>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400">Schnellauswahl:</span>
                {student.name && (
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setInputText(student.name);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold border border-amber-500/30"
                  >
                    Mein Name ({student.name})
                  </button>
                )}
                {['Woozle', 'Pharao', 'Pyramide', 'Nil', 'Cheops', 'Katze'].map(word => (
                  <button
                    key={word}
                    onClick={() => {
                      sounds.playPop();
                      setInputText(word);
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="z.B. Deinen Vornamen hier eingeben..."
                maxLength={30}
                className="w-full bg-slate-950 border-2 border-amber-500/40 rounded-2xl px-5 py-3.5 text-lg text-amber-200 font-bold focus:outline-none focus:border-amber-400 shadow-inner"
              />
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-300 text-xs font-bold"
                >
                  Leeren ×
                </button>
              )}
            </div>
          </div>

          {/* THE ROYAL PHARAONIC CARTOUCHE DISPLAY */}
          <div className="bg-gradient-to-b from-[#181109] via-slate-900 to-[#120d07] border-4 border-amber-600/70 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Königliche Pharaonen-Namenskartusche</span>
            </div>

            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Im alten Ägypten durften nur Könige und Königinnen ihren Namen in einer schützenden Seil-Kartusche tragen. Sie schützte den Namen vor bösen Geistern!
            </p>

            {/* Visual Cartouche Container */}
            <div className="inline-block mx-auto max-w-full">
              <div className="relative p-2 sm:p-3 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 rounded-full shadow-2xl border-2 border-yellow-300">
                <div className="bg-[#f7eed4] text-slate-950 px-6 sm:px-12 py-5 sm:py-7 rounded-full flex items-center justify-center gap-2 sm:gap-4 flex-wrap border-2 border-amber-800 shadow-inner min-h-[90px]">
                  
                  {/* Left Cartouche Cap */}
                  <span className="text-amber-900 font-display font-black text-xl select-none opacity-40">𓍹</span>
                  
                  {translatedTokens.length > 0 ? (
                    translatedTokens.map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          sounds.playPop();
                          setSelectedCharDetail(t);
                        }}
                        className="group flex flex-col items-center justify-center hover:scale-125 transition-transform cursor-pointer p-1 rounded-lg"
                        title={`${t.char} = ${t.meaning}`}
                      >
                        <span className="text-3xl sm:text-4xl text-amber-950 font-display drop-shadow select-none">
                          {t.hieroglyph}
                        </span>
                        <span className="text-[10px] font-bold text-amber-800 group-hover:text-amber-950 font-mono mt-0.5">
                          {t.char}
                        </span>
                      </button>
                    ))
                  ) : (
                    <span className="text-slate-400 italic text-sm">
                      Tippe oben ein Wort ein...
                    </span>
                  )}

                  {/* Right Cartouche Rope Knot Base */}
                  <span className="text-amber-900 font-display font-black text-xl select-none opacity-40">𓍺</span>
                </div>
              </div>
            </div>

            {/* Translation Text Label */}
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-display font-extrabold text-amber-200 uppercase tracking-widest">
                „{inputText || '...'}“
              </h3>
              <p className="text-xs text-slate-400">
                Klicke auf ein Zeichen in der Kartusche, um seine altägyptische Bedeutung zu erfahren!
              </p>
            </div>

            {/* Action Buttons for Cartouche */}
            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold border border-amber-500/30 flex items-center gap-2 shadow transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Kopiert! ✓' : 'Hieroglyphen kopieren'}</span>
              </button>

              <button
                onClick={() => setActiveTab('drawing_mission')}
                className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
              >
                <Pencil className="w-4 h-4" />
                <span>Auftrag fürs Zeichnungsheft ansehen</span>
              </button>
            </div>
          </div>

          {/* Detailed Inspector Card if symbol clicked */}
          {selectedCharDetail && (
            <div className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-5 shadow-xl flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-display text-4xl shrink-0">
                  {selectedCharDetail.hieroglyph}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Buchstabe:</span>
                    <strong className="text-lg font-display text-amber-300">{selectedCharDetail.char}</strong>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      Kategorie: {selectedCharDetail.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {selectedCharDetail.meaning}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Lautwert: <code className="text-amber-400 font-mono">[{selectedCharDetail.sound}]</code>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCharDetail(null)}
                className="text-xs text-slate-400 hover:text-white p-1"
              >
                ✕ Schließen
              </button>
            </div>
          )}

          {/* Breakdown Grid of all characters */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Zeichen-für-Zeichen Erklärung deines Wortes:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {translatedTokens.filter(t => t.char !== ' ').map((token, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedCharDetail(token);
                  }}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400/50 text-center space-y-1 cursor-pointer transition-all hover:scale-105"
                >
                  <div className="text-2xl text-amber-300 font-display select-none">
                    {token.hieroglyph}
                  </div>
                  <div className="text-xs font-bold text-white">
                    {token.char}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">
                    {token.meaning}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ZEICHNUNGSHEFT CREATIVE MISSION */}
      {activeTab === 'drawing_mission' && (
        <div className="bg-gradient-to-br from-purple-950/70 via-slate-900 to-indigo-950/70 border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shrink-0">
              🎨
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Praktischer Forscher-Auftrag für Klasse 5b
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-amber-200">
                Zeichne deine persönliche Pharaonen-Kartusche ins Zeichnungsheft!
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Jetzt wirst du selbst zur königlichen Schreiberin oder zum königlichen Schreiber der Pharaonen! Nimm dein <strong>Zeichnungsheft</strong> und gestalte eine prachtvolle, farbenfrohe Kartusche mit deinem eigenen Namen.
          </p>

          {/* Step-by-Step Drawing Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs">1</span>
                <span>Material bereitlegen:</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Dein <strong>Zeichnungsheft</strong> (weiße Seite).</li>
                <li>Bleistift und Radiergummi für die Skizze.</li>
                <li>Buntstifte, Filzstifte oder Wasserfarben (besonders schön: <strong>Goldgelb</strong>, <strong>Lapislazuli-Dunkelblau</strong>, <strong>Türkis</strong> und <strong>Terrakotta-Rot</strong>).</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs">2</span>
                <span>Die Umrandung (Die Seil-Kartusche):</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zeichne eine große, elegante ovale Schlaufe auf das Blatt. Am unteren Ende zeichnest du einen Querbalken (den verknoteten Seilbund). Das ist der magische Schutzring der Pharaonen!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs">3</span>
                <span>Hieroglyphen sorgfältig übertragen:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Schau dir oben im Reiter <strong>„Kartuschen-Schreiber“</strong> die Hieroglyphen deines Namens an. Zeichne die Tiere, Vögel, Werkzeuge und Wellen von oben nach unten oder von links nach rechts in deine Kartusche!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs">4</span>
                <span>Prachtvoll ausmalen & vorzeigen:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Male den Rand goldgelb wie echtes Pharaonengold an. Die Wasserwellen blau, den Papyrus grün und die Vögel bunt. Zeige deine fertige Meisterkartusche danach <strong>Herr Pfeifer oder Frau Escher</strong>!
              </p>
            </div>

          </div>

          {/* Live Preview of active student's name in hieroglyphs for drawing reference */}
          <div className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-5 text-center space-y-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              Deine Vorlage zum Abzeichnen ({student.name || 'Forscher:in'}):
            </span>
            <div className="text-3xl sm:text-4xl text-amber-300 font-display font-bold py-2 bg-slate-900 rounded-xl border border-slate-800 tracking-wider">
              {translateToHieroglyphs(student.name || 'Carla').map(t => t.hieroglyph).join('  ')}
            </div>
            <p className="text-xs text-slate-400">
              Du kannst die Buchstaben einzeln betrachten und mit Bleistift in dein Heft übertragen.
            </p>
          </div>

        </div>
      )}

      {/* TAB 3: DECIPHER RIDDLE GAME */}
      {activeTab === 'puzzles' && (
        <div className="bg-slate-900 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-w-2xl mx-auto">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-500/30">
                🕵️
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-amber-200">
                  Pharaonen-Detektiv: Rätsel {puzzleIdx + 1} von {PUZZLES.length}
                </h3>
                <span className="text-xs text-slate-400">
                  Entziffere das geheimnisvolle Hieroglyphen-Wort!
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {PUZZLES.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPuzzleIdx(idx);
                    setPuzzleInput('');
                    setPuzzleError(false);
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                    puzzleIdx === idx
                      ? 'bg-amber-400 text-slate-950'
                      : puzzleSolved[p.id]
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {p.id}
                </button>
              ))}
            </div>
          </div>

          {/* Mystery Hieroglyph Display */}
          <div className="bg-slate-950 border-2 border-amber-500/40 rounded-3xl p-8 text-center space-y-4 shadow-inner">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
              Altes Inschriften-Fragment:
            </span>
            <div className="text-4xl sm:text-5xl text-amber-300 font-display font-black tracking-widest drop-shadow-lg select-none">
              {currentPuzzle.hieroglyphs}
            </div>
            
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300 max-w-md mx-auto">
              <strong>Tipp:</strong> {currentPuzzle.hint}
            </div>
          </div>

          {/* Solved View or Input Form */}
          {isCurrentPuzzleSolved ? (
            <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 space-y-3 text-center">
              <div className="inline-flex items-center gap-2 text-emerald-300 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Richtig entziffert: „{currentPuzzle.word}“!</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {currentPuzzle.fact}
              </p>

              {puzzleIdx < PUZZLES.length - 1 ? (
                <button
                  onClick={() => {
                    setPuzzleIdx(prev => prev + 1);
                    setPuzzleInput('');
                    setPuzzleError(false);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-md mt-2"
                >
                  <span>Nächstes Rätsel lösen</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="text-xs font-bold text-amber-300 pt-2">
                  🎉 Meisterleistung! Du hast alle {PUZZLES.length} Hieroglyphen-Rätsel geknackt!
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleCheckPuzzle} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200">
                  Welches deutsche Wort verbirgt sich hinter diesen Hieroglyphen?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={puzzleInput}
                    onChange={(e) => {
                      setPuzzleInput(e.target.value);
                      setPuzzleError(false);
                    }}
                    placeholder="Wort eingeben..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white uppercase tracking-wider focus:outline-none focus:border-amber-400"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all shrink-0 hover:scale-105"
                  >
                    Prüfen ✓
                  </button>
                </div>
              </div>

              {puzzleError && (
                <p className="text-xs text-rose-400 font-semibold flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Noch nicht ganz richtig! Schau dir den Tipp an oder schaue im Reiter „Alphabet“ nach den Buchstaben.</span>
                </p>
              )}
            </form>
          )}

        </div>
      )}

      {/* TAB 4: ALPHABET REFERENCE */}
      {activeTab === 'alphabet' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-amber-200">
                Das ägyptische Hieroglyphen-Alphabet
              </h3>
              <p className="text-xs text-slate-400">
                Alle 26 Buchstaben des Alphabets und ihre altägyptischen Symbole.
              </p>
            </div>
            <span className="text-xs text-amber-300 font-mono">
              26 Lautzeichen
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {HIEROGLYPHS_ALPHABET.map((h) => (
              <div
                key={h.char}
                onClick={() => {
                  sounds.playPop();
                  setSelectedCharDetail(h);
                  setActiveTab('cartouche');
                  setInputText(prev => prev + h.char);
                }}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/60 transition-all text-center space-y-1.5 cursor-pointer hover:scale-105 group"
                title="Klicken zum Hinzufügen"
              >
                <div className="text-3xl text-amber-300 font-display group-hover:scale-110 transition-transform select-none">
                  {h.hieroglyph}
                </div>
                <div className="text-xs font-bold text-white flex items-center justify-center gap-1">
                  <span>{h.char}</span>
                  <span className="text-[10px] text-slate-400 font-mono">[{h.sound}]</span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1 leading-tight">
                  {h.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

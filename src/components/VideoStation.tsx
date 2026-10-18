import React, { useState } from 'react';
import { 
  Play, 
  ExternalLink, 
  CheckCircle, 
  BookMarked, 
  Clock, 
  Sparkles, 
  Scroll, 
  Home, 
  Pyramid, 
  Lightbulb, 
  ChevronRight,
  Info
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { VIDEO_CHAPTERS, YOUTUBE_FALLBACK_URL } from '../data/learningData';

export const VideoStation: React.FC = () => {
  const { student, markVideoWatched, saveVideoNotes, setCurrentStation, teacherSettings } = useProgress();
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);
  const [notes, setNotes] = useState<string>(student.videoNotes || '');
  const [hasChangedNotes, setHasChangedNotes] = useState<boolean>(false);

  const videoId = teacherSettings.customYoutubeId || 'L9jJ_EwuaE4';

  const handleSeek = (seconds: number) => {
    setCurrentTimestamp(seconds);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setHasChangedNotes(true);
  };

  const handleSaveNotes = () => {
    saveVideoNotes(notes);
    setHasChangedNotes(false);
  };

  const getChapterIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scroll': return Scroll;
      case 'Home': return Home;
      case 'Pyramid': return Pyramid;
      case 'Sparkles': return Sparkles;
      case 'Lightbulb': return Lightbulb;
      default: return Play;
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Station 1: Film ab!
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-amber-200">
              „Was macht Woozle im alten Ägypten?“
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Reise mit Woozle und Moderator Marc in die geheimnisvolle Cheops-Pyramide! 
              Schau dir das ca. 22-minütige Video an. Du kannst unten direkt zu den Themen springen und Notizen machen.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
            {student.videoWatched ? (
              <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Video bereits als gesehen markiert!
              </div>
            ) : (
              <button
                onClick={() => {
                  saveVideoNotes(notes);
                  markVideoWatched();
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                Ich habe das Video fertig geschaut!
              </button>
            )}

            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400/90 hover:text-amber-200 flex items-center gap-1 underline underline-offset-2"
            >
              Direkt auf YouTube öffnen <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Video & Chapters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border-2 border-amber-500/30 shadow-2xl aspect-video group">
            <iframe
              key={currentTimestamp}
              className="w-full h-full object-cover"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?start=${currentTimestamp}&autoplay=${currentTimestamp > 0 ? 1 : 0}&rel=0&modestbranding=1`}
              title="Was macht Woozle im alten Ägypten"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Quick controls & helper */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Aktuelle Startzeit: <strong className="text-amber-300">{Math.floor(currentTimestamp / 60)}:{String(currentTimestamp % 60).padStart(2, '0')} min</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSeek(0)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
              >
                Von vorn (00:00)
              </button>
              <a
                href={YOUTUBE_FALLBACK_URL}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg border border-amber-500/30 flex items-center gap-1"
              >
                Alternativ-Link <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Observation Note Pad */}
          <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <BookMarked className="w-4 h-4 text-amber-400" />
                <span>Mein Beobachtungs-Notizblock (während des Schauens)</span>
              </div>
              {hasChangedNotes && (
                <button
                  onClick={handleSaveNotes}
                  className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg transition-colors"
                >
                  Notizen speichern
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-2.5">
              Tipp: Notiere dir Stichpunkte zu Hieroglyphen, dem Stein von Rosette, den Cheops-Steinen und der Mumifizierung!
            </p>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              onBlur={handleSaveNotes}
              placeholder="Schreibe hier deine Beobachtungen und Gedanken auf..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Right: Chapter Navigation & Clues */}
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-sm text-amber-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Kapitel-Direktsprung
              </h3>
              <span className="text-[11px] text-slate-400">5 Themenblöcke</span>
            </div>

            <div className="space-y-2">
              {VIDEO_CHAPTERS.map((chapter) => {
                const Icon = getChapterIcon(chapter.iconName);
                const isActive = currentTimestamp === chapter.timeSeconds;
                return (
                  <button
                    key={chapter.id}
                    onClick={() => handleSeek(chapter.timeSeconds)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 group ${
                      isActive
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 hover:border-amber-500/40 text-slate-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 group-hover:text-amber-200">
                          {chapter.title}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                          {chapter.timeFormatted}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                        {chapter.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expedition Checklist */}
          <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-4 space-y-2 text-xs">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              Detektiv-Auftrag beim Schauen:
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>Warum konnte man Hieroglyphen so lange nicht lesen?</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>Wie kamen die 2,5-Tonnen-Steine zur Baustelle?</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>Was wurde aus den Mumien-Organen gemacht?</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>Welche Erfindungen nutzen wir heute noch?</span>
              </li>
            </ul>
          </div>

          {/* Action To Next Station */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (!student.videoWatched) markVideoWatched();
                saveVideoNotes(notes);
                setCurrentStation('textbausteine');
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
            >
              <span>Weiter zu Station 2: Textbausteine</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
